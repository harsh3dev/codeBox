from django.urls import path
from .views import CodeReviewView, CodeComplexityView, CodeErrorView

urlpatterns = [
    path('api/code/review/', CodeReviewView.as_view(), name='code-review'),
    path('api/code/complexity/', CodeComplexityView.as_view(), name='code-complexity'),
    path('api/code/error/', CodeErrorView.as_view(), name='code-error'),
]