import fs from 'fs';
import axios from 'axios';
import { ensureBrowser } from '@remotion/renderer';

import 'dotenv/config';

await ensureBrowser();

/**
 * @param {'croma' | 'background'} folder
 */
async function getVideoURL(folder) {
  const { hostname } = new URL(process.env.CLOUDINARY_URL);

  const folderName = `quran-${folder}s`;
  const count = await getTotalFilesCount(folderName);

  const diff = new Date().getTime() - new Date('2020-01-01').getTime();
  const dayNumber = Math.floor(diff / (1000 * 60 * 60 * 24));

  const video = `${folder}_${(dayNumber % count) + 1}.mp4`;

  return `https://res.cloudinary.com/${hostname}/video/upload/${folderName}/${video}`;
}

/**
 * @param {string} folder
 * @returns {Promise<number>}
 */
async function getTotalFilesCount(folder) {
  const { username, password, hostname } = new URL(process.env.CLOUDINARY_URL);

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
  croma: await getVideoURL('croma'),
  background: await getVideoURL('background'),
};

fs.writeFileSync('./input-props.json', JSON.stringify(inputProps));

console.log('Props generated successfully:', inputProps);
