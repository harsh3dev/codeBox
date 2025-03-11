from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from django.conf import settings

class GoogleOAuthHandler:
    SCOPES = ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile','openid']

    @classmethod
    def get_oauth_flow(cls):
        return Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=cls.SCOPES,
            redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI
        )

    @classmethod
    def refresh_google_token(cls, user):
        if not user.refresh_token:
            return False

        credentials = Credentials(
            None,
            refresh_token=user.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_OAUTH2_CLIENT_ID,
            client_secret=settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        )

        try:
            credentials.refresh(Request())
            user.update_tokens(
                access_token=credentials.token,
                expiry=credentials.expiry
            )
            return True
        except Exception as e:
            print(f"Token refresh failed: {e}")
            return False
