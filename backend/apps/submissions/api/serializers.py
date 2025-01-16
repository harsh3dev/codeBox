from rest_framework import serializers
from ..models import CodeSubmission

class CodeSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSubmission
        fields = ['code', 'language', 'test_cases']
