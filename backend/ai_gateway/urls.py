from django.urls import path
from .views import chat_ai_view

urlpatterns = [
    path('chat', chat_ai_view, name='chat_ai'), #chat_ai_view esta vindo do ai_gateway/views.py
]
