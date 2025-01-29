from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from apps.problems.models import Question  
from apps.user.models import User  
from .models import InterviewSession
from .serializers import QuestionSerializer  

class QuestionList(APIView):
    def get(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StartInterview(APIView):
    def post(self, request):
        user = request.user
        question_ids = request.data.get('question_ids', [])
        questions = Question.objects.filter(id__in=question_ids)

        if not questions.exists():
            return Response({"error": "No valid questions selected."}, status=status.HTTP_400_BAD_REQUEST)

        interview = InterviewSession.objects.create(user=user)
        interview.questions.set(questions)
        interview.save()

        return Response({"message": "Interview started!", "interview_id": interview.id}, status=status.HTTP_201_CREATED)