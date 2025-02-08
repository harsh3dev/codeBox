from django.urls import path
from .views import ProblemCreateView

urlpatterns = [
    path('create/', ProblemCreateView.as_view(), name='problem-create'),
    # URL pattern for creating a new problem
    # ...existing code...
]
