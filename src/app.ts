import fs from 'fs';
import path from 'path';
import express from 'express';

const app = express();

app.use(express.json());

// Status check
app.get('/status', (_, res) => res.status(200).end());

// Serve static files
// app.use(
//   express.static('public', {
//     index: false,
//     extensions: ['jpg', 'png', 'svg', 'woff2', 'xml', 'txt', 'json'],
//   }),
// );

const filePath = path.join(process.cwd(), 'public/file.txt');

// Routes
app.use('/get', (_, res) => {
  const content = getNumberFromFile();

  return res.send(content);
});

app.use('/set', (_, res) => {
  createRandomIntegerFile();

  return res.send('Done!');
});

function getNumberFromFile() {
  if (!fs.existsSync(filePath)) return null;

  return fs.readFileSync(filePath, 'utf-8');
}

function createRandomIntegerFile() {
  const randomInteger = Math.floor(Math.random() * 1000000);

  // Write the random integer to the file
  fs.writeFileSync(filePath, randomInteger.toString());
}

export default app;
