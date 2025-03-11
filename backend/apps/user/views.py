from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from google.auth.transport import requests as google_requests
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from rest_framework import status
from googleapiclient.discovery import build
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
from .utils.auth import GoogleOAuthHandler
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)
User = get_user_model()

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                "user": serializer.data,
                "access": access_token,
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                "message": "Login successful",
                "access": access_token,
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
        
        # Log invalid login attempt
        logger.warning(f"Invalid login attempt for email: {email}")
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        flow = GoogleOAuthHandler.get_oauth_flow()
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent',
        )
        return redirect(authorization_url)

class GoogleCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            code = request.GET.get('code')
            if not code:
                return Response({"error": "Code not found in request"}, status=status.HTTP_400_BAD_REQUEST)

            flow = GoogleOAuthHandler.get_oauth_flow()
            flow.fetch_token(code=code)
            credentials = flow.credentials

            # Fetch user info
            service = build('oauth2', 'v2', credentials=credentials)
            user_info = service.userinfo().get().execute()

            # Get or create user
            user, created = User.objects.get_or_create(
                email=user_info['email'],
                defaults={
                    'google_id': user_info['id'],
                    'full_name': user_info.get('name', ''),
                }
            )

            # Update user's Google tokens
            user.access_token = credentials.token
            user.refresh_token = credentials.refresh_token
            if isinstance(credentials.expiry, int):  
                user.token_expiry = datetime.now() + timedelta(seconds=credentials.expiry)
            elif isinstance(credentials.expiry, datetime): 
                user.token_expiry = credentials.expiry
            user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Redirect to frontend with token
            redirect_url = f"{settings.FRONTEND_URL}?token={refresh}"
            return redirect(redirect_url)

        except Exception as e:
            logger.error(f"Google Callback Error: {str(e)}")
            return Response({
                "error": str(e),
                "details": "Authentication failed"
            }, status=status.HTTP_400_BAD_REQUEST)

class TokenRefreshView(APIView):
    def post(self, request):
        try:
            user = request.user

            # Check if the Google token is expired
            if user.token_expiry and user.token_expiry < datetime.now():
                success = GoogleOAuthHandler.refresh_google_token(user)
                if not success:
                    return Response(
                        {'error': 'Failed to refresh Google token'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

            # Generate new JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })

        except Exception as e:
            logger.error(f"Token Refresh Error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class LogoutView(APIView):
    def post(self, request):
        try:
            user = request.user
            user.access_token = None
            user.refresh_token = None
            user.token_expiry = None
            user.save()

            return Response({'message': 'Successfully logged out'})
        except Exception as e:
            logger.error(f"Logout Error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
        })