from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import ProblemSerializer,TestCaseSerializer
from ..models import Problem,TestCase
from django.shortcuts import get_object_or_404

class ProblemCreateView(generics.CreateAPIView):
    """
    API view to create a new Problem instance.
    Only authenticated users can access this view.
    """
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

class ProblemGetView(generics.GenericAPIView):
    """
    API view to retrieve a Problem by ID from query parameter.
    """
    serializer_class = ProblemSerializer

    def get(self, request):
        try:
            problem_id = request.query_params.get('id')
            if not problem_id:
                return Response(
                    {"error": "Problem ID is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            problem = Problem.objects.get(id=problem_id)
            serializer = self.get_serializer(problem)
            return Response(serializer.data)

        except Problem.DoesNotExist:
            return Response(
                {"error": f"Problem with ID {problem_id} not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProblemListView(generics.ListAPIView):
    """
    API view to list all Problems.
    """
    serializer_class = ProblemSerializer
    
    def get_queryset(self):
        return Problem.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProblemBySlugView(generics.GenericAPIView):
    """
    API view to retrieve a Problem by slug from query parameter.
    """
    serializer_class = ProblemSerializer

    def get(self, request):
        try:
            slug = request.query_params.get('slug')
            if not slug:
                return Response(
                    {"error": "Problem slug is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            problem = Problem.objects.get(slug=slug)
            serializer = self.get_serializer(problem)
            return Response(serializer.data)

        except Problem.DoesNotExist:
            return Response(
                {"error": f"Problem with slug {slug} not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class ProblemTestCasesView(generics.ListAPIView):

    serializer_class = TestCaseSerializer

    def get_queryset(self):
        problem_id = self.kwargs.get('problem_id')
        is_sample = self.request.query_params.get('is_sample', None)
        
        queryset = TestCase.objects.filter(problem_id=problem_id)
        if is_sample is not None:
            queryset = queryset.filter(is_sample=is_sample.lower() == 'true')
        
        return queryset.order_by('order')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'testcases': serializer.data
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TestCaseCreateView(generics.CreateAPIView):
    """
    API view to create a new test case for a problem.
    """
    serializer_class = TestCaseSerializer

    def create(self, request, *args, **kwargs):
        try:
            problem_id = request.data.get('problem')
            get_object_or_404(Problem, id=problem_id)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class TestCaseUpdateView(generics.UpdateAPIView):
    """
    API view to update an existing test case.
    """
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class TestCaseDeleteView(generics.DestroyAPIView):
    """
    API view to delete a test case.
    """
    queryset = TestCase.objects.all()
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                {"message": "Test case deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class BulkTestCaseCreateView(APIView):
    """
    API view to create multiple test cases at once for a problem.
    """
    def post(self, request, problem_id):
        try:
            problem = get_object_or_404(Problem, id=problem_id)
            test_cases = request.data.get('test_cases', [])
            
            created_test_cases = []
            for test_case in test_cases:
                test_case['problem'] = problem.id
                serializer = TestCaseSerializer(data=test_case)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                created_test_cases.append(serializer.data)
            
            return Response({
                'message': f'Successfully created {len(created_test_cases)} test cases',
                'test_cases': created_test_cases
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )