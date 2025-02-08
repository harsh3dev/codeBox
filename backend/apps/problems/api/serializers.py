from rest_framework import serializers
from ..models import Problem

class ProblemSerializer(serializers.ModelSerializer):
    """
    Serializer for the Problem model.
    Converts Problem model instances to JSON format and vice versa.
    """
    class Meta:
        model = Problem
        fields = '__all__'
