import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { db } from './src/server/db.js';

dotenv.config();

function getBackendSupabaseClient(): SupabaseClient | null {
  const settings = db.getSettings();
  const url = settings?.supabase?.projectUrl || process.env.VITE_SUPABASE_URL || '';
  const key = settings?.supabase?.serviceRoleKey || settings?.supabase?.anonKey || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  try {
    return createClient(url.trim().replace(/\/$/, ''), key.trim());
  } catch (err) {
    console.warn('Backend Supabase initialization failed:', err);
    return null;
  }
}

async function syncPlayerToSupabase(player: any, action: 'upsert' | 'delete') {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === 'delete') {
      await sb.from('players').delete().eq('id', player.id);
    } else {
      await sb.from('players').upsert({
        id: player.id,
        full_name: player.fullName,
        primary_position: player.primaryPosition,
        nationality: player.nationality,
        year_of_birth: player.yearOfBirth ? parseInt(String(player.yearOfBirth), 10) : (player.dateOfBirth ? parseInt(player.dateOfBirth.slice(0, 4), 10) : null),
        date_of_birth: player.dateOfBirth || (player.yearOfBirth ? `${player.yearOfBirth}-01-01` : null),
        playing_level: player.playingLevel || 'Amateur',
        status: player.status || 'published',
        is_featured: Boolean(player.isFeatured),
        photo_url: player.photoUrl || null,
        bio: player.bio || null,
        career_details: player.careerDetails || [],
        video_url: player.videoUrl || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('Supabase player sync warning:', err);
  }
}

async function syncPackageToSupabase(pkg: any, action: 'upsert' | 'delete') {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === 'delete') {
      await sb.from('travel_packages').delete().eq('id', pkg.id);
    } else {
      await sb.from('travel_packages').upsert({
        id: pkg.id,
        title: pkg.title,
        destination: pkg.destination,
        cover_image: pkg.coverImage,
        duration: pkg.duration,
        description: pkg.description || null,
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        price: pkg.price || null,
        currency: pkg.currency || 'GBP',
        travel_dates: pkg.travelDates || null,
        status: pkg.status || 'published',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('Supabase package sync warning:', err);
  }
}

async function syncNewsToSupabase(article: any, action: 'upsert' | 'delete') {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === 'delete') {
      await sb.from('news_articles').delete().eq('id', article.id);
    } else {
      await sb.from('news_articles').upsert({
        id: article.id,
        title: article.title,
        slug: article.slug,
        cover_image: article.coverImage,
        category: article.category,
        publication_date: article.publicationDate || new Date().toISOString().split('T')[0],
        author: article.author || 'Chamonvin Media',
        content: article.content,
        status: article.status || 'published',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('Supabase news sync warning:', err);
  }
}

async function syncOwnerProfileToSupabase(profile: any) {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    await sb.from('owner_profile').upsert({
      id: profile.id || 'owner_main',
      full_name: profile.fullName,
      role_title: profile.roleTitle,
      secondary_title: profile.secondaryTitle || null,
      photo_url: profile.photoUrl,
      bio: profile.bio,
      quote: profile.quote || null,
      credentials: profile.credentials || [],
      email: profile.email || null,
      phone: profile.phone || null,
      whatsapp: profile.whatsapp || null,
      linkedin_url: profile.linkedinUrl || null,
      twitter_url: profile.twitterUrl || null,
      instagram_url: profile.instagramUrl || null,
      is_published: Boolean(profile.isPublished),
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase owner profile sync warning:', err);
  }
}

async function syncGalleryItemToSupabase(item: any, action: 'upsert' | 'delete') {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === 'delete') {
      await sb.from('gallery_items').delete().eq('id', item.id);
    } else {
      await sb.from('gallery_items').upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        image_url: item.imageUrl,
        description: item.description,
        location: item.location || null,
        date: item.date || null,
        is_featured: Boolean(item.isFeatured),
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('Supabase gallery item sync warning:', err);
  }
}

async function pullPlayersFromSupabase() {
  const sb = getBackendSupabaseClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('players').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((row: any) => ({
        id: row.id,
        fullName: row.full_name,
        primaryPosition: row.primary_position,
        nationality: row.nationality,
        yearOfBirth: row.year_of_birth || (row.date_of_birth ? String(row.date_of_birth).slice(0, 4) : row.age ? (new Date().getFullYear() - row.age) : undefined),
        dateOfBirth: row.date_of_birth || undefined,
        playingLevel: row.playing_level || 'Professional',
        status: row.status || 'published',
        isFeatured: Boolean(row.is_featured),
        photoUrl: row.photo_url || '',
        bio: row.bio || '',
        careerDetails: row.career_details || [],
        videoUrl: row.video_url || undefined,
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString()
      }));
      db.setPlayers(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase auto-pull error:', err);
  }
  return null;
}

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production' || !fs.existsSync(path.resolve(process.cwd(), 'src', 'App.tsx'));

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg\+xml|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (JPG, PNG, WebP, SVG) are permitted.'));
    }
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple in-memory rate limiter for login
const loginAttempts: Record<string, { count: number; resetAt: number }> = {};
function checkRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts[ip];
  if (record && record.resetAt > now) {
    if (record.count >= 6) {
      return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes before trying again.' });
    }
    record.count++;
  } else {
    loginAttempts[ip] = { count: 1, resetAt: now + 15 * 60 * 1000 };
  }
  next();
}

// Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  const token = authHeader.split(' ')[1];
  const session = db.getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
  (req as any).user = session;
  next();
}

