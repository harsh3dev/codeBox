from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from apps.problems.models import Problem  
from apps.user.models import User  
from .models import InterviewSession
from .serializers import QuestionSerializer,InterviewSessionSerializer,CodeSerializer
from .utils.execute_ai_tool import execute_ai_tool, generateAIFeedback
import logging
logger = logging.getLogger(__name__)

class QuestionList(APIView):
    def get(self, request):
        questions = Problem.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StartInterview(APIView):
    def post(self, request):
        id = request.data.get('id')
        question_id = request.data.get('question_id')
        user=User.objects.get(id=id)
        if not user:
            return Response({"error": "User is not signup."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the question
        question = Problem.objects.get(id=question_id)
        logger.info(f"Question: {question}")
        if not question:
            return Response({"error": "Invalid question selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new interview session
        interview = InterviewSession.objects.create(user=user,question=question)
        interview.save()

        return Response({"message": "Interview started!", "interview_id": interview.id}, status=status.HTTP_201_CREATED)
    
class CodeReviewView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            response = execute_ai_tool('code_review', code)
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CodeComplexityView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            response = execute_ai_tool('time_complexity', code)
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CodeErrorView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            error = serializer.validated_data.get('error', '')
            response = execute_ai_tool('error_assistance', code, error)
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetInterviewProblem(APIView):
    def post(self, request):
        id = request.data.get('id')
        interview = InterviewSession.objects.get(id=id)

        if not interview:
            return Response({"error": "No interview session found."}, status=status.HTTP_400_BAD_REQUEST)

        question = interview.question
        serializer = QuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)



class GetInterviewDetails(APIView):
    def get(self, request, interview_id):
        interview = InterviewSession.objects.get(id=interview_id)

        if not interview:
            return Response({"error": "No interview session found."}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the interview session details
        serializer = InterviewSessionSerializer(interview)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CompleteInterview(APIView):
    def post(self, request):
        interview_id = request.data.get('interview_id')
        interview = InterviewSession.objects.get(id=interview_id)

        if not interview:
            return Response({"error": "No interview session found."}, status=status.HTTP_400_BAD_REQUEST)

        interview.complete_interview()
        return Response({"message": "Interview completed!"}, status=status.HTTP_200_OK)

class GenerateFeedback(APIView):
    def post(self, request):
        interview_id = request.data.get('interview_id')

        interview = InterviewSession.objects.get(id=interview_id)

        if not interview:
            return Response({"error": "No interview session found."}, status=status.HTTP_400_BAD_REQUEST)
        
        if interview.is_completed:
            return Response({"message": "Feedback saved!", "feedback": interview.feedback}, status=status.HTTP_200_OK)
        
        feedback = generateAIFeedback(interview.chat_history, interview.ai_notes)

        interview.feedback = feedback
        interview.save()
        return Response({"message": "Feedback saved!", "feedback": feedback}, status=status.HTTP_200_OK)