import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import { trackLastVisit } from './middleware/lastVisit.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'easily.sid',
  secret: process.env.SESSION_SECRET || 'easily-development-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(trackLastVisit);
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  res.locals.lastVisit = req.lastVisit || null;
  next();
});

app.get('/', (req, res) => res.render('home', { title: 'Find Your Dream Job' }));
app.use(userRoutes);
app.use(jobRoutes);
app.use(applicationRoutes);

app.use((req, res) => res.status(404).render('error', {
  title: 'Page not found', status: 404, message: 'The page you are looking for does not exist.'
}));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError' || err.message?.includes('resume')) {
    return res.status(400).render('error', {
      title: 'Upload error', status: 400, message: err.message || 'The file could not be uploaded.'
    });
  }
  res.status(err.status || 500).render('error', {
    title: 'Something went wrong', status: err.status || 500,
    message: process.env.NODE_ENV === 'production' ? 'Please try again later.' : (err.message || 'Unexpected server error.')
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Easily Job Portal running at http://localhost:${PORT}`));
}

export default app;
