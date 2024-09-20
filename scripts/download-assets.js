import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ensureBrowser } from '@remotion/renderer';

import 'dotenv/config';

await ensureBrowser();

const cloudinaryURL = new URL(process.env.CLOUDINARY_URL);
const runCount = parseInt(process.env.RUN_COUNT, 10) || 0;

/**
 * @param {'croma' | 'background'} folder
 */
async function getNextVideoURL(folder) {
  const { hostname } = cloudinaryURL;

  const folderName = `quran-${folder}s`;
  const filesCount = await getTotalFilesCount(folderName);

  const video = `${folder}_${(runCount % filesCount) + 1}.mp4`;

  return `https://res.cloudinary.com/${hostname}/video/upload/${folderName}/${video}`;
}

/**
 * @param {string} folder
 * @returns {Promise<number>}
 */
async function getTotalFilesCount(folder) {
  const { username, password, hostname } = cloudinaryURL;

  const endpoint = new URL(
    `/v1_1/${hostname}/resources/by_asset_folder`,
    `https://${username}:${password}@api.cloudinary.com`,
  );

  endpoint.searchParams.append('asset_folder', folder);
  endpoint.searchParams.append('max_results', '0');

  const response = await axios.get(endpoint.toString());

  return response.data.total_count;
}

async function downloadVideo(videoUrl, filename) {
  const outputFolder = path.join(process.cwd(), 'public');

  // Ensure the folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const filePath = path.join(outputFolder, filename);

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url: videoUrl,
    method: 'GET',
    responseType: 'stream',
  });

  // Pipe the response (video stream) to the file
  response.data.pipe(writer);

  // Return a Promise that resolves when the video is fully downloaded
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}

const croma = await getNextVideoURL('croma');
const background = await getNextVideoURL('background');

await downloadVideo(croma, 'croma.mp4');
console.log(path.basename(croma), 'has been downloaded.');

await downloadVideo(background, 'background.mp4');
console.log(path.basename(background), 'has been downloaded.');