// Download routes for deployment packages
app.get(['/dist.zip', '/download/dist.zip'], (_req: Request, res: Response) => {
  const filePath = path.resolve(process.cwd(), 'dist.zip');
  if (fs.existsSync(filePath)) {
    return res.download(filePath, 'dist.zip');
  }
  return res.status(404).send('dist.zip not found');
});

app.get(['/chamonvin-full-deployment.zip', '/download/full-deployment.zip'], (_req: Request, res: Response) => {
  const filePath = path.resolve(process.cwd(), 'chamonvin-full-deployment.zip');
  if (fs.existsSync(filePath)) {
    return res.download(filePath, 'chamonvin-full-deployment.zip');
  }
  return res.status(404).send('chamonvin-full-deployment.zip not found');
});

// ================= API ROUTES =================

// --- Auth Routes ---
app.post('/api/auth/login', checkRateLimit, (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getAdminByEmail(email.trim());
  if (!user || !db.verifyPassword(password, user)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const session = db.createSession(user.id, user.email);
  db.logAction('LOGIN_SUCCESS', user.email, `Successful login from ${req.ip || 'remote'}`);
  return res.json({
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/auth/me', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).user;
  const user = db.getAdminByEmail(session.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.deleteSession(token);
  }
  return res.json({ success: true });
});

app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const session = (req as any).user;
  const user = db.getAdminByEmail(session.email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!db.verifyPassword(currentPassword, user)) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  db.updateAdminPassword(user.id, newPassword);
  return res.json({ success: true, message: 'Password updated successfully. Please sign in again.' });
});

// --- Settings & Appearance ---
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  return res.json(settings);
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updateSettings(req.body, session.email);
  return res.json(updated);
});

// --- Image Upload ---
app.post('/api/upload', requireAdmin, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// --- Players ---
app.get('/api/players', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (db.getSession(token)) isAdmin = true;
  }
  // Automatically pull from Supabase if connected
  await pullPlayersFromSupabase();
  const players = db.getPlayers(!isAdmin);
  return res.json(players);
});

app.get('/api/players/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (db.getSession(token)) isAdmin = true;
  }
  let player = db.getPlayerById(req.params.id, !isAdmin);
  if (!player) {
    await pullPlayersFromSupabase();
    player = db.getPlayerById(req.params.id, !isAdmin);
  }
  if (!player) {
    return res.status(404).json({ error: 'Player profile not found.' });
  }
  return res.json(player);
});

