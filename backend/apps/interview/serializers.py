from rest_framework import serializers
from apps.problems.models import Problem

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'difficulty']  