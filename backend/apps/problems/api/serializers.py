from rest_framework import serializers
from ..models import Problem, TestCase

class ProblemSerializer(serializers.ModelSerializer):
    """
    Serializer for the Problem model.
    Converts Problem model instances to JSON format and vice versa.
    """
    class Meta:
        model = Problem
        fields = '__all__'
    
    def validate_default_code_templates(self, value):
        """
        Validate the default_code_templates field.
        Ensures it's a dictionary with language keys and code string values.
        """
        if not isinstance(value, dict):
            raise serializers.ValidationError("Default code templates must be a dictionary")
        
        for lang, code in value.items():
            if not isinstance(lang, str):
                raise serializers.ValidationError("Language keys must be strings")
            if not isinstance(code, str):
                raise serializers.ValidationError("Code templates must be strings")
        
        return value

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ['id', 'problem', 'input_data', 'expected_output', 'is_sample', 'explanation', 'order']