app.post('/api/players', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const { fullName, primaryPosition, playingLevel } = req.body;
  if (!fullName || !primaryPosition || !playingLevel) {
    return res.status(400).json({ error: 'Full name, position, and playing level are required.' });
  }
  const newPlayer = db.createPlayer(req.body, session.email);
  syncPlayerToSupabase(newPlayer, 'upsert');
  return res.status(201).json(newPlayer);
});

app.put('/api/players/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updatePlayer(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: 'Player not found.' });
  syncPlayerToSupabase(updated, 'upsert');
  return res.json(updated);
});

app.delete('/api/players/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const success = db.deletePlayer(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: 'Player not found.' });
  syncPlayerToSupabase({ id: req.params.id }, 'delete');
  return res.json({ success: true });
});

// --- Travel Packages ---
app.get('/api/packages', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (db.getSession(token)) isAdmin = true;
  }
  const packages = db.getPackages(!isAdmin);
  return res.json(packages);
});

app.post('/api/packages', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const { title, destination } = req.body;
  if (!title || !destination) {
    return res.status(400).json({ error: 'Title and destination are required.' });
  }
  const pkg = db.createPackage(req.body, session.email);
  syncPackageToSupabase(pkg, 'upsert');
  return res.status(201).json(pkg);
});

app.put('/api/packages/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updatePackage(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: 'Package not found' });
  syncPackageToSupabase(updated, 'upsert');
  return res.json(updated);
});

app.delete('/api/packages/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const success = db.deletePackage(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: 'Package not found' });
  syncPackageToSupabase({ id: req.params.id }, 'delete');
  return res.json({ success: true });
});

// --- News Articles ---
app.get('/api/news', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (db.getSession(token)) isAdmin = true;
  }
  const articles = db.getNews(!isAdmin);
  return res.json(articles);
});

app.get('/api/news/:idOrSlug', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (db.getSession(token)) isAdmin = true;
  }
  const article = db.getNewsById(req.params.idOrSlug, !isAdmin);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  return res.json(article);
});

app.post('/api/news', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, category, and content are required.' });
  }
  const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const article = db.createNews({ ...req.body, slug }, session.email);
  syncNewsToSupabase(article, 'upsert');
  return res.status(201).json(article);
});

app.put('/api/news/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updateNews(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: 'Article not found' });
  syncNewsToSupabase(updated, 'upsert');
  return res.json(updated);
});

app.delete('/api/news/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const success = db.deleteNews(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: 'Article not found' });
  syncNewsToSupabase({ id: req.params.id }, 'delete');
  return res.json({ success: true });
});

// --- Inquiries (Public Submission & Admin Management) ---
app.post('/api/inquiries', (req: Request, res: Response) => {
  // Anti-spam honeypot
  if (req.body.company_fax) {
    return res.status(400).json({ error: 'Spam submission detected' });
  }

  const { type, clientName, clientEmail, clientPhone, countryOfResidence, details } = req.body;
  if (!type || !clientName || !clientEmail || !clientPhone) {
    return res.status(400).json({ error: 'Please provide your name, valid email, and contact telephone/WhatsApp.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const inquiry = db.createInquiry({
    type,
    clientName: clientName.trim(),
    clientEmail: clientEmail.trim(),
    clientPhone: clientPhone.trim(),
    countryOfResidence: countryOfResidence?.trim() || '',
    details: details || {}
  });

  return res.status(201).json({
    success: true,
    refNumber: inquiry.refNumber,
    message: 'Your inquiry has been received. Our team will review your submission and contact you directly.'
  });
});

app.get('/api/inquiries', requireAdmin, (req: Request, res: Response) => {
  const { type, status } = req.query;
  const inquiries = db.getInquiries(type as string, status as string);
  return res.json(inquiries);
});

app.get('/api/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
  return res.json(inquiry);
});

app.patch('/api/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updateInquiry(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
  return res.json(updated);
});

app.delete('/api/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).user;
  const success = db.deleteInquiry(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: 'Inquiry not found' });
  return res.json({ success: true });
});

// --- Admin Stats & Audit Logs ---
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const stats = db.getStats();
  return res.json(stats);
});

