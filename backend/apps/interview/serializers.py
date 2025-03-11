from rest_framework import serializers
from apps.problems.models import Problem
from .models import InterviewSession

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'difficulty','default_code_templates']  

class CodeSerializer(serializers.Serializer):
    code = serializers.CharField()
    error = serializers.CharField(required=False, allow_blank=True)


class InterviewSessionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = InterviewSession
        fields = ['id', 'user_email', 'question', 'start_time', 'end_time', 'is_completed', 'chat_history', 'ai_notes', 'initial_prompt_sent', 'feedback']
