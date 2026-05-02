from langchain_text_splitters import RecursiveCharacterTextSplitter
import asyncio

async def process_chunk(text:str) -> list[str]:
    text_spliter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )

    loop = asyncio.get_running_loop()

    chunks = await loop.run_in_executor(
        None,
        text_spliter.split_text,
        text
    )
     
    return chunks
