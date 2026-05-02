from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from app.helper.youtube_id_extract import get_video_id

async def get_transcript(url:str):
    try: 
        video_id = get_video_id(url)

        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id,languages=["en","hi"])
        
        return " ".join([t.text for t in transcript])

    except Exception as e:
        print(f"LOGG : ERROR {e} occured!")
        raise e
