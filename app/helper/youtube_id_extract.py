class INVALID_URL(Exception):
    pass

def get_video_id(url:str):
    if "v=" in url:
        video_id = url.split("v=")[-1].split("&")[0]
        return video_id
    elif "youtu.be/" in url :
        video_id = url.split("youtu.be/")[-1].split("?")[0]
        return video_id
    elif "/shorts/" in url :
        video_id = url.split("/shorts/")[-1].split("?")[0].split("/")[0]
        return video_id
    else:
        raise INVALID_URL("Invalid url!")

