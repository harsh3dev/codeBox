from django.urls import path
from .views import CodeReviewView, CodeComplexityView, CodeErrorView, StartInterview, GetInterviewProblem,GetInterviewDetails, CompleteInterview, GenerateFeedback

urlpatterns = [
    path('api/code/start/', StartInterview.as_view(), name='start-interview'),
    path('api/code/complete/', CompleteInterview.as_view(), name='complete-interview'),
    path('api/code/review/', CodeReviewView.as_view(), name='code-review'),
    path('api/code/complexity/', CodeComplexityView.as_view(), name='code-complexity'),
    path('api/code/feedback/', GenerateFeedback.as_view(), name='feedback_interview'),
    path('api/code/error/', CodeErrorView.as_view(), name='code-error'),
    path('api/interview/question/', GetInterviewProblem.as_view(), name='interview-question'),
    path('api/get-interview-details/<int:interview_id>/', GetInterviewDetails.as_view(), name='get_interview_details')
]