from rest_framework import generics
from .serializers import ProblemSerializer
from ..models import Problem

class ProblemCreateView(generics.CreateAPIView):
    """
    API view to create a new Problem instance.
    Only authenticated users can access this view.
    """
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
