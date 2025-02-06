from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from apps.problems.models import Problem  
from .models import InterviewSession
from .serializers import QuestionSerializer  

class QuestionList(APIView):
    def get(self, request):
        question = Problem.objects.all()
        serializer = QuestionSerializer(question, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StartInterview(APIView):
    def post(self, request):
        user = request.user
        question_id = request.data.get('question_id')

        # Ensure question_id is provided
        if not question_id:
            return Response({"error": "No question selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the question
        question = Problem.objects.filter(id=question_id)

        if not question:
            return Response({"error": "Invalid question selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new interview session
        interview = InterviewSession.objects.create(user=user)
        interview.question.add(question)  # Add the single question to the interview session
        interview.save()

        return Response({"message": "Interview started!", "interview_id": interview.id}, status=status.HTTP_201_CREATED)
