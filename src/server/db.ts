import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseSchema, AdminUser, CompanySettings, Player, TravelPackage, NewsArticle, Inquiry, AuditLog, Session, OwnerProfile, GalleryItem } from '../types/index.js';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

const DEFAULT_OWNER_PROFILE: OwnerProfile = {
  id: 'owner_main',
  fullName: 'Adekunle O.',
  roleTitle: 'Founder & Managing Director',
  secondaryTitle: 'International Sports Management Director & Licensed Football Intermediary',
  photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  bio: 'With extensive experience bridging African football talents with prominent European, UK, and international football structures, the Managing Directorate established Chamonvin Limited on foundational principles of client priority, rigorous ethical representation, and sustainable career stewardship. Overseeing both elite player management and our dedicated travel and visa consultation divisions, our mission remains focused on unlocking genuine, verified international opportunities for every client we represent.',
  quote: 'At Chamonvin Limited, your vision and goal is our priority. Every player and client deserves genuine advocacy, complete transparency, and relentless dedication to their long-term longevity on and off the pitch.',
  credentials: [
    'International Football Management & Player Representation',
    'FIFA & Global Intermediary Network Relations',
    'International Travel Logistics & Visa Advisory Liaison',
    'West Africa & European Football Scouting Director'
  ],
  email: 'director@chamonvin.com',
  phone: '+44 20 7946 0192',
  whatsapp: '+44 7700 900192',
  linkedinUrl: 'https://linkedin.com/company/chamonvin-limited',
  twitterUrl: 'https://twitter.com/chamonvinltd',
  instagramUrl: 'https://instagram.com/chamonvinltd',
  isPublished: true,
  updatedAt: new Date().toISOString()
};

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'European Scouting Match & Technical Assessment',
    category: 'Scouting & Matches',
    imageUrl: '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg',
    description: 'Scouting delegation assessing tactical positioning and match fitness during an international exhibition encounter.',
    location: 'Lisbon, Portugal',
    date: '2026 Season',
    isFeatured: true
  },
  {
    id: 'gal-2',
    title: 'Elite Training Pitch & Athletic Conditioning',
    category: 'Training & Performance',
    imageUrl: '/src/assets/images/hero_field_goalposts_1792410719341.jpg',
    description: 'High-performance pitch setup for individual athletic drills, ball progression, and technical development sessions.',
    location: 'Madrid, Spain',
    date: '2026 Season',
    isFeatured: true
  },
  {
    id: 'gal-3',
    title: 'International Stadium Match Atmosphere',
    category: 'Scouting & Matches',
    imageUrl: '/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg',
    description: 'Spectacular European matchday environment providing represented talents with firsthand exposure to top-flight competition.',
    location: 'London, United Kingdom',
    date: '2026 Season',
    isFeatured: true
  },
  {
    id: 'gal-4',
    title: 'Tactical Analysis & Video Scouting Review',
    category: 'Management & Events',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    description: 'In-depth tactical video reviews and performance data breakdown curated by Chamonvin scouting analysts for club scouts.',
    location: 'Chamonvin HQ, London',
    date: '2026 Season',
    isFeatured: false
  },
  {
    id: 'gal-5',
    title: 'Player Contract Advisory & Management Consultation',
    category: 'Management & Events',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    description: 'Transparent contract guidance, player welfare briefings, and legal representation sessions ensuring client interests are protected.',
    location: 'Victoria Island, Lagos',
    date: '2026 Season',
    isFeatured: true
  },
  {
    id: 'gal-6',
    title: 'International Travel & Sports Delegation Gateway',
    category: 'Travel & Tours',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    description: 'Seamless group flight coordination, visa facilitation, and airport logistics for traveling sports squads and delegates.',
    location: 'Heathrow Airport, UK',
    date: '2026 Season',
    isFeatured: true
  }
];

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'CHAMONVIN LIMITED',
  logoUrl: 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg',
  heroTagline: 'Your vision and Goal is our Priority',
  heroInterval: 15000,
  heroSlides: [
    {
      id: 'slide-1',
      image: '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg',
      title: 'Global Sports Management & Player Representation',
      subtitle: 'Dedicated high-quality representation for ambitious football talents, on and off the pitch.'
    },
    {
      id: 'slide-2',
      image: '/src/assets/images/hero_field_goalposts_1792410719341.jpg',
      title: 'Strategic Career Pathways & International Opportunities',
      subtitle: 'Helping players and clubs navigate contracts, transfers, and high-performance development.'
    },
    {
      id: 'slide-3',
      image: '/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg',
      title: 'International Travel, Tours & Visa Consultation',
      subtitle: 'Flight booking consultation, family and group tour planning, and eligible visa guidance.'
    }
  ],
  heroButtons: [
    { label: 'Explore Our Sports Management', link: '/sports-management' },
    { label: 'Explore Travel & Visa Services', link: '/travel-tours' },
    { label: 'Become a Represented Player', link: '/player-representation' },
    { label: 'Book a Consultation', link: '/contact' }
  ],
  contactEmail: 'contact@chamonvin.com',
  contactPhone: '+44 20 7946 0192',
  contactWhatsapp: '+44 7700 900192',
  officeAddress: 'Headquarters: 18 Grosvenor Place, London SW1X 7HN / West Africa Liaison: Victoria Island, Lagos',
  businessHours: 'Monday – Friday: 08:30 – 18:00 (GMT)',
  socials: {
    twitter: 'https://twitter.com/chamonvinltd',
    instagram: 'https://instagram.com/chamonvinltd',
    linkedin: 'https://linkedin.com/company/chamonvin-limited',
    facebook: 'https://facebook.com/chamonvinltd'
  },
  content: {
    aboutOverview:
      "At Chamonvin Limited, our clients' priorities come first, every time. Chamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation. We represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.",
    aboutMission:
      "Our mission is to empower footballers and international travelers through rigorous professional support, ethical career guidance, personalized attention, and transparent consultation that unlocks eligible global opportunities.",
    aboutVision:
      "To be recognized worldwide as a premier sports management and bespoke travel consultancy firm celebrated for integrity, client success, and sustainable career longevity.",
    aboutValues:
      "Client Priority, Absolute Integrity, International Excellence, Professional Confidentiality, and Long-Term Career Stewardship.",
    aboutPhilosophy:
      "We understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.",
    sportsManagementOverview:
      "Chamonvin Limited offers comprehensive football representation, talent management, contract guidance, and career planning across amateur, semi-professional, and professional tiers.",
    travelVisaOverview:
      "Our travel and visa division assists individuals, families, students, and professionals with travel itineraries, flight reservation support, and procedural consultation for eligible visa and residency pathways.",
    visaDisclaimer:
      "Notice & Disclaimer: All visa, work authorization, and immigration determinations are rendered solely by the relevant national government authorities and consulates. Requirements, processing times, and eligibility criteria are subject to change without notice. Chamonvin Limited provides procedural assessment, documentation guidance, and application consultation. Chamonvin Limited does not guarantee visa approval, employment offers, or permanent residence.",
    flightDisclaimer:
      "Notice: Chamonvin Limited provides travel itinerary consultation, flight schedule reviews, and reservation assistance. Final seat availability, baggage allowances, and airfares are determined by operating airlines at the time of ticket issuance.",
    privacyPolicy:
      "Chamonvin Limited treats all client inquiries, player profiles, and documentation with strict confidentiality. Personal data collected via this website is utilized strictly for consulting services and client communication in compliance with international data privacy standards.",
    termsConditions:
      "By using this website or engaging Chamonvin Limited services, you agree to our terms of service, consulting guidelines, and service disclaimers."
  }
};

