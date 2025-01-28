import json
from channels.generic.websocket import AsyncWebsocketConsumer

class InterviewConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'Welcome to the mock interview!'
        }))

    async def disconnect(self, close_code):
        print("WebSocket connection closed.")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Echo the message back to the client
        await self.send(text_data=json.dumps({
            'message': f"You said: {message}"
        }))