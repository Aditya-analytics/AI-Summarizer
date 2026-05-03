def tweak_prompt(SYSTEM_PROMPT, length, language):
    if length == "short":
        instruction = """Provide exactly 3 high-impact bullet points capturing the absolute core essence. 
- Use **bolding** for key terms.
- Maintain an elite, analytical tone.
- Ensure zero fluff."""
    elif length == "detailed":
        instruction = """Provide a comprehensive, high-fidelity research briefing:
### 1. Executive Briefing
A sophisticated 2-3 sentence overview of the document's core thesis.

### 2. Strategic Key Takeaways
- **Actionable Insight**: Detailed explanation of a major point.
- **Critical Data**: Evidence-based findings from the text.
- **Analytical Nuance**: Subtleties identified in the research.

### 3. Multi-Layered Analysis
Deep dive into major sub-topics with clear headers and professional structure."""
    else:
        instruction = """Provide a standard professional briefing with:
- **Core Summary**: A clear narrative overview.
- **Significant Findings**: High-impact bullet points using bold headers.
- **Conclusion**: A final analytical synthesis."""
    
    UPDATED_PROMPT = SYSTEM_PROMPT.format(LENGTH_INSTRUCTION=instruction, LANGUAGE=language)
    return UPDATED_PROMPT