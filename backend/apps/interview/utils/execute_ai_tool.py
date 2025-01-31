from langchain.chains import LLMChain
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from prompt import code_review, time_complexity, error_assistance


def get_prompt(
    tool=None,
    code=None,
    error=None,
):
    match tool:
        case "code_review":
            formatted_prompt = code_review.format(code=code)
            return formatted_prompt
        case "time_complexity":
            formatted_prompt = time_complexity.format(code=code)
            return formatted_prompt
        case "error_assistance":
            formatted_prompt = error_assistance.format(code=code, error=error)
            return formatted_prompt
        case _:
            return None

def execute_ai_tool(
    tool=None,
    code=None,
    error=None,
):
    formatted_prompt = get_prompt(tool=tool, code=code, error=error)
    
    if formatted_prompt is None:
        raise ValueError("Invalid tool provided.")

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=formatted_prompt),
            HumanMessagePromptTemplate.from_template("{human_input}"),
        ]
    )

    conversation = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
    )

    response = conversation.predict(human_input=formatted_prompt)

    return response
