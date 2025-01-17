from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import CodeSubmission
from ..services.code_executor import CodeExecutor
from .serializers import CodeSubmissionSerializer
from rest_framework.permissions import AllowAny
from asgiref.sync import async_to_sync

class CodeSubmissionViewSet(viewsets.ModelViewSet):
    queryset = CodeSubmission.objects.all()
    serializer_class = CodeSubmissionSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def submit(self, request):
        try:
            # Validate and save submission
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            submission = serializer.save()
            
            # Create executor instance
            executor = CodeExecutor(
                submission=submission,
                test_cases=submission.test_cases
            )
            
            # Execute code and await result
            result = async_to_sync(executor.execute)()
            
            # Update submission status
            submission.status = 'Accepted' if result['success'] else 'error'
            submission.save()
            
            return Response(result)
            
        except Exception as e:
            # Handle any errors that occur during execution
            if submission:
                submission.status = 'error'
                submission.save()
                
            return Response({
                'message': f'Execution error: {str(e)}',
                'error': True,
                'success': False,
                'output_value': '',
                'input': '',
                'expected_output': ''
            }, status=500)