import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import InterviewSession
from apps.problems.models import Problem
from .utils.ai_chat import generate_ai_message  
import logging

logger = logging.getLogger(__name__)

class InterviewConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.interview_id = self.scope['url_route']['kwargs']['interview_id']
        try: 
            logger.info(f"connecting to interview {self.interview_id}")
            
            # Get interview session
            self.interview = await sync_to_async(InterviewSession.objects.get)(id=self.interview_id)
            
            # Get related fields using sync_to_async
            self.user = await sync_to_async(lambda: self.interview.user)()
            self.user_full_name = await sync_to_async(lambda: self.user.full_name)()
            self.question = await sync_to_async(lambda: self.interview.question)()
            self.question_description = await sync_to_async(lambda: self.question.description)()
            
            self.chat_history = ""  
            self.ai_notes = ""  
            self.initial_prompt_sent = False  
            
            # Store user information and question description in WebSocket session
            self.scope['username'] = self.user_full_name
            self.scope['question_description'] = self.question_description
            
            logger.info(f"connected to interview {self}")
            await self.accept()

            # Send the first welcome message and question
            await self.send_initial_message()
            
        except InterviewSession.DoesNotExist:
            logger.error(f"Interview {self.interview_id} not found.")
            await self.close()

    async def disconnect(self, close_code):
        logger.info(f"WebSocket connection closed with code {close_code}.")

    async def send_initial_message(self):
        username = self.scope['username']
        welcome_message = f"Welcome to the interview, {username}. " \
                         f"The question is: '{self.question.title}'. Can you explain your approach?"
        await self.send(text_data=json.dumps({
            'type': 'ai_message',
            'message': welcome_message,
        }))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if 'answer' in data:
                candidate_response = data['answer']
                logger.info(f"Candidate's response: {candidate_response}")
                self.chat_history += f"\nCandidate: {candidate_response}"
                
                # Handle first message to AI with username and question description
                if not self.initial_prompt_sent:
                    username = self.scope['username']
                    question_description = self.scope['question_description']
                    
                    ai_message, self.ai_notes = await sync_to_async(generate_ai_message)(
                        username=username,
                        question_description=question_description,
                        chat_history=self.chat_history,
                        ai_notes=self.ai_notes,
                        is_initial=True
                    )
                    self.initial_prompt_sent = True
                else:
                    # For subsequent messages, send chat history and AI notes
                    ai_message, self.ai_notes = await sync_to_async(generate_ai_message)(
                        chat_history=self.chat_history,
                        ai_notes=self.ai_notes,
                        is_initial=False
                    )

                # Send the AI-generated follow-up message to the candidate
                await self.send(text_data=json.dumps({
                    'type': 'ai_message',
                    'message': ai_message,
                }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Invalid message format. Expected an answer.',
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format.',
            }))