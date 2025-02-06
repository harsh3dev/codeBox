from rest_framework import serializers
from apps.problems.models import Problem

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'difficulty']  

class CodeSerializer(serializers.Serializer):
    code = serializers.CharField()
    error = serializers.CharField(required=False, allow_blank=True)