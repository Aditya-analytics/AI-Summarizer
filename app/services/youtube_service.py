from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from app.helper.youtube_id_extract import get_video_id

async def get_transcript(url:str):
    try: 
        video_id = get_video_id(url)

        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id,languages=["en","hi"])
        
        formatted_transcript = []
        for entry in transcript:
            start_sec = int(entry['start'])
            minutes = start_sec // 60
            seconds = start_sec % 60
            timestamp = f"[{minutes:02d}:{seconds:02d}]"
            formatted_transcript.append(f"{timestamp} {entry['text']}")
        
        return "\n".join(formatted_transcript)

    except Exception as e:
        print(f"LOGG : ERROR {e} occured!")
        raise e
