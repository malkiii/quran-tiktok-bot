import os
import sys
import yt_dlp

def download_youtube_video(url, output_path="./assets/video.mp4"):
    """
    Download a YouTube video using yt-dlp.

    :param url: The URL of the YouTube video to download.
    :param output_path: The output path or template for the downloaded file.
    """
    # Options for yt-dlp
    ydl_opts = {
        'outtmpl': output_path,  # Set the output file name template
        'skip_unavailable_fragments': False,  # Do not skip fragments
        'noplaylist': True,  # Disable playlist download
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])  # Download the video

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 scripts/download-youtube-videos.py [links.txt] [output_folder]")
        sys.exit(1)

    # Open the file in read mode
    with open(sys.argv[1], 'r') as file:
        # Read each line (each link) from the file
        for num, line in enumerate(file, start=1):
            # Remove any leading/trailing whitespace (including newlines)
            link = line.strip()
            if link:
                file_path = os.path.join(sys.argv[2], f'{num}.mp4')
                uploaded_path = os.path.join(sys.argv[2], f'up_{num}.mp4')

                # Skip if the file already exists
                if os.path.exists(file_path) or os.path.exists(uploaded_path):
                    continue

                print(f'[{num}] Downloading "{link}" :')

                # Download the video
                download_youtube_video(link, file_path)

                print(f'Video downloaded Successfully!')
                