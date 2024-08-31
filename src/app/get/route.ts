import fs from 'fs';
import path from 'path';
import { type NextRequest } from 'next/server';

export function GET(_: NextRequest) {
  const content = getNumberFromFile();

  console.info({ content });

  return Response.json(content);
}

function getNumberFromFile() {
  const filePath = path.join(process.cwd(), 'public/file.txt');

  if (!fs.existsSync(filePath)) return null;

  return fs.readFileSync(filePath, 'utf-8');
}
