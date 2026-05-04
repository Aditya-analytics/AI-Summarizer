import yt_dlp
from app.helper.youtube_id_extract import get_video_id
import requests
import re

async def get_transcript(url: str):
    """
    Extracts transcript from YouTube.
    
    Primary:  yt-dlp (subtitle scraping via JSON3/VTT)
    Fallback: youtube-transcript-api v1.x (instance-based API)
    """
    video_id = get_video_id(url)

    # ── Primary: yt-dlp ────────────────────────────────────────────────────────
    try:
        ydl_opts = {
            'skip_download': True,
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['en.*', 'hi.*'],
            'quiet': True,
            'no_warnings': True,
            'user_agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
            ),
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        subtitles = info.get('subtitles') or info.get('automatic_captions')
        if not subtitles:
            raise Exception("No subtitles found via yt-dlp.")

        # Pick English or Hindi, fall back to first available
        target_lang = next(
            (l for l in ['en', 'en-US', 'hi'] if l in subtitles),
            list(subtitles.keys())[0]
        )
        formats = subtitles[target_lang]

        # Prefer JSON3 (cleanest), fall back to VTT
        json_url = next((f['url'] for f in formats if f.get('ext') == 'json3'), None)

        if json_url:
            res = requests.get(json_url, timeout=15)
            data = res.json()
            lines = []
            for event in data.get('events', []):
                if 'segs' in event:
                    text = "".join(s['utf8'] for s in event['segs'] if 'utf8' in s).strip()
                    if text:
                        ms = event.get('tStartMs', 0)
                        lines.append(f"[{ms//60000:02d}:{(ms//1000)%60:02d}] {text}")
            return "\n".join(lines).replace('\x00', '')

        # VTT fallback
        vtt_url = next(
            (f['url'] for f in formats if f.get('ext') == 'vtt'),
            formats[0]['url']
        )
        res = requests.get(vtt_url, timeout=15)
        text = re.sub(r'<[^>]+>', '', res.text)
        text = re.sub(r'\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}.*\n', '', text)
        return text.strip().replace('\x00', '')

    except Exception as e:
        print(f"LOGG : yt-dlp failed ({e}). Falling back to youtube-transcript-api v1.x...")

    # ── Fallback: youtube-transcript-api v1.x ──────────────────────────────────
    # v1.x uses instance-based API. Data items are objects (snippet.text),
    # NOT dicts (entry['text']) as in the old v0.x API.
    try:
        from youtube_transcript_api import YouTubeTranscriptApi

        api = YouTubeTranscriptApi()
        ts_list = api.list(video_id)

        # Try manually-created first, then auto-generated
        try:
            transcript = ts_list.find_manually_created_transcript(['en', 'hi'])
        except Exception:
            try:
                transcript = ts_list.find_generated_transcript(['en', 'hi'])
            except Exception:
                # Accept any available language
                transcript = ts_list.find_transcript(
                    [t.language_code for t in ts_list._generated_transcripts.values()]
                    or [t.language_code for t in ts_list._manually_created_transcripts.values()]
                )

        fetched = transcript.fetch()

        # v1.x: each item is a FetchedTranscriptSnippet with .text and .start attrs
        lines = []
        for snippet in fetched:
            start = int(snippet.start)
            lines.append(f"[{start//60:02d}:{start%60:02d}] {snippet.text}")

        text = "\n".join(lines).replace('\x00', '')
        if not text.strip():
            raise Exception("Transcript fetched but was empty.")
        print(f"LOGG : youtube-transcript-api v1.x succeeded ({len(lines)} lines).")
        return text

    except Exception as fallback_e:
        print(f"LOGG : youtube-transcript-api v1.x failed: {fallback_e}")
        # Give the user a clear, actionable error message
        err = str(fallback_e)
        if any(k in err for k in ['RequestBlocked', 'IpBlocked', 'bot']):
            raise Exception(
                "YouTube is blocking this server's IP address. "
                "Please try a different video or use the Web URL / PDF upload instead."
            )
        if 'NoTranscriptFound' in err or 'TranscriptsDisabled' in err:
            raise Exception(
                "This video has no captions available. "
                "Try a video that has auto-generated or manual subtitles."
            )
        raise Exception(f"Transcript retrieval failed: {err}")
