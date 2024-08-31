import fs from 'fs';
import path from 'path';

export function GET() {
  createRandomIntegerFile();

  return Response.json('Done!');
}

function createRandomIntegerFile() {
  const randomInteger = Math.floor(Math.random() * 1000000);

  // Define the file path
  const filePath = path.join(process.cwd(), 'public/file.txt');

  // Write the random integer to the file
  fs.writeFileSync(filePath, randomInteger.toString());
}
