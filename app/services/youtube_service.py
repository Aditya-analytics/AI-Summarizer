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
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'custom_header': {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-us,en;q=0.5',
                'Sec-Fetch-Mode': 'navigate',
            }
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
        print(f"LOGG : yt-dlp error: {e}. Falling back to youtube_transcript_api failsafe...")
        # Defensive Multi-Method Fallback
        try:
            import youtube_transcript_api
            from youtube_transcript_api import YouTubeTranscriptApi
            
            # DIAGNOSTIC: Log available methods to see what's going on in Render environment
            print(f"LOGG : youtube_transcript_api module attributes: {dir(youtube_transcript_api)}")
            print(f"LOGG : YouTubeTranscriptApi class attributes: {dir(YouTubeTranscriptApi)}")
            
            video_id = get_video_id(url)
            
            # Method 1: Try list_transcripts (standard for 0.6.x+)
            if hasattr(YouTubeTranscriptApi, 'list_transcripts'):
                try:
                    ts_list = YouTubeTranscriptApi.list_transcripts(video_id)
                    try:
                        transcript = ts_list.find_transcript(['en', 'hi'])
                    except:
                        transcript = ts_list.find_generated_transcript(['en', 'hi'])
                    data = transcript.fetch()
                    text = "\n".join([f"[{int(entry['start'])//60:02d}:{int(entry['start'])%60:02d}] {entry['text']}" for entry in data])
                    return text.replace('\x00', '') # Sanitization
                except Exception as list_e:
                    print(f"LOGG : list_transcripts failed: {list_e}")

            # Method 2: Try direct get_transcript (standard for older versions)
            if hasattr(YouTubeTranscriptApi, 'get_transcript'):
                data = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'hi'])
                text = "\n".join([f"[{int(entry['start'])//60:02d}:{int(entry['start'])%60:02d}] {entry['text']}" for entry in data])
                return text.replace('\x00', '') # Sanitization

            # Method 3: Instance based (rare but defensive)
            api_instance = YouTubeTranscriptApi()
            if hasattr(api_instance, 'get_transcript'):
                data = api_instance.get_transcript(video_id, languages=['en', 'hi'])
                text = "\n".join([f"[{int(entry['start'])//60:02d}:{int(entry['start'])%60:02d}] {entry['text']}" for entry in data])
                return text.replace('\x00', '') # Sanitization
                
            raise Exception(f"No valid method found. Available in class: {[a for a in dir(YouTubeTranscriptApi) if not a.startswith('_')]}")

        except Exception as fallback_e:
            print(f"LOGG : All fallbacks failed: {fallback_e}")
            if "RequestBlocked" in str(fallback_e):
                raise Exception("YouTube is blocking Render's IP. Please try a PDF or URL source, or a different video.")
            raise Exception(f"Transcript Retrieval Failure: {str(fallback_e)}")
