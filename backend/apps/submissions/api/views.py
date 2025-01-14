from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import CodeSubmission
from ..services.code_executor import CodeExecutor
from .serializers import CodeSubmissionSerializer

class CodeSubmissionViewSet(viewsets.ModelViewSet):
    queryset = CodeSubmission.objects.all()
    serializer_class = CodeSubmissionSerializer
    
    @action(detail=False, methods=['post'])
    def submit(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save(user=request.user)
        
        executor = CodeExecutor(
            submission=submission,
            test_cases=submission.problem.testcase_set.all()
        )
        
        result = executor.execute()
        
        submission.status = 'completed' if result['success'] else 'error'
        submission.save()
        
        return Response(result)