app.get('/api/admin/logs', requireAdmin, (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  return res.json(logs);
});

// --- Supabase Data Push & Full Synchronization ---
app.post('/api/admin/supabase/sync', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const sb = getBackendSupabaseClient();
  if (!sb) {
    return res.status(400).json({
      error: 'Supabase credentials missing. Please enter your Project URL and Anon/Public Key in Settings -> Supabase tab first.'
    });
  }

  try {
    const settings = db.getSettings();
    const players = db.getPlayers(false);
    const packages = db.getPackages(false);
    const news = db.getNews(false);
    const inquiries = db.getInquiries();

    // 1. Sync Company Settings
    const { error: settingsErr } = await sb.from('company_settings').upsert({
      id: 'settings_main',
      company_name: settings.companyName,
      logo_url: settings.logoUrl,
      hero_tagline: settings.heroTagline,
      hero_interval: settings.heroInterval || 5000,
      hero_slides: settings.heroSlides || [],
      hero_buttons: settings.heroButtons || [],
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      contact_whatsapp: settings.contactWhatsapp || null,
      office_address: settings.officeAddress || null,
      business_hours: settings.businessHours || null,
      socials: settings.socials || {},
      content: settings.content || {},
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (settingsErr) {
      if (settingsErr.code === '42P01') {
        return res.status(400).json({
          error: 'The tables do not exist in Supabase yet. Please run the SQL script from /supabase/schema.sql in your Supabase SQL Editor.'
        });
      }
      return res.status(400).json({
        error: `Supabase settings error: ${settingsErr.message}`
      });
    }

    // 2. Sync Players
    const mappedPlayers = players.map(p => ({
      id: p.id,
      full_name: p.fullName,
      primary_position: p.primaryPosition,
      nationality: p.nationality,
      date_of_birth: p.dateOfBirth || null,
      age: p.age || null,
      current_club: p.currentClub || null,
      preferred_foot: p.preferredFoot || 'Right',
      playing_level: p.playingLevel || 'Amateur',
      status: p.status || 'published',
      is_featured: Boolean(p.isFeatured),
      photo_url: p.photoUrl || null,
      bio: p.bio || null,
      career_details: p.careerDetails || [],
      video_url: p.videoUrl || null,
      updated_at: new Date().toISOString()
    }));
    if (mappedPlayers.length > 0) {
      const { error: playerErr } = await sb.from('players').upsert(mappedPlayers, { onConflict: 'id' });
      if (playerErr) throw new Error(`Players sync failed: ${playerErr.message}`);
    }

    // 3. Sync Travel Packages
    const mappedPackages = packages.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      destination: pkg.destination,
      cover_image: pkg.coverImage,
      duration: pkg.duration,
      description: pkg.description || null,
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      price: pkg.price || null,
      currency: pkg.currency || 'GBP',
      travel_dates: pkg.travelDates || null,
      status: pkg.status || 'published',
      updated_at: new Date().toISOString()
    }));
    if (mappedPackages.length > 0) {
      const { error: pkgErr } = await sb.from('travel_packages').upsert(mappedPackages, { onConflict: 'id' });
      if (pkgErr) throw new Error(`Travel packages sync failed: ${pkgErr.message}`);
    }

    // 4. Sync News Articles
    const mappedNews = news.map(n => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      cover_image: n.coverImage,
      category: n.category,
      publication_date: n.publicationDate || new Date().toISOString().split('T')[0],
      author: n.author || 'Chamonvin Media',
      content: n.content,
      status: n.status || 'published',
      updated_at: new Date().toISOString()
    }));
    if (mappedNews.length > 0) {
      const { error: newsErr } = await sb.from('news_articles').upsert(mappedNews, { onConflict: 'id' });
      if (newsErr) throw new Error(`News sync failed: ${newsErr.message}`);
    }

    // 5. Sync Inquiries
    const mappedInquiries = inquiries.map(inq => ({
      id: inq.id,
      ref_number: inq.refNumber,
      type: inq.type,
      client_name: inq.clientName,
      client_email: inq.clientEmail,
      client_phone: inq.clientPhone,
      country_of_residence: inq.countryOfResidence || null,
      details: inq.details || {},
      status: inq.status || 'new',
      read: Boolean(inq.read),
      follow_up_date: inq.followUpDate || null,
      created_at: inq.createdAt || new Date().toISOString(),
      updated_at: inq.updatedAt || new Date().toISOString()
    }));
    if (mappedInquiries.length > 0) {
      const { error: inqErr } = await sb.from('inquiries').upsert(mappedInquiries, { onConflict: 'id' });
      if (inqErr) throw new Error(`Inquiries sync failed: ${inqErr.message}`);
    }

    // 6. Sync Owner Profile
    const ownerProfile = db.getOwnerProfile();
    await sb.from('owner_profile').upsert({
      id: ownerProfile.id || 'owner_main',
      full_name: ownerProfile.fullName,
      role_title: ownerProfile.roleTitle,
      secondary_title: ownerProfile.secondaryTitle || null,
      photo_url: ownerProfile.photoUrl,
      bio: ownerProfile.bio,
      quote: ownerProfile.quote || null,
      credentials: ownerProfile.credentials || [],
      email: ownerProfile.email || null,
      phone: ownerProfile.phone || null,
      whatsapp: ownerProfile.whatsapp || null,
      linkedin_url: ownerProfile.linkedinUrl || null,
      twitter_url: ownerProfile.twitterUrl || null,
      instagram_url: ownerProfile.instagramUrl || null,
      is_published: Boolean(ownerProfile.isPublished),
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    // 7. Sync Gallery Items
    const galleryItems = db.getGalleryItems();
    if (galleryItems.length > 0) {
      const mappedGallery = galleryItems.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category,
        image_url: g.imageUrl,
        description: g.description,
        location: g.location || null,
        date: g.date || null,
        is_featured: Boolean(g.isFeatured),
        created_at: new Date().toISOString()
      }));
      await sb.from('gallery_items').upsert(mappedGallery, { onConflict: 'id' });
    }

    db.logAction('SUPABASE_SYNC', session.email, `Synced ${mappedPlayers.length} players, ${mappedPackages.length} packages, owner profile & gallery to Supabase`);

    return res.json({
      success: true,
      message: 'All website records, owner profile, and gallery successfully synced to Supabase!',
      counts: {
        players: mappedPlayers.length,
        packages: mappedPackages.length,
        news: mappedNews.length,
        inquiries: mappedInquiries.length,
        gallery: galleryItems.length,
        owner: 1,
        settings: 1
      }
    });
  } catch (err: any) {
    console.error('Supabase sync route error:', err);
    return res.status(500).json({ error: err.message || 'Supabase synchronization failed.' });
  }
});

