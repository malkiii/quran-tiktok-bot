import path from 'path';
import fs from 'fs-extra';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import pkg from '../package.json';

async function main() {
  const pagesDir = path.join(import.meta.dirname, '../pages');
  const publicDir = path.join(import.meta.dirname, '../public');

  // Initialize Markdown parser
  const md = new MarkdownIt();

  // Ensure the public directory exists
  await fs.ensureDir(publicDir);

  // Get all .md files from the pages directory
  const files = (await fs.readdir(pagesDir)).filter(file => path.extname(file) === '.md');

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse front matter and content
    const { data, content } = matter(fileContent);

    // Convert markdown content to HTML
    const htmlContent = md.render(content);

    // Create the HTML page with the content
    const page = createHtmlPage(
      data.title ? `${data.title} | ${config.title}` : config.title,
      htmlContent.trim(),
    );

    // Determine the new file name with .html extension
    const htmlFileName = path.basename(file, '.md') + '.html';
    const htmlFilePath = path.join(publicDir, htmlFileName);

    // Write the HTML content to the public directory
    await fs.writeFile(htmlFilePath, page);
  }

  console.log(`✅ Build completed! ${files.length} pages created.`);
}

const config = {
  title: 'Quran TikTok Bot',
  base: `/${pkg.name}`,
} as const;

const createHtmlPage = (title: string, content: string) => `\
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${title}</title>
    <link rel="icon" href="${config.base}/logo.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <style type="text/tailwindcss">
      @layer base {
        body {
          font-family: 'Inter', inherit;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
          -webkit-tap-highlight-color:transparent;
        }
      }
    </style>
  </head>
  <body>
    <article class="prose prose-neutral mx-auto pt-16 pb-32">
      ${content}
    </article>
  </body>
</html>
`;

main();
