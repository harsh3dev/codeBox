import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import InterviewSession
from apps.problems.models import Problem
from .utils.prompt import base_interviewer, dsa_prompt
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
            
            self.chat_history = dsa_prompt.format(
            Candidate_name=self.user_full_name,
            Problem_description=self.question_description
            ) + base_interviewer 
            self.message_list = []
            self.ai_notes = ""  
            self.initial_prompt_sent = self.interview.initial_prompt_sent
            logger.info(f"initial_prompt_sent: {self.initial_prompt_sent}")
            
            # Store user information and question description in WebSocket session
            self.scope['username'] = self.user_full_name
            self.scope['question_description'] = self.question_description
            
            logger.info(f"connected to interview {self.interview_id}")
            await self.accept()

            # Fetch chat history from the database if initial_prompt_sent is False
            if not self.initial_prompt_sent:
                await self.send_initial_message()
            else:
                await self.fetch_chat_history()
            
        except InterviewSession.DoesNotExist:
            logger.error(f"Interview {self.interview_id} not found.")
            await self.close()

    async def disconnect(self, close_code):
        logger.info(f"WebSocket connection closed with code {close_code}.")
        await sync_to_async(self.interview.add_to_history)(self.message_list)
        await sync_to_async(self.interview.save)()

    async def send_initial_message(self):
        username = self.scope['username']
        welcome_message = f"Welcome to the interview, {username}. " \
                         f"The question is: '{self.question.title}'. Can you explain your approach?"
        self.chat_history += f"\nAI: {welcome_message}"
        self.message_list.append({"is_ai": True, "message": welcome_message})
        await self.send(text_data=json.dumps({
            'type': 'ai_message',
            'message': welcome_message,
        }))
        self.initial_prompt_sent = True
        await sync_to_async(self.update_initial_prompt_sent)()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if 'answer' in data:
                candidate_response = data['answer']
                logger.info(f"Candidate's response: {candidate_response}")
                self.chat_history += f"\nCandidate: {candidate_response}"
                self.message_list.append({"is_ai": False, "message": candidate_response})
                
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
                    await sync_to_async(self.update_initial_prompt_sent)()
                else:
                    # For subsequent messages, send chat history and AI notes
                    ai_message, self.ai_notes = await sync_to_async(generate_ai_message)(
                        chat_history=self.chat_history,
                        ai_notes=self.ai_notes,
                        is_initial=False
                    )
                
                self.chat_history += f"\nAI: {ai_message}"
                self.message_list.append({"is_ai": True, "message": ai_message})
                await self.send(text_data=json.dumps({
                    'type': 'ai_message',
                    'message': ai_message,
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format.',
            }))

    async def fetch_chat_history(self):
        self.message_list = await sync_to_async(lambda: self.interview.chat_history)()
        self.chat_history = dsa_prompt.format(
            Candidate_name=self.user_full_name,
            Problem_description=self.question_description
            ) + base_interviewer + "\n".join(
            f"{'AI' if msg['is_ai'] else 'Candidate'}: {msg['message']}" for msg in self.message_list
        )

    def update_initial_prompt_sent(self):
        self.interview.initial_prompt_sent = self.initial_prompt_sent
        self.interview.save()