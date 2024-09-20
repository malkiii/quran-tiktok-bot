import fs from 'fs';
import axios from 'axios';
import { ensureBrowser } from '@remotion/renderer';

import 'dotenv/config';

await ensureBrowser();

const cloudinaryURL = new URL(process.env.CLOUDINARY_URL);
const runCount = parseInt(process.env.RUN_COUNT, 10) || 1;

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

/**
 * Parametrize the video by passing props to your component.
 * @type {import('./schema').CompositionProps}
 */
const inputProps = {
  croma: await getNextVideoURL('croma'),
  background: await getNextVideoURL('background'),
};

fs.writeFileSync('./input-props.json', JSON.stringify(inputProps));

console.log('Props generated successfully ✨');