// --- Supabase Pull / Import into Website ---
app.post('/api/admin/supabase/pull', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const sb = getBackendSupabaseClient();
  if (!sb) {
    return res.status(400).json({ error: 'Supabase credentials missing or invalid.' });
  }
  try {
    const [pRes, pkgRes, newsRes, inqRes, ownerRes, galRes] = await Promise.all([
      sb.from('players').select('*'),
      sb.from('travel_packages').select('*'),
      sb.from('news_articles').select('*'),
      sb.from('inquiries').select('*'),
      sb.from('owner_profile').select('*').limit(1).maybeSingle(),
      sb.from('gallery_items').select('*')
    ]);

    let pulledPlayers = 0;
    if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
      const mapped = pRes.data.map((row: any) => ({
        id: row.id,
        fullName: row.full_name,
        primaryPosition: row.primary_position,
        nationality: row.nationality,
        dateOfBirth: row.date_of_birth || undefined,
        age: row.age || undefined,
        currentClub: row.current_club || undefined,
        preferredFoot: row.preferred_foot || 'Right',
        playingLevel: row.playing_level || 'Professional',
        status: row.status || 'published',
        isFeatured: Boolean(row.is_featured),
        photoUrl: row.photo_url || '',
        bio: row.bio || '',
        careerDetails: row.career_details || [],
        videoUrl: row.video_url || undefined,
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString()
      }));
      db.setPlayers(mapped);
      pulledPlayers = mapped.length;
    }

    if (ownerRes.data) {
      db.updateOwnerProfile({
        fullName: ownerRes.data.full_name,
        roleTitle: ownerRes.data.role_title,
        secondaryTitle: ownerRes.data.secondary_title,
        photoUrl: ownerRes.data.photo_url,
        bio: ownerRes.data.bio,
        quote: ownerRes.data.quote,
        credentials: ownerRes.data.credentials || [],
        email: ownerRes.data.email,
        phone: ownerRes.data.phone,
        whatsapp: ownerRes.data.whatsapp,
        linkedinUrl: ownerRes.data.linkedin_url,
        twitterUrl: ownerRes.data.twitter_url,
        instagramUrl: ownerRes.data.instagram_url,
        isPublished: ownerRes.data.is_published
      }, 'supabase_pull');
    }

    if (galRes.data && Array.isArray(galRes.data) && galRes.data.length > 0) {
      const mappedGal = galRes.data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        imageUrl: row.image_url,
        description: row.description,
        location: row.location || undefined,
        date: row.date || undefined,
        isFeatured: Boolean(row.is_featured)
      }));
      db.setGalleryItems(mappedGal);
    }

    db.logAction('SUPABASE_PULL', session.email, `Pulled ${pulledPlayers} players and records from Supabase`);

    return res.json({
      success: true,
      message: `Successfully pulled and synchronized ${pulledPlayers} players and records from Supabase!`,
      counts: {
        players: pulledPlayers,
        packages: pkgRes.data?.length || 0,
        news: newsRes.data?.length || 0,
        gallery: galRes.data?.length || 0
      }
    });
  } catch (err: any) {
    console.error('Supabase pull error:', err);
    return res.status(500).json({ error: err.message || 'Failed to pull from Supabase' });
  }
});

