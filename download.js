import fs from 'fs';
import ytdl from '@distube/ytdl-core';

ytdl('https://www.youtube.com/watch?v=Z5CbAa-yuZ0', {
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
