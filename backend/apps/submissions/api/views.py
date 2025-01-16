from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import CodeSubmission
from ..services.code_executor import CodeExecutor
from .serializers import CodeSubmissionSerializer
from rest_framework.permissions import AllowAny

class CodeSubmissionViewSet(viewsets.ModelViewSet):
    queryset = CodeSubmission.objects.all()
    serializer_class = CodeSubmissionSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def submit(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        
        executor = CodeExecutor(
            submission=submission,
            test_cases=submission.test_cases
        )
        
        result = executor.execute()
        
        submission.status = 'completed' if result['success'] else 'error'
        submission.save()
        
        return Response(result)
