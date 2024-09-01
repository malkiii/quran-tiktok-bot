import path from 'path';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Set Templating Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));
app.set('layout', 'layout');

// Status check
app.get('/status', (_, res) => res.status(200).end());

// Serve static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.get('/', (_, res) => {
  res.render('home', { title: 'Quran TikTok Bot' });
});

export default app;
