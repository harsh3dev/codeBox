from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/interview/<int:interview_id>/", consumers.InterviewConsumer.as_asgi()),
]