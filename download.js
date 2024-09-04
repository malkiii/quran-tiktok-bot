import fs from 'fs';
import ytdl from '@distube/ytdl-core';

// eslint-disable-next-line no-undef
const cookies = JSON.parse(process.env.YOUTUBE_COOKIES);

ytdl('https://www.youtube.com/watch?v=Z5CbAa-yuZ0', {
  agent: ytdl.createAgent(cookies),
  filter: 'audioandvideo',
  quality: 'highest',
  format: 'mp4',
})
  .pipe(fs.createWriteStream('assets/video.mp4'))
  .on('finish', () => {
    console.log('Download completed! ✅');
  })
  .on('error', err => {
    console.error('Error during download:', err);
  });
