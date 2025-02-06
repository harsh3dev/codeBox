from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from apps.problems.models import Problem  
from apps.user.models import User  
from .models import InterviewSession
from .serializers import QuestionSerializer  
from .serializers import CodeSerializer
from .utils.execute_ai_tool import execute_ai_tool

class QuestionList(APIView):
    def get(self, request):
        questions = Problem.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StartInterview(APIView):
    def post(self, request):
        user = request.user
        question_id = request.data.get('question_id')

        if not question_id:
            return Response({"error": "No question selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the question
        question = Problem.objects.filter(id=question_id)

        if not question:
            return Response({"error": "Invalid question selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new interview session
        interview = InterviewSession.objects.create(user=user)
        interview.question.add(question)  # Add the single question to the interview session
        interview.save()

        return Response({"message": "Interview started!", "interview_id": interview.id}, status=status.HTTP_201_CREATED)
    
class CodeReviewView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            response = execute_ai_tool('code_review', code)
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CodeComplexityView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            response = execute_ai_tool('time_complexity', code)
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CodeErrorView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            error = serializer.validated_data.get('error', '')
            response = execute_ai_tool('error_assistance', code, error)
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
