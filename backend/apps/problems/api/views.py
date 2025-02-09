from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProblemSerializer
from ..models import Problem

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