// --- Owner Profile Routes ---
app.get('/api/owner-profile', (_req: Request, res: Response) => {
  const profile = db.getOwnerProfile();
  return res.json(profile);
});

app.put('/api/owner-profile', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updateOwnerProfile(req.body, session.email);
  syncOwnerProfileToSupabase(updated);
  return res.json(updated);
});

// --- Gallery Routes ---
app.get('/api/gallery', (_req: Request, res: Response) => {
  const items = db.getGalleryItems();
  return res.json(items);
});

app.post('/api/gallery', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const { title, category, imageUrl, description } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Title and image URL are required.' });
  }
  const item = db.createGalleryItem(req.body, session.email);
  syncGalleryItemToSupabase(item, 'upsert');
  return res.status(201).json(item);
});

app.put('/api/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const updated = db.updateGalleryItem(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: 'Gallery item not found' });
  syncGalleryItemToSupabase(updated, 'upsert');
  return res.json(updated);
});

app.delete('/api/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const success = db.deleteGalleryItem(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: 'Gallery item not found' });
  syncGalleryItemToSupabase({ id: req.params.id }, 'delete');
  return res.json({ success: true });
});

// ================= FRONTEND MOUNTING =================
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Rejection:', reason);
});

async function startServer() {
  const distIndexExists = fs.existsSync(path.resolve(process.cwd(), 'dist', 'index.html'));
  const rootIndexExists = fs.existsSync(path.resolve(process.cwd(), 'index.html'));
  const shouldServeStatic = isProduction || distIndexExists || rootIndexExists;

  if (shouldServeStatic) {
    const distPath = distIndexExists
      ? path.resolve(process.cwd(), 'dist')
      : (rootIndexExists ? process.cwd() : path.resolve(process.cwd(), 'dist'));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true }
      });
      app.use(vite.middlewares);
    } catch {
      console.warn('[Server] Vite not found, falling back to static files');
      const distPath = path.resolve(process.cwd(), 'dist');
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  // Bind to PORT without hardcoded host so Phusion Passenger and proxies work cleanly
  app.listen(PORT, () => {
    console.log(`[Server] Listening on ${PORT}`);
  });
}

startServer();

export default app;
