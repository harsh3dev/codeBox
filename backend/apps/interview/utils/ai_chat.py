from langchain.chains import LLMChain
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.chat_models import ChatOpenAI
from prompt import base_interviewer, dsa_prompt

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

        formatted_base_prompt = base_interviewer.replace("<You message here>", f"You are conducting an interview with {username}.")
        final_prompt = formatted_base_prompt + "\n" + formatted_dsa_prompt + "\n" + chat_history if chat_history else formatted_base_prompt + "\n" + formatted_dsa_prompt
    else:
        base_prompt = "You are continuing an interview. Refer to the conversation so far and AI notes:"
        final_prompt = f"{base_prompt}\nChat History:\n{chat_history}\nAI Notes:\n{ai_notes}"

    # Set up the memory for conversation
    conversational_memory_length = 5 
    memory = ConversationBufferWindowMemory(k=conversational_memory_length, memory_key="chat_history", return_messages=True)

    # Use GPT-4o model for language generation
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.7,  
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

    # Construct chat prompt template using components
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=formatted_dsa_prompt),  # Use the dynamic problem description prompt
            MessagesPlaceholder(variable_name="chat_history"),  # Placeholder for chat history
            HumanMessagePromptTemplate.from_template("{human_input}"),  # User input
        ]
    )

    # Create conversation chain
    conversation = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
        memory=memory,
    )

    # Generate the response
    response = conversation.predict(human_input=final_prompt)
    
    # Optionally, parse #NOTES# from the response (if your logic requires this)
    if "#NOTES#" in response:
        visible_message, ai_notes = response.split("#NOTES#", 1)
    else:
        visible_message, ai_notes = response, ai_notes

    return visible_message.strip(), ai_notes.strip()
