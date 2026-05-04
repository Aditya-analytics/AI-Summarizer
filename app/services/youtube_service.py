import yt_dlp
from app.helper.youtube_id_extract import get_video_id
import json
import requests
import re

async def get_transcript(url:str):
    """
    Extracts transcript from YouTube using yt-dlp for robustness against Cloud Provider blocks.
    Falls back to youtube_transcript_api if yt-dlp fails.
    """
    try:
        ydl_opts = {
            'skip_download': True,
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['en.*', 'hi.*'],
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Check for subtitles in the info dict
            subtitles = info.get('subtitles') or info.get('automatic_captions')
            
            if not subtitles:
                raise Exception("No transcripts found for this video.")
            
            # Find English or Hindi subtitles
            target_lang = None
            for lang in ['en', 'en-US', 'hi']:
                if lang in subtitles:
                    target_lang = lang
                    break
            
            if not target_lang:
                # Take the first available if target not found
                target_lang = list(subtitles.keys())[0]
            
            # Get the JSON/VTT URL
            formats = subtitles[target_lang]
            json_url = next((f['url'] for f in formats if f.get('ext') == 'json3'), None)
            
            if not json_url:
                vtt_url = next((f['url'] for f in formats if f.get('ext') == 'vtt' or 'vtt' in f['url']), formats[0]['url'])
                # Fetch VTT and return simple text for now
                res = requests.get(vtt_url)
                # Simple regex to strip VTT tags
                text = re.sub(r'<[^>]+>', '', res.text)
                text = re.sub(r'\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}.*\n', '', text)
                return text.strip()

            # Fetch JSON3 format (cleanest)
            res = requests.get(json_url)
            data = res.json()
            
            formatted_transcript = []
            for event in data.get('events', []):
                if 'segs' in event:
                    text = "".join([s['utf8'] for s in event['segs'] if 'utf8' in s]).strip()
                    if text:
                        start_ms = event.get('tStartMs', 0)
                        minutes = (start_ms // 1000) // 60
                        seconds = (start_ms // 1000) % 60
                        timestamp = f"[{minutes:02d}:{seconds:02d}]"
                        formatted_transcript.append(f"{timestamp} {text}")
            
            return "\n".join(formatted_transcript)

    except Exception as e:
        print(f"LOGG : yt-dlp error: {e}. Falling back to youtube_transcript_api...")
        # Fallback to the old method just in case
        try:
            import youtube_transcript_api
            api_class = youtube_transcript_api.YouTubeTranscriptApi
            video_id = get_video_id(url)
            
            # Defensive call to list_transcripts
            transcript_list = api_class.list_transcripts(video_id)
            try:
                transcript = transcript_list.find_transcript(['en', 'hi'])
            except:
                # Try generated ones if manual not found
                transcript = transcript_list.find_generated_transcript(['en', 'hi'])
            
            data = transcript.fetch()
            return "\n".join([f"[{int(entry['start'])//60:02d}:{int(entry['start'])%60:02d}] {entry['text']}" for entry in data])
        except Exception as fallback_e:
            print(f"LOGG : Fallback also failed: {fallback_e}")
            if "RequestBlocked" in str(fallback_e):
                raise Exception("YouTube is blocking Render's IP. Please try a PDF or URL source, or a different video.")
            raise Exception(f"Transcript Retrieval Failure: {str(fallback_e)}")
