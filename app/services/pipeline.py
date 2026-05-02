from app.helper.chunk import process_chunk
from app.helper.embed import store_chunks

async def ingest_pipeline(text:str,document_id:str):
    try:
        chunks = await process_chunk(text)

        if len(chunks) == 0:
            print("LOGG : Empty chunk error")
            raise ValueError("Wrong input or empty string")

        embedding = await store_chunks(chunks,document_id)

    except Exception as e:
        print(f"An exception occured : {e}")
        raise e
        
    else:
        return {"status":"success","chunks_processed":len(chunks)}
 
