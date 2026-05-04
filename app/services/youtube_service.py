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
        print(f"LOGG : youtube-transcript-api v1.x failed: {fallback_e}. Trying Invidious...")

    # ── Fallback 3: Invidious public API ───────────────────────────────────────
    # Invidious instances run on community (non-cloud-provider) IPs,
    # so YouTube does NOT block them. This is the production fix for Render IP blocks.
    INVIDIOUS_INSTANCES = [
        "https://inv.nadeko.net",
        "https://invidious.privacyredirect.com",
        "https://invidious.nerdvpn.de",
        "https://yt.cdaut.de",
    ]

    for instance in INVIDIOUS_INSTANCES:
        try:
            print(f"LOGG : Trying Invidious instance: {instance}")
            caps_res = requests.get(
                f"{instance}/api/v1/captions/{video_id}",
                timeout=10,
                headers={"User-Agent": "Mozilla/5.0"}
            )
            if caps_res.status_code != 200:
                continue

            captions = caps_res.json().get("captions", [])
            if not captions:
                continue

            # Prefer English or Hindi, fall back to first available
            target = next(
                (c for c in captions if any(
                    lang in c.get("language_code", "") for lang in ["en", "hi"]
                )),
                captions[0]
            )

            # Fetch the VTT caption file
            vtt_url = f"{instance}{target['url']}&format=vtt"
            vtt_res = requests.get(vtt_url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
            if vtt_res.status_code != 200:
                continue

            # Parse VTT → plain timestamped text
            raw = vtt_res.text
            raw = re.sub(r'WEBVTT.*?\n\n', '', raw, flags=re.DOTALL)
            lines = []
            for block in raw.strip().split("\n\n"):
                parts = block.strip().split("\n")
                # Find the timestamp line and extract text after it
                for i, part in enumerate(parts):
                    if "-->" in part:
                        text_lines = parts[i + 1:]
                        text = " ".join(text_lines)
                        text = re.sub(r'<[^>]+>', '', text).strip()
                        # Parse start time for label
                        start_str = part.split("-->")[0].strip()
                        try:
                            h, m, s = 0, 0, 0
                            t_parts = start_str.replace(",", ".").split(":")
                            if len(t_parts) == 3:
                                h, m, s = int(t_parts[0]), int(t_parts[1]), float(t_parts[2])
                            elif len(t_parts) == 2:
                                m, s = int(t_parts[0]), float(t_parts[1])
                            total_s = int(h * 3600 + m * 60 + s)
                            label = f"[{total_s//60:02d}:{total_s%60:02d}]"
                        except Exception:
                            label = ""
                        if text:
                            lines.append(f"{label} {text}".strip())
                        break

            text = "\n".join(lines).replace('\x00', '')
            if text.strip():
                print(f"LOGG : Invidious succeeded via {instance} ({len(lines)} lines).")
                return text

        except Exception as inv_e:
            print(f"LOGG : Invidious {instance} failed: {inv_e}")
            continue

    # All methods exhausted — raise a clean user-facing error
    raise Exception(
        "Could not retrieve transcript. YouTube is blocking all server-side retrieval methods "
        "for this video. Please try a different video, or upload the content as a PDF/URL instead."
    )

