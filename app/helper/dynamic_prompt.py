def tweak_prompt(SYSTEM_PROMPT, length, language):
    if length == "short":
        instruction = "Provide exactly 3 high-impact bullet points capturing the absolute core essence. Be extremely concise but maintain critical data."
    elif length == "detailed":
        instruction = """Provide a comprehensive, multi-layered summary:
1. Executive Summary (2-3 sentences)
2. Key Strategic Takeaways (bulleted)
3. Detailed Analysis (explaining major sub-topics in depth)"""
    else:
        instruction = "Provide a standard professional summary with clear bullet points and major sections."
    
    UPDATED_PROMPT = SYSTEM_PROMPT.format(LENGTH_INSTRUCTION=instruction, LANGUAGE=language)
    return UPDATED_PROMPT