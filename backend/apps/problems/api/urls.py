from django.urls import path
from .views import ProblemCreateView,ProblemGetView,ProblemListView

urlpatterns = [
    path('create/', ProblemCreateView.as_view(), name='problem-create'),
    path('get/', ProblemGetView.as_view(), name='problem-get'),
    path('list/', ProblemListView.as_view(), name='problem-list'),
]
