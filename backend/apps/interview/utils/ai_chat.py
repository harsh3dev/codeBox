from langchain.chains import LLMChain
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from .prompt import base_interviewer, dsa_prompt
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_ai_message(
    username=None, 
    question_description=None, 
    chat_history=None, 
    ai_notes=None, 
    is_initial=False
):
    if is_initial:
        formatted_dsa_prompt = dsa_prompt.format(
            Candidate_name=username,
            Problem_description=question_description
        )
        formatted_base_prompt = base_interviewer
        final_prompt = formatted_base_prompt + "\n" + formatted_dsa_prompt + "\n" + chat_history if chat_history else ""
    else:
        formatted_dsa_prompt = "You are continuing an interview. Refer to the conversation so far and AI notes:"
        final_prompt = f"{formatted_dsa_prompt}\nChat History:\n{chat_history}\nAI Notes:\n{ai_notes}"

    conversational_memory_length = 20 
    memory = ConversationBufferWindowMemory(k=conversational_memory_length, memory_key="chat_history", return_messages=True)

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=GEMINI_API_KEY,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=formatted_dsa_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            HumanMessagePromptTemplate.from_template("{human_input}"),
        ]
    )

    conversation = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
        memory=memory,
    )

    response = conversation.predict(human_input=final_prompt)
    
    if "#NOTES#" in response:
        visible_message, ai_notes = response.split("#NOTES#", 1)
    else:
        visible_message, ai_notes = response, ai_notes

    return visible_message.strip(), ai_notes.strip()
