from django.urls import path
from .views import SignupView, LoginView, GoogleLoginView, GoogleCallbackView, TokenRefreshView,LogoutView,CurrentUserView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('auth/google/login/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/google/callback/', GoogleCallbackView.as_view(), name='google-callback'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('user/me/', CurrentUserView.as_view(), name='current-user'),
]
