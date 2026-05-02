def tweak_prompt(SYSTEM_PROMPT,length,language):
    if (length == "short"):
        instruction = "Limit the summary to exactly 3 highly condensed bullet points"
    elif(length == "detailed"):
        instruction = "Provide a highly detailed, comprehensive summary covering all major sub-topics in depth."
    else :
        instruction = ""
    
    UPDATED_PROMPT = SYSTEM_PROMPT.format(LENGTH_INSTRUCTION=instruction,LANGUAGE=language)
    return UPDATED_PROMPT