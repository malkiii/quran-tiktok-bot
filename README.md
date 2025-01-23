# 📱 TikTok Quran bot ([@seraj.almunir](https://www.tiktok.com/@seraj.almunir))

This bot creates quranic clips using [Remotion](https://www.remotion.dev/) and uploads them to TikTok using the [Content Posting API](https://developers.tiktok.com/products/content-posting-api/).

## 📋 Requirements

- Node.js 20 or above, with `pnpm@9.9.0`.
- Remotion [Linux Dependencies](https://www.remotion.dev/docs/miscellaneous/linux-dependencies).
- Python 3 (with all dependencies from the [`./scripts`](./scripts/) folder).
- TikTok [developers](https://developers.tiktok.com/) App.

## 💻 Local Setup

1. Rename `.env.sample` file to `.env` and fill your TikTok secrets and your [Cloudinary](https://cloudinary.com/) URL.

> [!IMPORTANT]  
> You need to get your own TikTok refresh token by adding your personal account to your App sandbox and following the right steps. See [User Access Token Management](https://developers.tiktok.com/doc/oauth-user-access-token-management).

2. Install the node dependencies using:

```sh
pnpm install
```

3. Install python dependencies using:

```sh
python3 -m pip install yt-dlp
pip3 install cloudinary
pip3 install python-dotenv
```

4. Install Chrome headless shell for remotion using:

```sh
pnpm remotion:chrome
```

## 📥 Downloading Assets

1. Download the croma by creating a `.txt` that containes a croma video link from youtube on each line, and then use it with this command:

```sh
python3 scripts/download-youtube-videos.py file.txt assets/croma
```

2. Download the backgrounds by doing the same thing with a different `.txt` file, and then use it with this command:

```sh
python3 scripts/download-youtube-videos.py file2.txt assets/background
```

3. Upload all the assets to Cloudinary by running:

```sh
python3 scripts/upload-videos.py assets/croma
python3 scripts/upload-videos.py assets/background
```

## 🎬 Start Creating videos

1. You will use Remotion to create your videos, all the code will be in `/remotion` folder, you can read more about it from their [official documentation](https://www.remotion.dev/docs/).

2. Start your local remotion studio by running:

```sh
pnpm remotion:studio
```

3. Render your video to `out/video.mp4` using:

```sh
pnpm remotion:render
```

4. if you want to generate props based on your Cloudinary assets, use:

```sh
node scripts/download-assets.js
pnpm remotion:render
```

## 🚀 Upload to TikTok

After you render the `video.mp4`, you can upload it using:

```sh
pnpm upload
```

> [!NOTE]  
> You will find your uploaded video in your **Inbox** in the **System notifications** ready for posting.

> [!WARNING]  
> Ensure you post the videos after uploading or don't upload more than 5 videos within 24 hours, otherwise, you'll get a spam risk error. See [spam_risk_too_many_pending_share](https://developers.tiktok.com/doc/content-posting-api-reference-upload-video#_error_codes) error.

## 🤖 Using GitHub Actions

> [!IMPORTANT]  
> Don't forget to add your `.env` variables to your [GitHub secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) before launching any workflow.

## 📄 Project License

Distributed under the [MIT](./LICENSE) license.
