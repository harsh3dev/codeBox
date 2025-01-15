from rest_framework import serializers
from ..models import CodeSubmission

class CodeSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSubmission
        fields = ['id', 'problem', 'code', 'language', 'status', 
                 'created_at', 'execution_time', 'memory_used']
        read_only_fields = ['user', 'status', 'execution_time', 'memory_used']