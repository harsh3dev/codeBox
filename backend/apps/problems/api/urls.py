from django.urls import path
from .views import (
    ProblemCreateView, ProblemGetView, ProblemListView, ProblemBySlugView,
    ProblemTestCasesView, TestCaseCreateView, TestCaseUpdateView, 
    TestCaseDeleteView, BulkTestCaseCreateView
)

urlpatterns = [
    # Existing problem URLs
    path('create/', ProblemCreateView.as_view(), name='problem-create'),
    path('get/', ProblemGetView.as_view(), name='problem-get'),
    path('problem/', ProblemBySlugView.as_view(), name='problem-get-slug'),
    path('list/', ProblemListView.as_view(), name='problem-list'),
    # Test case URLs
    path('testcases/<int:problem_id>/', ProblemTestCasesView.as_view(), name='problem-testcases'),
    path('testcase/create/', TestCaseCreateView.as_view(), name='testcase-create'),
    path('testcase/<int:id>/update/', TestCaseUpdateView.as_view(), name='testcase-update'),
    path('testcase/<int:id>/delete/', TestCaseDeleteView.as_view(), name='testcase-delete'),
    path('testcases/<int:problem_id>/bulk-create/', BulkTestCaseCreateView.as_view(), name='testcase-bulk-create'),
]