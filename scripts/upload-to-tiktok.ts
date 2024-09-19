import fs from 'fs';
import path from 'path';
import axios from 'axios';
import z from 'zod';

import 'dotenv/config';

async function main() {
  // Get the video size and chunks
  const video = path.join(process.cwd(), 'out/video.mp4');
  const { fileSize, chunkSize, totalChunks } = getVideoSize(video);

  try {
    console.log('Getting access token...');

    // Get the access token
    const accessToken = await getAccessToken();

    // eslint-disable-next-line no-unreachable
    console.log('Preparing to upload the video...');

    /**
     * Upload the video
     * @see https://developers.tiktok.com/doc/content-posting-api-get-started-upload-content#upload_a_video
     */
    const postResponse = await axios({
      method: 'POST',
      url: 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      data: {
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: fileSize,
          chunk_size: chunkSize,
          total_chunk_count: totalChunks,
        },
      },
    });

    console.log('Video post initiated! 📦\n');

    // Parse the response data
    const postData = z
      .object({
        data: z.object({
          publish_id: z.string(),
          upload_url: z.string().url(),
        }),
      })
      .parse(postResponse.data).data;

    console.log('Uploading the video...');

    await uploadVideoInChunks(postData.upload_url, video, chunkSize);

    // Check posting status every 5 seconds
    let postProcess = await checkStatus(postData.publish_id, accessToken);
    while (postProcess.status === 'PROCESSING_UPLOAD') {
      console.log('Processing...');

      // eslint-disable-next-line no-promise-executor-return
      await new Promise(res => setTimeout(res, 5000));

      postProcess = await checkStatus(postData.publish_id, accessToken);
    }

    if (postProcess.status === 'SEND_TO_USER_INBOX') {
      console.log(
        `\nVideo uploaded successfully! 🎉\nSee https://www.tiktok.com/@holy.quran.clips`,
      );
    } else {
      console.error('Failed to upload the video:', postProcess.fail_reason);
    }
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) throw error;
    throw new Error(
      `\n❌ Failed with status ${error.response?.status}: ${JSON.stringify(error.response?.data, null, 2)}`,
    );
  }
}

async function getAccessToken() {
  const data = new URLSearchParams();
  data.append('client_key', process.env.TIKTOK_CLIENT_KEY!);
  data.append('client_secret', process.env.TIKTOK_CLIENT_SECRET!);
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', process.env.TIKTOK_REFRESH_TOKEN!);

  const response = await axios({
    method: 'POST',
    url: 'https://open.tiktokapis.com/v2/oauth/token/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    data,
  });

  return response.data.access_token as string;
}

function getVideoSize(video: string) {
  // Check if the file exists
  if (!fs.existsSync(video)) {
    throw new Error(`File not found: ${video}`);
  }

  // Get the file size
  const fileStats = fs.statSync(video);
  const fileSize = fileStats.size;
  // const chunkSize = 10_000_000;
  const chunkSize = fileSize;

  // Calculate the total number of chunks
  // const totalChunks = Math.floor(fileSize / chunkSize);
  const totalChunks = 1;

  return { fileSize, chunkSize, totalChunks };
}

async function checkStatus(publishId: string, accessToken: string) {
  const statusResponse = await axios({
    method: 'POST',
    url: 'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    data: {
      publish_id: publishId,
    },
  });

  /**
   * Parse the response data
   * @see https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status#nested_data_struct
   */
  const statusData = z
    .object({
      data: z
        .object({
          status: z.literal('PROCESSING_UPLOAD'),
          uploaded_bytes: z.number(),
        })
        .or(
          z.object({
            status: z.literal('FAILED'),
            fail_reason: z.string(),
          }),
        )
        .or(
          z.object({
            status: z.literal('SEND_TO_USER_INBOX'),
            publicaly_available_post_id: z.array(z.number()).default([]),
          }),
        ),
    })
    .parse(statusResponse.data).data;

  return statusData;
}

async function uploadVideoInChunks(uploadUrl: string, videoPath: string, chunkSize: number) {
  const totalSize = fs.statSync(videoPath).size;
  let start = 0;

  while (start < totalSize) {
    let end = start + chunkSize - 1;
    if (totalSize - end < chunkSize) end = totalSize - 1;

    const chunk = await getVideoChunk(videoPath, start, end);

    console.log(`Uploading chunk: ${start}-${end} / ${totalSize}`);

    await axios({
      method: 'PUT',
      url: uploadUrl,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Length': chunk.length,
        'Content-Type': 'video/mp4',
      },
      data: chunk,
    });

    start = end + 1;
  }
}

function getVideoChunk(video: string, start: number, end: number) {
  return new Promise<Buffer>((resolve, reject) => {
    const stream = fs.createReadStream(video, { start, end });
    const chunks: Buffer[] = [];

    stream.on('data', chunk => {
      chunks.push(chunk as Buffer);
    });

    stream.on('end', () => {
      // Combine chunks into one buffer
      resolve(Buffer.concat(chunks));
    });

    stream.on('error', err => {
      reject(err);
    });
  });
}

main();
