import os
import sys

# Set your Cloudinary credentials
from dotenv import load_dotenv
load_dotenv()

# Import the Cloudinary libraries
import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader
import cloudinary.api

# Set configuration parameter: return "https" URLs by setting secure=True
config = cloudinary.config(secure=True)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/upload-videos.py [folder]")
        sys.exit(1)

    # Get the folder path and name
    folder_path = sys.argv[1]
    folder_name = os.path.basename(folder_path) or os.path.basename(os.path.dirname(folder_path))

    for file in os.listdir(folder_path):
        # Check if the file is an MP4 video
        if file.endswith('.mp4'):
            file_name = os.path.splitext(file)[0]
            file_path = os.path.join(folder_path, file)

            print(f'- Uploading "{file_path}"...')

            # Upload the video to Cloudinary
            public_id = f"{folder_name}_{file_name}"
            result = cloudinary.uploader.upload(
                file_path,
                folder=f"quran-{folder_name}s",
                public_id=public_id,
                resource_type="video"
            )

            # Get the URL of the uploaded video
            url = CloudinaryImage(public_id).build_url()

            print('✅ Video uploaded to:', url)
                