function createInitialDatabase(): DatabaseSchema {
  const adminSalt = generateSalt();
  const defaultAdmin: AdminUser = {
    id: 'admin_1',
    email: 'admin@chamonvin.com',
    name: 'Chamonvin Administration',
    role: 'super_admin',
    passwordHash: hashPassword('Chamonvin2026!', adminSalt),
    salt: adminSalt,
    createdAt: new Date().toISOString()
  };

  return {
    adminUsers: [defaultAdmin],
    sessions: [],
    settings: DEFAULT_SETTINGS,
    players: [], // empty as per prompt rule: no invented players, admin manages real players
    travelPackages: [
      {
        id: 'pkg-1',
        title: 'European Football Academy & Scouting Experience',
        destination: 'Madrid & Lisbon, Europe',
        coverImage: '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg',
        duration: '10 Days / 9 Nights',
        description: 'Comprehensive sports tour package for clubs and player cohorts exploring European football infrastructure, friendly exhibition fixtures, and professional sports travel arrangements.',
        inclusions: [
          'Pre-arranged accommodation near training complexes',
          'Internal group logistics and ground transit',
          'Itinerary coordination for training facilities',
          'Group travel visa consultation assistance'
        ],
        exclusions: ['Personal spending', 'Individual player insurance', 'Unscheduled leisure tours'],
        price: 'Inquire for Custom Itinerary',
        currency: 'GBP',
        travelDates: 'Spring & Summer Sessions Available',
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pkg-2',
        title: 'International Business & Sports Conference Gateway',
        destination: 'London, United Kingdom',
        coverImage: '/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg',
        duration: '5 Days / 4 Nights',
        description: 'Tailored corporate travel itinerary for sports managers, club executives, and business professionals attending international sports summits and executive meetings.',
        inclusions: [
          'Premium central hotel reservation assistance',
          'Airport transfer coordination',
          'Business visitor visa procedural guidance',
          'Dedicated travel consultant support'
        ],
        exclusions: ['Conference registration tickets', 'Personal meals', 'Incidental hotel charges'],
        price: 'Tailored per delegation',
        currency: 'GBP',
        travelDates: 'Year-Round Booking',
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    newsArticles: [
      {
        id: 'news-1',
        title: 'Chamonvin Limited Expands International Scouting & Player Pathways',
        slug: 'chamonvin-expands-international-scouting',
        coverImage: '/src/assets/images/hero_field_goalposts_1792410719341.jpg',
        category: 'Football Management',
        publicationDate: '2026-10-15',
        author: 'Management Directorate',
        content: `Chamonvin Limited is pleased to announce the broadening of our player representation network across key football territories.

With an uncompromising focus on player-first career planning, our sports management team works closely with amateur, semi-professional, and professional footballers. From comprehensive athletic profiling to contract advisory and relocation logistics, we ensure that every client's journey is supported with the highest standard of professionalism.

Prospective players and registered clubs are invited to connect directly with our sports division to explore representation and management opportunities.`,
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'news-2',
        title: 'Navigating International Visa Protocols for Athletes and Business Travelers',
        slug: 'navigating-international-visa-protocols',
        coverImage: '/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg',
        category: 'Travel & Visa Updates',
        publicationDate: '2026-10-08',
        author: 'Visa Consultation Unit',
        content: `Global mobility remains a cornerstone for athletes participating in trials, students pursuing overseas academic programs, and families coordinating international travel.

Our dedicated travel and visa consulting unit provides structured guidance across visitor visas, study permits, business immigration pathways, and skilled employment categories. We place paramount importance on procedural accuracy, complete documentation, and transparent realistic guidance.

For consultations regarding your intended destination, reach out through our dedicated Visa Consultation portal.`,
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    inquiries: [],
    auditLogs: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_INIT',
        user: 'system',
        details: 'Initial database bootstrapped with official company parameters and secure admin role.'
      }
    ],
    ownerProfile: DEFAULT_OWNER_PROFILE,
    galleryItems: DEFAULT_GALLERY_ITEMS
  };
}

class Database {
  private schema: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.schema = JSON.parse(raw);
        // Ensure all required fields exist
        if (!this.schema.settings) this.schema.settings = DEFAULT_SETTINGS;
        if (!this.schema.ownerProfile) this.schema.ownerProfile = DEFAULT_OWNER_PROFILE;
        if (!this.schema.galleryItems) this.schema.galleryItems = DEFAULT_GALLERY_ITEMS;
        if (!this.schema.adminUsers) this.schema.adminUsers = [];
        if (!this.schema.sessions) this.schema.sessions = [];
        if (!this.schema.players) this.schema.players = [];
        if (!this.schema.travelPackages) this.schema.travelPackages = [];
        if (!this.schema.newsArticles) this.schema.newsArticles = [];
        if (!this.schema.inquiries) this.schema.inquiries = [];
        if (!this.schema.auditLogs) this.schema.auditLogs = [];
      } catch (err) {
        console.error('Failed reading database file, recreating:', err);
        this.schema = createInitialDatabase();
        this.persist();
      }
    } else {
      this.schema = createInitialDatabase();
      this.persist();
    }
  }

  private persist() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.schema, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  // --- Auth & Admin Operations ---
  getAdminByEmail(email: string): AdminUser | undefined {
    return this.schema.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  verifyPassword(password: string, user: AdminUser): boolean {
    const hashed = hashPassword(password, user.salt);
    return hashed === user.passwordHash;
  }

  createSession(userId: string, email: string): Session {
    // 24 hour session
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const session: Session = { token, userId, email, expiresAt };
    this.schema.sessions.push(session);
    // Cleanup expired
    this.schema.sessions = this.schema.sessions.filter(s => s.expiresAt > Date.now());
    this.persist();
    return session;
  }

  getSession(token: string): Session | undefined {
    const s = this.schema.sessions.find(session => session.token === token);
    if (!s) return undefined;
    if (s.expiresAt < Date.now()) {
      this.deleteSession(token);
      return undefined;
    }
    return s;
  }

  deleteSession(token: string): void {
    this.schema.sessions = this.schema.sessions.filter(s => s.token !== token);
    this.persist();
  }

  updateAdminPassword(userId: string, newPassword: string): boolean {
    const user = this.schema.adminUsers.find(u => u.id === userId);
    if (!user) return false;
    const salt = generateSalt();
    user.salt = salt;
    user.passwordHash = hashPassword(newPassword, salt);
    this.schema.sessions = this.schema.sessions.filter(s => s.userId !== userId); // log out other sessions
    this.logAction('PASSWORD_UPDATE', user.email, 'Admin changed account password');
    this.persist();
    return true;
  }

  // --- Settings ---
  getSettings(): CompanySettings {
    return this.schema.settings;
  }

  updateSettings(newSettings: Partial<CompanySettings>, userEmail: string): CompanySettings {
    this.schema.settings = {
      ...this.schema.settings,
      ...newSettings,
      content: {
        ...this.schema.settings.content,
        ...(newSettings.content || {})
      },
      socials: {
        ...this.schema.settings.socials,
        ...(newSettings.socials || {})
      }
    };
    this.logAction('SETTINGS_UPDATE', userEmail, 'Updated company settings and appearance');
    this.persist();
    return this.schema.settings;
  }

  // --- Players ---
  getPlayers(publishedOnly = false): Player[] {
    if (publishedOnly) {
      return this.schema.players.filter(p => p.status === 'published');
    }
    return this.schema.players;
  }

  getPlayerById(id: string, publishedOnly = false): Player | undefined {
    const p = this.schema.players.find(item => item.id === id);
    if (!p) return undefined;
    if (publishedOnly && p.status !== 'published') return undefined;
    return p;
  }

  createPlayer(playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>, userEmail: string): Player {
    const newPlayer: Player = {
      ...playerData,
      id: `player_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.schema.players.unshift(newPlayer);
    this.logAction('CREATE_PLAYER', userEmail, `Added player profile: ${newPlayer.fullName}`);
    this.persist();
    return newPlayer;
  }

  updatePlayer(id: string, updates: Partial<Player>, userEmail: string): Player | null {
    const idx = this.schema.players.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.schema.players[idx] = {
      ...this.schema.players[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAction('UPDATE_PLAYER', userEmail, `Updated player profile: ${this.schema.players[idx].fullName}`);
    this.persist();
    return this.schema.players[idx];
  }

  deletePlayer(id: string, userEmail: string): boolean {
    const player = this.schema.players.find(p => p.id === id);
    if (!player) return false;
    this.schema.players = this.schema.players.filter(p => p.id !== id);
    this.logAction('DELETE_PLAYER', userEmail, `Deleted player profile: ${player.fullName}`);
    this.persist();
    return true;
  }

  // --- Travel Packages ---
  getPackages(publishedOnly = false): TravelPackage[] {
    if (publishedOnly) {
      return this.schema.travelPackages.filter(p => p.status === 'published');
    }
    return this.schema.travelPackages;
  }

  getPackageById(id: string, publishedOnly = false): TravelPackage | undefined {
    const p = this.schema.travelPackages.find(item => item.id === id);
    if (!p) return undefined;
    if (publishedOnly && p.status !== 'published') return undefined;
    return p;
  }

  createPackage(pkgData: Omit<TravelPackage, 'id' | 'createdAt' | 'updatedAt'>, userEmail: string): TravelPackage {
    const newPkg: TravelPackage = {
      ...pkgData,
      id: `pkg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.schema.travelPackages.unshift(newPkg);
    this.logAction('CREATE_PACKAGE', userEmail, `Created travel package: ${newPkg.title}`);
    this.persist();
    return newPkg;
  }

  updatePackage(id: string, updates: Partial<TravelPackage>, userEmail: string): TravelPackage | null {
    const idx = this.schema.travelPackages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.schema.travelPackages[idx] = {
      ...this.schema.travelPackages[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAction('UPDATE_PACKAGE', userEmail, `Updated travel package: ${this.schema.travelPackages[idx].title}`);
    this.persist();
    return this.schema.travelPackages[idx];
  }

  deletePackage(id: string, userEmail: string): boolean {
    const pkg = this.schema.travelPackages.find(p => p.id === id);
    if (!pkg) return false;
    this.schema.travelPackages = this.schema.travelPackages.filter(p => p.id !== id);
    this.logAction('DELETE_PACKAGE', userEmail, `Deleted package: ${pkg.title}`);
    this.persist();
    return true;
  }

  // --- News Articles ---
  getNews(publishedOnly = false): NewsArticle[] {
    if (publishedOnly) {
      return this.schema.newsArticles.filter(n => n.status === 'published');
    }
    return this.schema.newsArticles;
  }

  getNewsById(idOrSlug: string, publishedOnly = false): NewsArticle | undefined {
    const item = this.schema.newsArticles.find(n => n.id === idOrSlug || n.slug === idOrSlug);
    if (!item) return undefined;
    if (publishedOnly && item.status !== 'published') return undefined;
    return item;
  }

  createNews(newsData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>, userEmail: string): NewsArticle {
    const newArticle: NewsArticle = {
      ...newsData,
      id: `news_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.schema.newsArticles.unshift(newArticle);
    this.logAction('CREATE_NEWS', userEmail, `Created news article: ${newArticle.title}`);
    this.persist();
    return newArticle;
  }

  updateNews(id: string, updates: Partial<NewsArticle>, userEmail: string): NewsArticle | null {
    const idx = this.schema.newsArticles.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.schema.newsArticles[idx] = {
      ...this.schema.newsArticles[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAction('UPDATE_NEWS', userEmail, `Updated news article: ${this.schema.newsArticles[idx].title}`);
    this.persist();
    return this.schema.newsArticles[idx];
  }

  deleteNews(id: string, userEmail: string): boolean {
    const article = this.schema.newsArticles.find(n => n.id === id);
    if (!article) return false;
    this.schema.newsArticles = this.schema.newsArticles.filter(n => n.id !== id);
    this.logAction('DELETE_NEWS', userEmail, `Deleted news article: ${article.title}`);
    this.persist();
    return true;
  }

  // --- Inquiries ---
  createInquiry(data: {
    type: Inquiry['type'];
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    countryOfResidence?: string;
    details: Record<string, any>;
  }): Inquiry {
    // Generate human-friendly reference number
    const prefixMap: Record<Inquiry['type'], string> = {
      player_representation: 'REP',
      sports_management: 'SPT',
      general_contact: 'GEN',
      travel_tours: 'TRV',
      visa_consultation: 'VIS',
      flight_services: 'FLT'
    };
    const prefix = prefixMap[data.type] || 'INQ';
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const refNumber = `CHM-${prefix}-${randomDigits}`;

    const newInquiry: Inquiry = {
      id: `inq_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      refNumber,
      type: data.type,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      countryOfResidence: data.countryOfResidence,
      status: 'new',
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      internalNotes: [],
      details: data.details
    };

    this.schema.inquiries.unshift(newInquiry);
    this.logAction('NEW_INQUIRY', 'public_portal', `Inquiry received (${refNumber}) from ${data.clientName}`);
    this.persist();
    return newInquiry;
  }

  getInquiries(filterType?: string, status?: string): Inquiry[] {
    let result = [...this.schema.inquiries];
    if (filterType && filterType !== 'all') {
      result = result.filter(i => i.type === filterType);
    }
    if (status && status !== 'all') {
      result = result.filter(i => i.status === status);
    }
    return result;
  }

  getInquiryById(id: string): Inquiry | undefined {
    return this.schema.inquiries.find(i => i.id === id);
  }

  updateInquiry(id: string, updates: {
    status?: Inquiry['status'];
    read?: boolean;
    followUpDate?: string | null;
    newNote?: { text: string; author: string };
  }, userEmail: string): Inquiry | null {
    const inq = this.schema.inquiries.find(i => i.id === id);
    if (!inq) return null;

    if (updates.status) inq.status = updates.status;
    if (updates.read !== undefined) inq.read = updates.read;
    if (updates.followUpDate !== undefined) inq.followUpDate = updates.followUpDate;

    if (updates.newNote && updates.newNote.text.trim()) {
      inq.internalNotes.push({
        id: `note_${Date.now()}`,
        text: updates.newNote.text.trim(),
        author: updates.newNote.author || userEmail,
        createdAt: new Date().toISOString()
      });
    }

    inq.updatedAt = new Date().toISOString();
    this.logAction('UPDATE_INQUIRY', userEmail, `Updated inquiry ${inq.refNumber} status/notes`);
    this.persist();
    return inq;
  }

  deleteInquiry(id: string, userEmail: string): boolean {
    const inq = this.schema.inquiries.find(i => i.id === id);
    if (!inq) return false;
    this.schema.inquiries = this.schema.inquiries.filter(i => i.id !== id);
    this.logAction('DELETE_INQUIRY', userEmail, `Deleted inquiry ${inq.refNumber}`);
    this.persist();
    return true;
  }

  // --- Statistics & Logs ---
  getStats() {
    const players = this.schema.players;
    const inquiries = this.schema.inquiries;
    const articles = this.schema.newsArticles;
    const packages = this.schema.travelPackages;

    return {
      totalPlayers: players.length,
      publishedPlayers: players.filter(p => p.status === 'published').length,
      draftPlayers: players.filter(p => p.status === 'draft').length,
      newPlayerInquiries: inquiries.filter(i => i.type === 'player_representation' && i.status === 'new').length,
      unreadInquiries: inquiries.filter(i => !i.read).length,
      travelVisaInquiries: inquiries.filter(i => (i.type === 'travel_tours' || i.type === 'visa_consultation') && i.status === 'new').length,
      flightInquiries: inquiries.filter(i => i.type === 'flight_services' && i.status === 'new').length,
      publishedNews: articles.filter(a => a.status === 'published').length,
      activePackages: packages.filter(p => p.status === 'published').length,
      totalInquiries: inquiries.length
    };
  }

  logAction(action: string, user: string, details: string) {
    const entry: AuditLog = {
      id: `log_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      timestamp: new Date().toISOString(),
      action,
      user,
      details
    };
    this.schema.auditLogs.unshift(entry);
    // Keep max 200 logs
    if (this.schema.auditLogs.length > 200) {
      this.schema.auditLogs = this.schema.auditLogs.slice(0, 200);
    }
  }

  // --- Owner Profile ---
  getOwnerProfile(): OwnerProfile {
    if (!this.schema.ownerProfile) {
      this.schema.ownerProfile = DEFAULT_OWNER_PROFILE;
      this.persist();
    }
    return this.schema.ownerProfile;
  }

  updateOwnerProfile(updates: Partial<OwnerProfile>, userEmail: string): OwnerProfile {
    this.schema.ownerProfile = {
      ...(this.schema.ownerProfile || DEFAULT_OWNER_PROFILE),
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAction('UPDATE_OWNER_PROFILE', userEmail, 'Updated owner & executive profile');
    this.persist();
    return this.schema.ownerProfile;
  }

  // --- Gallery Items ---
  getGalleryItems(): GalleryItem[] {
    if (!this.schema.galleryItems || this.schema.galleryItems.length === 0) {
      this.schema.galleryItems = DEFAULT_GALLERY_ITEMS;
      this.persist();
    }
    return this.schema.galleryItems;
  }

  createGalleryItem(data: Omit<GalleryItem, 'id'>, userEmail: string): GalleryItem {
    const item: GalleryItem = {
      ...data,
      id: `gal_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`
    };
    if (!this.schema.galleryItems) this.schema.galleryItems = [];
    this.schema.galleryItems.unshift(item);
    this.logAction('CREATE_GALLERY_ITEM', userEmail, `Added gallery photo: ${item.title}`);
    this.persist();
    return item;
  }

  updateGalleryItem(id: string, updates: Partial<GalleryItem>, userEmail: string): GalleryItem | null {
    if (!this.schema.galleryItems) return null;
    const idx = this.schema.galleryItems.findIndex(g => g.id === id);
    if (idx === -1) return null;
    this.schema.galleryItems[idx] = {
      ...this.schema.galleryItems[idx],
      ...updates
    };
    this.logAction('UPDATE_GALLERY_ITEM', userEmail, `Updated gallery photo: ${this.schema.galleryItems[idx].title}`);
    this.persist();
    return this.schema.galleryItems[idx];
  }

  deleteGalleryItem(id: string, userEmail: string): boolean {
    if (!this.schema.galleryItems) return false;
    const item = this.schema.galleryItems.find(g => g.id === id);
    if (!item) return false;
    this.schema.galleryItems = this.schema.galleryItems.filter(g => g.id !== id);
    this.logAction('DELETE_GALLERY_ITEM', userEmail, `Deleted gallery photo: ${item.title}`);
    this.persist();
    return true;
  }

  setGalleryItems(items: GalleryItem[]) {
    this.schema.galleryItems = items;
    this.persist();
  }

  // --- Supabase Player Synchronizer ---
  setPlayers(players: Player[]) {
    this.schema.players = players;
    this.persist();
  }

  upsertPlayer(player: Player) {
    const idx = this.schema.players.findIndex(p => p.id === player.id);
    if (idx >= 0) {
      this.schema.players[idx] = player;
    } else {
      this.schema.players.unshift(player);
    }
    this.persist();
  }

  getAuditLogs(): AuditLog[] {
    return this.schema.auditLogs;
  }
}

export const db = new Database();
