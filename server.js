// server.ts
import express from "express";
import path2 from "path";
import fs2 from "fs";
import multer from "multer";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// src/server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var DB_DIR = path.resolve(process.cwd(), "data");
var DB_FILE = path.join(DB_DIR, "database.json");
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
}
function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}
var DEFAULT_OWNER_PROFILE = {
  id: "owner_main",
  fullName: "Adekunle O.",
  roleTitle: "Founder & Managing Director",
  secondaryTitle: "International Sports Management Director & Licensed Football Intermediary",
  photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  bio: "With extensive experience bridging African football talents with prominent European, UK, and international football structures, the Managing Directorate established Chamonvin Limited on foundational principles of client priority, rigorous ethical representation, and sustainable career stewardship. Overseeing both elite player management and our dedicated travel and visa consultation divisions, our mission remains focused on unlocking genuine, verified international opportunities for every client we represent.",
  quote: "At Chamonvin Limited, your vision and goal is our priority. Every player and client deserves genuine advocacy, complete transparency, and relentless dedication to their long-term longevity on and off the pitch.",
  credentials: [
    "International Football Management & Player Representation",
    "FIFA & Global Intermediary Network Relations",
    "International Travel Logistics & Visa Advisory Liaison",
    "West Africa & European Football Scouting Director"
  ],
  email: "director@chamonvin.com",
  phone: "+44 20 7946 0192",
  whatsapp: "+44 7700 900192",
  linkedinUrl: "https://linkedin.com/company/chamonvin-limited",
  twitterUrl: "https://twitter.com/chamonvinltd",
  instagramUrl: "https://instagram.com/chamonvinltd",
  isPublished: true,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var DEFAULT_GALLERY_ITEMS = [
  {
    id: "gal-1",
    title: "European Scouting Match & Technical Assessment",
    category: "Scouting & Matches",
    imageUrl: "/src/assets/images/hero_football_pitch_stands_1792410704308.jpg",
    description: "Scouting delegation assessing tactical positioning and match fitness during an international exhibition encounter.",
    location: "Lisbon, Portugal",
    date: "2026 Season",
    isFeatured: true
  },
  {
    id: "gal-2",
    title: "Elite Training Pitch & Athletic Conditioning",
    category: "Training & Performance",
    imageUrl: "/src/assets/images/hero_field_goalposts_1792410719341.jpg",
    description: "High-performance pitch setup for individual athletic drills, ball progression, and technical development sessions.",
    location: "Madrid, Spain",
    date: "2026 Season",
    isFeatured: true
  },
  {
    id: "gal-3",
    title: "International Stadium Match Atmosphere",
    category: "Scouting & Matches",
    imageUrl: "/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg",
    description: "Spectacular European matchday environment providing represented talents with firsthand exposure to top-flight competition.",
    location: "London, United Kingdom",
    date: "2026 Season",
    isFeatured: true
  },
  {
    id: "gal-4",
    title: "Tactical Analysis & Video Scouting Review",
    category: "Management & Events",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    description: "In-depth tactical video reviews and performance data breakdown curated by Chamonvin scouting analysts for club scouts.",
    location: "Chamonvin HQ, London",
    date: "2026 Season",
    isFeatured: false
  },
  {
    id: "gal-5",
    title: "Player Contract Advisory & Management Consultation",
    category: "Management & Events",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    description: "Transparent contract guidance, player welfare briefings, and legal representation sessions ensuring client interests are protected.",
    location: "Victoria Island, Lagos",
    date: "2026 Season",
    isFeatured: true
  },
  {
    id: "gal-6",
    title: "International Travel & Sports Delegation Gateway",
    category: "Travel & Tours",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    description: "Seamless group flight coordination, visa facilitation, and airport logistics for traveling sports squads and delegates.",
    location: "Heathrow Airport, UK",
    date: "2026 Season",
    isFeatured: true
  }
];
var DEFAULT_SETTINGS = {
  companyName: "CHAMONVIN LIMITED",
  logoUrl: "https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg",
  heroTagline: "Your vision and Goal is our Priority",
  heroInterval: 15e3,
  heroSlides: [
    {
      id: "slide-1",
      image: "/src/assets/images/hero_football_pitch_stands_1792410704308.jpg",
      title: "Global Sports Management & Player Representation",
      subtitle: "Dedicated high-quality representation for ambitious football talents, on and off the pitch."
    },
    {
      id: "slide-2",
      image: "/src/assets/images/hero_field_goalposts_1792410719341.jpg",
      title: "Strategic Career Pathways & International Opportunities",
      subtitle: "Helping players and clubs navigate contracts, transfers, and high-performance development."
    },
    {
      id: "slide-3",
      image: "/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg",
      title: "International Travel, Tours & Visa Consultation",
      subtitle: "Flight booking consultation, family and group tour planning, and eligible visa guidance."
    }
  ],
  heroButtons: [
    { label: "Explore Our Sports Management", link: "/sports-management" },
    { label: "Explore Travel & Visa Services", link: "/travel-tours" },
    { label: "Become a Represented Player", link: "/player-representation" },
    { label: "Book a Consultation", link: "/contact" }
  ],
  contactEmail: "contact@chamonvin.com",
  contactPhone: "+44 20 7946 0192",
  contactWhatsapp: "+44 7700 900192",
  officeAddress: "Headquarters: 18 Grosvenor Place, London SW1X 7HN / West Africa Liaison: Victoria Island, Lagos",
  businessHours: "Monday \u2013 Friday: 08:30 \u2013 18:00 (GMT)",
  socials: {
    twitter: "https://twitter.com/chamonvinltd",
    instagram: "https://instagram.com/chamonvinltd",
    linkedin: "https://linkedin.com/company/chamonvin-limited",
    facebook: "https://facebook.com/chamonvinltd"
  },
  content: {
    aboutOverview: "At Chamonvin Limited, our clients' priorities come first, every time. Chamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation. We represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.",
    aboutMission: "Our mission is to empower footballers and international travelers through rigorous professional support, ethical career guidance, personalized attention, and transparent consultation that unlocks eligible global opportunities.",
    aboutVision: "To be recognized worldwide as a premier sports management and bespoke travel consultancy firm celebrated for integrity, client success, and sustainable career longevity.",
    aboutValues: "Client Priority, Absolute Integrity, International Excellence, Professional Confidentiality, and Long-Term Career Stewardship.",
    aboutPhilosophy: "We understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.",
    sportsManagementOverview: "Chamonvin Limited offers comprehensive football representation, talent management, contract guidance, and career planning across amateur, semi-professional, and professional tiers.",
    travelVisaOverview: "Our travel and visa division assists individuals, families, students, and professionals with travel itineraries, flight reservation support, and procedural consultation for eligible visa and residency pathways.",
    visaDisclaimer: "Notice & Disclaimer: All visa, work authorization, and immigration determinations are rendered solely by the relevant national government authorities and consulates. Requirements, processing times, and eligibility criteria are subject to change without notice. Chamonvin Limited provides procedural assessment, documentation guidance, and application consultation. Chamonvin Limited does not guarantee visa approval, employment offers, or permanent residence.",
    flightDisclaimer: "Notice: Chamonvin Limited provides travel itinerary consultation, flight schedule reviews, and reservation assistance. Final seat availability, baggage allowances, and airfares are determined by operating airlines at the time of ticket issuance.",
    privacyPolicy: "Chamonvin Limited treats all client inquiries, player profiles, and documentation with strict confidentiality. Personal data collected via this website is utilized strictly for consulting services and client communication in compliance with international data privacy standards.",
    termsConditions: "By using this website or engaging Chamonvin Limited services, you agree to our terms of service, consulting guidelines, and service disclaimers."
  }
};
function createInitialDatabase() {
  const adminSalt = generateSalt();
  const defaultAdmin = {
    id: "admin_1",
    email: "admin@chamonvin.com",
    name: "Chamonvin Administration",
    role: "super_admin",
    passwordHash: hashPassword("Chamonvin2026!", adminSalt),
    salt: adminSalt,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return {
    adminUsers: [defaultAdmin],
    sessions: [],
    settings: DEFAULT_SETTINGS,
    players: [],
    // empty as per prompt rule: no invented players, admin manages real players
    travelPackages: [
      {
        id: "pkg-1",
        title: "European Football Academy & Scouting Experience",
        destination: "Madrid & Lisbon, Europe",
        coverImage: "/src/assets/images/hero_football_pitch_stands_1792410704308.jpg",
        duration: "10 Days / 9 Nights",
        description: "Comprehensive sports tour package for clubs and player cohorts exploring European football infrastructure, friendly exhibition fixtures, and professional sports travel arrangements.",
        inclusions: [
          "Pre-arranged accommodation near training complexes",
          "Internal group logistics and ground transit",
          "Itinerary coordination for training facilities",
          "Group travel visa consultation assistance"
        ],
        exclusions: ["Personal spending", "Individual player insurance", "Unscheduled leisure tours"],
        price: "Inquire for Custom Itinerary",
        currency: "GBP",
        travelDates: "Spring & Summer Sessions Available",
        status: "published",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "pkg-2",
        title: "International Business & Sports Conference Gateway",
        destination: "London, United Kingdom",
        coverImage: "/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg",
        duration: "5 Days / 4 Nights",
        description: "Tailored corporate travel itinerary for sports managers, club executives, and business professionals attending international sports summits and executive meetings.",
        inclusions: [
          "Premium central hotel reservation assistance",
          "Airport transfer coordination",
          "Business visitor visa procedural guidance",
          "Dedicated travel consultant support"
        ],
        exclusions: ["Conference registration tickets", "Personal meals", "Incidental hotel charges"],
        price: "Tailored per delegation",
        currency: "GBP",
        travelDates: "Year-Round Booking",
        status: "published",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    newsArticles: [
      {
        id: "news-1",
        title: "Chamonvin Limited Expands International Scouting & Player Pathways",
        slug: "chamonvin-expands-international-scouting",
        coverImage: "/src/assets/images/hero_field_goalposts_1792410719341.jpg",
        category: "Football Management",
        publicationDate: "2026-10-15",
        author: "Management Directorate",
        content: `Chamonvin Limited is pleased to announce the broadening of our player representation network across key football territories.

With an uncompromising focus on player-first career planning, our sports management team works closely with amateur, semi-professional, and professional footballers. From comprehensive athletic profiling to contract advisory and relocation logistics, we ensure that every client's journey is supported with the highest standard of professionalism.

Prospective players and registered clubs are invited to connect directly with our sports division to explore representation and management opportunities.`,
        status: "published",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "news-2",
        title: "Navigating International Visa Protocols for Athletes and Business Travelers",
        slug: "navigating-international-visa-protocols",
        coverImage: "/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg",
        category: "Travel & Visa Updates",
        publicationDate: "2026-10-08",
        author: "Visa Consultation Unit",
        content: `Global mobility remains a cornerstone for athletes participating in trials, students pursuing overseas academic programs, and families coordinating international travel.

Our dedicated travel and visa consulting unit provides structured guidance across visitor visas, study permits, business immigration pathways, and skilled employment categories. We place paramount importance on procedural accuracy, complete documentation, and transparent realistic guidance.

For consultations regarding your intended destination, reach out through our dedicated Visa Consultation portal.`,
        status: "published",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    inquiries: [],
    auditLogs: [
      {
        id: "log-1",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        action: "SYSTEM_INIT",
        user: "system",
        details: "Initial database bootstrapped with official company parameters and secure admin role."
      }
    ],
    ownerProfile: DEFAULT_OWNER_PROFILE,
    galleryItems: DEFAULT_GALLERY_ITEMS
  };
}
var Database = class {
  constructor() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.schema = JSON.parse(raw);
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
        console.error("Failed reading database file, recreating:", err);
        this.schema = createInitialDatabase();
        this.persist();
      }
    } else {
      this.schema = createInitialDatabase();
      this.persist();
    }
  }
  persist() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.schema, null, 2), "utf-8");
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error("Error writing database to disk:", err);
    }
  }
  // --- Auth & Admin Operations ---
  getAdminByEmail(email) {
    return this.schema.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  verifyPassword(password, user) {
    const hashed = hashPassword(password, user.salt);
    return hashed === user.passwordHash;
  }
  createSession(userId, email) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1e3;
    const session = { token, userId, email, expiresAt };
    this.schema.sessions.push(session);
    this.schema.sessions = this.schema.sessions.filter((s) => s.expiresAt > Date.now());
    this.persist();
    return session;
  }
  getSession(token) {
    const s = this.schema.sessions.find((session) => session.token === token);
    if (!s) return void 0;
    if (s.expiresAt < Date.now()) {
      this.deleteSession(token);
      return void 0;
    }
    return s;
  }
  deleteSession(token) {
    this.schema.sessions = this.schema.sessions.filter((s) => s.token !== token);
    this.persist();
  }
  updateAdminPassword(userId, newPassword) {
    const user = this.schema.adminUsers.find((u) => u.id === userId);
    if (!user) return false;
    const salt = generateSalt();
    user.salt = salt;
    user.passwordHash = hashPassword(newPassword, salt);
    this.schema.sessions = this.schema.sessions.filter((s) => s.userId !== userId);
    this.logAction("PASSWORD_UPDATE", user.email, "Admin changed account password");
    this.persist();
    return true;
  }
  // --- Settings ---
  getSettings() {
    return this.schema.settings;
  }
  updateSettings(newSettings, userEmail) {
    this.schema.settings = {
      ...this.schema.settings,
      ...newSettings,
      content: {
        ...this.schema.settings.content,
        ...newSettings.content || {}
      },
      socials: {
        ...this.schema.settings.socials,
        ...newSettings.socials || {}
      }
    };
    this.logAction("SETTINGS_UPDATE", userEmail, "Updated company settings and appearance");
    this.persist();
    return this.schema.settings;
  }
  // --- Players ---
  getPlayers(publishedOnly = false) {
    if (publishedOnly) {
      return this.schema.players.filter((p) => p.status === "published");
    }
    return this.schema.players;
  }
  getPlayerById(id, publishedOnly = false) {
    const p = this.schema.players.find((item) => item.id === id);
    if (!p) return void 0;
    if (publishedOnly && p.status !== "published") return void 0;
    return p;
  }
  createPlayer(playerData, userEmail) {
    const newPlayer = {
      ...playerData,
      id: `player_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.schema.players.unshift(newPlayer);
    this.logAction("CREATE_PLAYER", userEmail, `Added player profile: ${newPlayer.fullName}`);
    this.persist();
    return newPlayer;
  }
  updatePlayer(id, updates, userEmail) {
    const idx = this.schema.players.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.schema.players[idx] = {
      ...this.schema.players[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.logAction("UPDATE_PLAYER", userEmail, `Updated player profile: ${this.schema.players[idx].fullName}`);
    this.persist();
    return this.schema.players[idx];
  }
  deletePlayer(id, userEmail) {
    const player = this.schema.players.find((p) => p.id === id);
    if (!player) return false;
    this.schema.players = this.schema.players.filter((p) => p.id !== id);
    this.logAction("DELETE_PLAYER", userEmail, `Deleted player profile: ${player.fullName}`);
    this.persist();
    return true;
  }
  // --- Travel Packages ---
  getPackages(publishedOnly = false) {
    if (publishedOnly) {
      return this.schema.travelPackages.filter((p) => p.status === "published");
    }
    return this.schema.travelPackages;
  }
  getPackageById(id, publishedOnly = false) {
    const p = this.schema.travelPackages.find((item) => item.id === id);
    if (!p) return void 0;
    if (publishedOnly && p.status !== "published") return void 0;
    return p;
  }
  createPackage(pkgData, userEmail) {
    const newPkg = {
      ...pkgData,
      id: `pkg_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.schema.travelPackages.unshift(newPkg);
    this.logAction("CREATE_PACKAGE", userEmail, `Created travel package: ${newPkg.title}`);
    this.persist();
    return newPkg;
  }
  updatePackage(id, updates, userEmail) {
    const idx = this.schema.travelPackages.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.schema.travelPackages[idx] = {
      ...this.schema.travelPackages[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.logAction("UPDATE_PACKAGE", userEmail, `Updated travel package: ${this.schema.travelPackages[idx].title}`);
    this.persist();
    return this.schema.travelPackages[idx];
  }
  deletePackage(id, userEmail) {
    const pkg = this.schema.travelPackages.find((p) => p.id === id);
    if (!pkg) return false;
    this.schema.travelPackages = this.schema.travelPackages.filter((p) => p.id !== id);
    this.logAction("DELETE_PACKAGE", userEmail, `Deleted package: ${pkg.title}`);
    this.persist();
    return true;
  }
  // --- News Articles ---
  getNews(publishedOnly = false) {
    if (publishedOnly) {
      return this.schema.newsArticles.filter((n) => n.status === "published");
    }
    return this.schema.newsArticles;
  }
  getNewsById(idOrSlug, publishedOnly = false) {
    const item = this.schema.newsArticles.find((n) => n.id === idOrSlug || n.slug === idOrSlug);
    if (!item) return void 0;
    if (publishedOnly && item.status !== "published") return void 0;
    return item;
  }
  createNews(newsData, userEmail) {
    const newArticle = {
      ...newsData,
      id: `news_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.schema.newsArticles.unshift(newArticle);
    this.logAction("CREATE_NEWS", userEmail, `Created news article: ${newArticle.title}`);
    this.persist();
    return newArticle;
  }
  updateNews(id, updates, userEmail) {
    const idx = this.schema.newsArticles.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    this.schema.newsArticles[idx] = {
      ...this.schema.newsArticles[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.logAction("UPDATE_NEWS", userEmail, `Updated news article: ${this.schema.newsArticles[idx].title}`);
    this.persist();
    return this.schema.newsArticles[idx];
  }
  deleteNews(id, userEmail) {
    const article = this.schema.newsArticles.find((n) => n.id === id);
    if (!article) return false;
    this.schema.newsArticles = this.schema.newsArticles.filter((n) => n.id !== id);
    this.logAction("DELETE_NEWS", userEmail, `Deleted news article: ${article.title}`);
    this.persist();
    return true;
  }
  // --- Inquiries ---
  createInquiry(data) {
    const prefixMap = {
      player_representation: "REP",
      sports_management: "SPT",
      general_contact: "GEN",
      travel_tours: "TRV",
      visa_consultation: "VIS",
      flight_services: "FLT"
    };
    const prefix = prefixMap[data.type] || "INQ";
    const randomDigits = Math.floor(1e4 + Math.random() * 9e4);
    const refNumber = `CHM-${prefix}-${randomDigits}`;
    const newInquiry = {
      id: `inq_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      refNumber,
      type: data.type,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      countryOfResidence: data.countryOfResidence,
      status: "new",
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      internalNotes: [],
      details: data.details
    };
    this.schema.inquiries.unshift(newInquiry);
    this.logAction("NEW_INQUIRY", "public_portal", `Inquiry received (${refNumber}) from ${data.clientName}`);
    this.persist();
    return newInquiry;
  }
  getInquiries(filterType, status) {
    let result = [...this.schema.inquiries];
    if (filterType && filterType !== "all") {
      result = result.filter((i) => i.type === filterType);
    }
    if (status && status !== "all") {
      result = result.filter((i) => i.status === status);
    }
    return result;
  }
  getInquiryById(id) {
    return this.schema.inquiries.find((i) => i.id === id);
  }
  updateInquiry(id, updates, userEmail) {
    const inq = this.schema.inquiries.find((i) => i.id === id);
    if (!inq) return null;
    if (updates.status) inq.status = updates.status;
    if (updates.read !== void 0) inq.read = updates.read;
    if (updates.followUpDate !== void 0) inq.followUpDate = updates.followUpDate;
    if (updates.newNote && updates.newNote.text.trim()) {
      inq.internalNotes.push({
        id: `note_${Date.now()}`,
        text: updates.newNote.text.trim(),
        author: updates.newNote.author || userEmail,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    inq.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.logAction("UPDATE_INQUIRY", userEmail, `Updated inquiry ${inq.refNumber} status/notes`);
    this.persist();
    return inq;
  }
  deleteInquiry(id, userEmail) {
    const inq = this.schema.inquiries.find((i) => i.id === id);
    if (!inq) return false;
    this.schema.inquiries = this.schema.inquiries.filter((i) => i.id !== id);
    this.logAction("DELETE_INQUIRY", userEmail, `Deleted inquiry ${inq.refNumber}`);
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
      publishedPlayers: players.filter((p) => p.status === "published").length,
      draftPlayers: players.filter((p) => p.status === "draft").length,
      newPlayerInquiries: inquiries.filter((i) => i.type === "player_representation" && i.status === "new").length,
      unreadInquiries: inquiries.filter((i) => !i.read).length,
      travelVisaInquiries: inquiries.filter((i) => (i.type === "travel_tours" || i.type === "visa_consultation") && i.status === "new").length,
      flightInquiries: inquiries.filter((i) => i.type === "flight_services" && i.status === "new").length,
      publishedNews: articles.filter((a) => a.status === "published").length,
      activePackages: packages.filter((p) => p.status === "published").length,
      totalInquiries: inquiries.length
    };
  }
  logAction(action, user, details) {
    const entry = {
      id: `log_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      action,
      user,
      details
    };
    this.schema.auditLogs.unshift(entry);
    if (this.schema.auditLogs.length > 200) {
      this.schema.auditLogs = this.schema.auditLogs.slice(0, 200);
    }
  }
  // --- Owner Profile ---
  getOwnerProfile() {
    if (!this.schema.ownerProfile) {
      this.schema.ownerProfile = DEFAULT_OWNER_PROFILE;
      this.persist();
    }
    return this.schema.ownerProfile;
  }
  updateOwnerProfile(updates, userEmail) {
    this.schema.ownerProfile = {
      ...this.schema.ownerProfile || DEFAULT_OWNER_PROFILE,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.logAction("UPDATE_OWNER_PROFILE", userEmail, "Updated owner & executive profile");
    this.persist();
    return this.schema.ownerProfile;
  }
  // --- Gallery Items ---
  getGalleryItems() {
    if (!this.schema.galleryItems || this.schema.galleryItems.length === 0) {
      this.schema.galleryItems = DEFAULT_GALLERY_ITEMS;
      this.persist();
    }
    return this.schema.galleryItems;
  }
  createGalleryItem(data, userEmail) {
    const item = {
      ...data,
      id: `gal_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`
    };
    if (!this.schema.galleryItems) this.schema.galleryItems = [];
    this.schema.galleryItems.unshift(item);
    this.logAction("CREATE_GALLERY_ITEM", userEmail, `Added gallery photo: ${item.title}`);
    this.persist();
    return item;
  }
  updateGalleryItem(id, updates, userEmail) {
    if (!this.schema.galleryItems) return null;
    const idx = this.schema.galleryItems.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.schema.galleryItems[idx] = {
      ...this.schema.galleryItems[idx],
      ...updates
    };
    this.logAction("UPDATE_GALLERY_ITEM", userEmail, `Updated gallery photo: ${this.schema.galleryItems[idx].title}`);
    this.persist();
    return this.schema.galleryItems[idx];
  }
  deleteGalleryItem(id, userEmail) {
    if (!this.schema.galleryItems) return false;
    const item = this.schema.galleryItems.find((g) => g.id === id);
    if (!item) return false;
    this.schema.galleryItems = this.schema.galleryItems.filter((g) => g.id !== id);
    this.logAction("DELETE_GALLERY_ITEM", userEmail, `Deleted gallery photo: ${item.title}`);
    this.persist();
    return true;
  }
  setGalleryItems(items) {
    this.schema.galleryItems = items;
    this.persist();
  }
  // --- Supabase Player Synchronizer ---
  setPlayers(players) {
    this.schema.players = players;
    this.persist();
  }
  upsertPlayer(player) {
    const idx = this.schema.players.findIndex((p) => p.id === player.id);
    if (idx >= 0) {
      this.schema.players[idx] = player;
    } else {
      this.schema.players.unshift(player);
    }
    this.persist();
  }
  getAuditLogs() {
    return this.schema.auditLogs;
  }
};
var db = new Database();

// server.ts
dotenv.config();
function getBackendSupabaseClient() {
  const settings = db.getSettings();
  const url = settings?.supabase?.projectUrl || process.env.VITE_SUPABASE_URL || "";
  const key = settings?.supabase?.serviceRoleKey || settings?.supabase?.anonKey || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  try {
    return createClient(url.trim().replace(/\/$/, ""), key.trim());
  } catch (err) {
    console.warn("Backend Supabase initialization failed:", err);
    return null;
  }
}
async function syncPlayerToSupabase(player, action) {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === "delete") {
      await sb.from("players").delete().eq("id", player.id);
    } else {
      await sb.from("players").upsert({
        id: player.id,
        full_name: player.fullName,
        primary_position: player.primaryPosition,
        nationality: player.nationality,
        date_of_birth: player.dateOfBirth || null,
        age: player.age || null,
        current_club: player.currentClub || null,
        preferred_foot: player.preferredFoot || "Right",
        playing_level: player.playingLevel || "Amateur",
        status: player.status || "published",
        is_featured: Boolean(player.isFeatured),
        photo_url: player.photoUrl || null,
        bio: player.bio || null,
        career_details: player.careerDetails || [],
        video_url: player.videoUrl || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "id" });
    }
  } catch (err) {
    console.warn("Supabase player sync warning:", err);
  }
}
async function syncPackageToSupabase(pkg, action) {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === "delete") {
      await sb.from("travel_packages").delete().eq("id", pkg.id);
    } else {
      await sb.from("travel_packages").upsert({
        id: pkg.id,
        title: pkg.title,
        destination: pkg.destination,
        cover_image: pkg.coverImage,
        duration: pkg.duration,
        description: pkg.description || null,
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        price: pkg.price || null,
        currency: pkg.currency || "GBP",
        travel_dates: pkg.travelDates || null,
        status: pkg.status || "published",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "id" });
    }
  } catch (err) {
    console.warn("Supabase package sync warning:", err);
  }
}
async function syncNewsToSupabase(article, action) {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === "delete") {
      await sb.from("news_articles").delete().eq("id", article.id);
    } else {
      await sb.from("news_articles").upsert({
        id: article.id,
        title: article.title,
        slug: article.slug,
        cover_image: article.coverImage,
        category: article.category,
        publication_date: article.publicationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        author: article.author || "Chamonvin Media",
        content: article.content,
        status: article.status || "published",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "id" });
    }
  } catch (err) {
    console.warn("Supabase news sync warning:", err);
  }
}
async function syncOwnerProfileToSupabase(profile) {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    await sb.from("owner_profile").upsert({
      id: profile.id || "owner_main",
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
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "id" });
  } catch (err) {
    console.warn("Supabase owner profile sync warning:", err);
  }
}
async function syncGalleryItemToSupabase(item, action) {
  const sb = getBackendSupabaseClient();
  if (!sb) return;
  try {
    if (action === "delete") {
      await sb.from("gallery_items").delete().eq("id", item.id);
    } else {
      await sb.from("gallery_items").upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        image_url: item.imageUrl,
        description: item.description,
        location: item.location || null,
        date: item.date || null,
        is_featured: Boolean(item.isFeatured),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "id" });
    }
  } catch (err) {
    console.warn("Supabase gallery item sync warning:", err);
  }
}
async function pullPlayersFromSupabase() {
  const sb = getBackendSupabaseClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("players").select("*");
    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        primaryPosition: row.primary_position,
        nationality: row.nationality,
        dateOfBirth: row.date_of_birth || void 0,
        age: row.age || void 0,
        currentClub: row.current_club || void 0,
        preferredFoot: row.preferred_foot || "Right",
        playingLevel: row.playing_level || "Professional",
        status: row.status || "published",
        isFeatured: Boolean(row.is_featured),
        photoUrl: row.photo_url || "",
        bio: row.bio || "",
        careerDetails: row.career_details || [],
        videoUrl: row.video_url || void 0,
        createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: row.updated_at || (/* @__PURE__ */ new Date()).toISOString()
      }));
      db.setPlayers(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Supabase auto-pull error:", err);
  }
  return null;
}
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var isProduction = process.env.NODE_ENV === "production";
var UPLOADS_DIR = path2.resolve(process.cwd(), "public", "uploads");
if (!fs2.existsSync(UPLOADS_DIR)) {
  fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path2.extname(file.originalname).toLowerCase();
    const cleanName = path2.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg\+xml|svg/;
    const ext = path2.extname(file.originalname).toLowerCase().replace(".", "");
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only valid image files (JPG, PNG, WebP, SVG) are permitted."));
    }
  }
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));
var loginAttempts = {};
function checkRateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = loginAttempts[ip];
  if (record && record.resetAt > now) {
    if (record.count >= 6) {
      return res.status(429).json({ error: "Too many login attempts. Please wait 15 minutes before trying again." });
    }
    record.count++;
  } else {
    loginAttempts[ip] = { count: 1, resetAt: now + 15 * 60 * 1e3 };
  }
  next();
}
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];
  const session = db.getSession(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired session. Please sign in again." });
  }
  req.user = session;
  next();
}
app.post("/api/auth/login", checkRateLimit, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = db.getAdminByEmail(email.trim());
  if (!user || !db.verifyPassword(password, user)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  const session = db.createSession(user.id, user.email);
  db.logAction("LOGIN_SUCCESS", user.email, `Successful login from ${req.ip || "remote"}`);
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
app.get("/api/auth/me", requireAdmin, (req, res) => {
  const session = req.user;
  const user = db.getAdminByEmail(session.email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
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
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    db.deleteSession(token);
  }
  return res.json({ success: true });
});
app.post("/api/auth/change-password", requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const session = req.user;
  const user = db.getAdminByEmail(session.email);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!db.verifyPassword(currentPassword, user)) {
    return res.status(400).json({ error: "Current password is incorrect." });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters long." });
  }
  db.updateAdminPassword(user.id, newPassword);
  return res.json({ success: true, message: "Password updated successfully. Please sign in again." });
});
app.get("/api/settings", (_req, res) => {
  const settings = db.getSettings();
  return res.json(settings);
});
app.put("/api/settings", requireAdmin, (req, res) => {
  const session = req.user;
  const updated = db.updateSettings(req.body, session.email);
  return res.json(updated);
});
app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});
app.get("/api/players", async (req, res) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (db.getSession(token)) isAdmin = true;
  }
  await pullPlayersFromSupabase();
  const players = db.getPlayers(!isAdmin);
  return res.json(players);
});
app.get("/api/players/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (db.getSession(token)) isAdmin = true;
  }
  let player = db.getPlayerById(req.params.id, !isAdmin);
  if (!player) {
    await pullPlayersFromSupabase();
    player = db.getPlayerById(req.params.id, !isAdmin);
  }
  if (!player) {
    return res.status(404).json({ error: "Player profile not found." });
  }
  return res.json(player);
});
app.post("/api/players", requireAdmin, async (req, res) => {
  const session = req.user;
  const { fullName, primaryPosition, playingLevel } = req.body;
  if (!fullName || !primaryPosition || !playingLevel) {
    return res.status(400).json({ error: "Full name, position, and playing level are required." });
  }
  const newPlayer = db.createPlayer(req.body, session.email);
  syncPlayerToSupabase(newPlayer, "upsert");
  return res.status(201).json(newPlayer);
});
app.put("/api/players/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const updated = db.updatePlayer(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: "Player not found." });
  syncPlayerToSupabase(updated, "upsert");
  return res.json(updated);
});
app.delete("/api/players/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const success = db.deletePlayer(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: "Player not found." });
  syncPlayerToSupabase({ id: req.params.id }, "delete");
  return res.json({ success: true });
});
app.get("/api/packages", (req, res) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (db.getSession(token)) isAdmin = true;
  }
  const packages = db.getPackages(!isAdmin);
  return res.json(packages);
});
app.post("/api/packages", requireAdmin, async (req, res) => {
  const session = req.user;
  const { title, destination } = req.body;
  if (!title || !destination) {
    return res.status(400).json({ error: "Title and destination are required." });
  }
  const pkg = db.createPackage(req.body, session.email);
  syncPackageToSupabase(pkg, "upsert");
  return res.status(201).json(pkg);
});
app.put("/api/packages/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const updated = db.updatePackage(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: "Package not found" });
  syncPackageToSupabase(updated, "upsert");
  return res.json(updated);
});
app.delete("/api/packages/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const success = db.deletePackage(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: "Package not found" });
  syncPackageToSupabase({ id: req.params.id }, "delete");
  return res.json({ success: true });
});
app.get("/api/news", (req, res) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (db.getSession(token)) isAdmin = true;
  }
  const articles = db.getNews(!isAdmin);
  return res.json(articles);
});
app.get("/api/news/:idOrSlug", (req, res) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (db.getSession(token)) isAdmin = true;
  }
  const article = db.getNewsById(req.params.idOrSlug, !isAdmin);
  if (!article) return res.status(404).json({ error: "Article not found" });
  return res.json(article);
});
app.post("/api/news", requireAdmin, async (req, res) => {
  const session = req.user;
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: "Title, category, and content are required." });
  }
  const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const article = db.createNews({ ...req.body, slug }, session.email);
  syncNewsToSupabase(article, "upsert");
  return res.status(201).json(article);
});
app.put("/api/news/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const updated = db.updateNews(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: "Article not found" });
  syncNewsToSupabase(updated, "upsert");
  return res.json(updated);
});
app.delete("/api/news/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const success = db.deleteNews(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: "Article not found" });
  syncNewsToSupabase({ id: req.params.id }, "delete");
  return res.json({ success: true });
});
app.post("/api/inquiries", (req, res) => {
  if (req.body.company_fax) {
    return res.status(400).json({ error: "Spam submission detected" });
  }
  const { type, clientName, clientEmail, clientPhone, countryOfResidence, details } = req.body;
  if (!type || !clientName || !clientEmail || !clientPhone) {
    return res.status(400).json({ error: "Please provide your name, valid email, and contact telephone/WhatsApp." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientEmail)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  const inquiry = db.createInquiry({
    type,
    clientName: clientName.trim(),
    clientEmail: clientEmail.trim(),
    clientPhone: clientPhone.trim(),
    countryOfResidence: countryOfResidence?.trim() || "",
    details: details || {}
  });
  return res.status(201).json({
    success: true,
    refNumber: inquiry.refNumber,
    message: "Your inquiry has been received. Our team will review your submission and contact you directly."
  });
});
app.get("/api/inquiries", requireAdmin, (req, res) => {
  const { type, status } = req.query;
  const inquiries = db.getInquiries(type, status);
  return res.json(inquiries);
});
app.get("/api/inquiries/:id", requireAdmin, (req, res) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
  return res.json(inquiry);
});
app.patch("/api/inquiries/:id", requireAdmin, (req, res) => {
  const session = req.user;
  const updated = db.updateInquiry(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: "Inquiry not found" });
  return res.json(updated);
});
app.delete("/api/inquiries/:id", requireAdmin, (req, res) => {
  const session = req.user;
  const success = db.deleteInquiry(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: "Inquiry not found" });
  return res.json({ success: true });
});
app.get("/api/admin/stats", requireAdmin, (_req, res) => {
  const stats = db.getStats();
  return res.json(stats);
});
app.get("/api/admin/logs", requireAdmin, (_req, res) => {
  const logs = db.getAuditLogs();
  return res.json(logs);
});
app.post("/api/admin/supabase/sync", requireAdmin, async (req, res) => {
  const session = req.user;
  const sb = getBackendSupabaseClient();
  if (!sb) {
    return res.status(400).json({
      error: "Supabase credentials missing. Please enter your Project URL and Anon/Public Key in Settings -> Supabase tab first."
    });
  }
  try {
    const settings = db.getSettings();
    const players = db.getPlayers(false);
    const packages = db.getPackages(false);
    const news = db.getNews(false);
    const inquiries = db.getInquiries();
    const { error: settingsErr } = await sb.from("company_settings").upsert({
      id: "settings_main",
      company_name: settings.companyName,
      logo_url: settings.logoUrl,
      hero_tagline: settings.heroTagline,
      hero_interval: settings.heroInterval || 5e3,
      hero_slides: settings.heroSlides || [],
      hero_buttons: settings.heroButtons || [],
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      contact_whatsapp: settings.contactWhatsapp || null,
      office_address: settings.officeAddress || null,
      business_hours: settings.businessHours || null,
      socials: settings.socials || {},
      content: settings.content || {},
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "id" });
    if (settingsErr) {
      if (settingsErr.code === "42P01") {
        return res.status(400).json({
          error: "The tables do not exist in Supabase yet. Please run the SQL script from /supabase/schema.sql in your Supabase SQL Editor."
        });
      }
      return res.status(400).json({
        error: `Supabase settings error: ${settingsErr.message}`
      });
    }
    const mappedPlayers = players.map((p) => ({
      id: p.id,
      full_name: p.fullName,
      primary_position: p.primaryPosition,
      nationality: p.nationality,
      date_of_birth: p.dateOfBirth || null,
      age: p.age || null,
      current_club: p.currentClub || null,
      preferred_foot: p.preferredFoot || "Right",
      playing_level: p.playingLevel || "Amateur",
      status: p.status || "published",
      is_featured: Boolean(p.isFeatured),
      photo_url: p.photoUrl || null,
      bio: p.bio || null,
      career_details: p.careerDetails || [],
      video_url: p.videoUrl || null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    if (mappedPlayers.length > 0) {
      const { error: playerErr } = await sb.from("players").upsert(mappedPlayers, { onConflict: "id" });
      if (playerErr) throw new Error(`Players sync failed: ${playerErr.message}`);
    }
    const mappedPackages = packages.map((pkg) => ({
      id: pkg.id,
      title: pkg.title,
      destination: pkg.destination,
      cover_image: pkg.coverImage,
      duration: pkg.duration,
      description: pkg.description || null,
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      price: pkg.price || null,
      currency: pkg.currency || "GBP",
      travel_dates: pkg.travelDates || null,
      status: pkg.status || "published",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    if (mappedPackages.length > 0) {
      const { error: pkgErr } = await sb.from("travel_packages").upsert(mappedPackages, { onConflict: "id" });
      if (pkgErr) throw new Error(`Travel packages sync failed: ${pkgErr.message}`);
    }
    const mappedNews = news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      cover_image: n.coverImage,
      category: n.category,
      publication_date: n.publicationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      author: n.author || "Chamonvin Media",
      content: n.content,
      status: n.status || "published",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    if (mappedNews.length > 0) {
      const { error: newsErr } = await sb.from("news_articles").upsert(mappedNews, { onConflict: "id" });
      if (newsErr) throw new Error(`News sync failed: ${newsErr.message}`);
    }
    const mappedInquiries = inquiries.map((inq) => ({
      id: inq.id,
      ref_number: inq.refNumber,
      type: inq.type,
      client_name: inq.clientName,
      client_email: inq.clientEmail,
      client_phone: inq.clientPhone,
      country_of_residence: inq.countryOfResidence || null,
      details: inq.details || {},
      status: inq.status || "new",
      read: Boolean(inq.read),
      follow_up_date: inq.followUpDate || null,
      created_at: inq.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: inq.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
    }));
    if (mappedInquiries.length > 0) {
      const { error: inqErr } = await sb.from("inquiries").upsert(mappedInquiries, { onConflict: "id" });
      if (inqErr) throw new Error(`Inquiries sync failed: ${inqErr.message}`);
    }
    const ownerProfile = db.getOwnerProfile();
    await sb.from("owner_profile").upsert({
      id: ownerProfile.id || "owner_main",
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
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "id" });
    const galleryItems = db.getGalleryItems();
    if (galleryItems.length > 0) {
      const mappedGallery = galleryItems.map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        image_url: g.imageUrl,
        description: g.description,
        location: g.location || null,
        date: g.date || null,
        is_featured: Boolean(g.isFeatured),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }));
      await sb.from("gallery_items").upsert(mappedGallery, { onConflict: "id" });
    }
    db.logAction("SUPABASE_SYNC", session.email, `Synced ${mappedPlayers.length} players, ${mappedPackages.length} packages, owner profile & gallery to Supabase`);
    return res.json({
      success: true,
      message: "All website records, owner profile, and gallery successfully synced to Supabase!",
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
  } catch (err) {
    console.error("Supabase sync route error:", err);
    return res.status(500).json({ error: err.message || "Supabase synchronization failed." });
  }
});
app.post("/api/admin/supabase/pull", requireAdmin, async (req, res) => {
  const session = req.user;
  const sb = getBackendSupabaseClient();
  if (!sb) {
    return res.status(400).json({ error: "Supabase credentials missing or invalid." });
  }
  try {
    const [pRes, pkgRes, newsRes, inqRes, ownerRes, galRes] = await Promise.all([
      sb.from("players").select("*"),
      sb.from("travel_packages").select("*"),
      sb.from("news_articles").select("*"),
      sb.from("inquiries").select("*"),
      sb.from("owner_profile").select("*").limit(1).maybeSingle(),
      sb.from("gallery_items").select("*")
    ]);
    let pulledPlayers = 0;
    if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
      const mapped = pRes.data.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        primaryPosition: row.primary_position,
        nationality: row.nationality,
        dateOfBirth: row.date_of_birth || void 0,
        age: row.age || void 0,
        currentClub: row.current_club || void 0,
        preferredFoot: row.preferred_foot || "Right",
        playingLevel: row.playing_level || "Professional",
        status: row.status || "published",
        isFeatured: Boolean(row.is_featured),
        photoUrl: row.photo_url || "",
        bio: row.bio || "",
        careerDetails: row.career_details || [],
        videoUrl: row.video_url || void 0,
        createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: row.updated_at || (/* @__PURE__ */ new Date()).toISOString()
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
      }, "supabase_pull");
    }
    if (galRes.data && Array.isArray(galRes.data) && galRes.data.length > 0) {
      const mappedGal = galRes.data.map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        imageUrl: row.image_url,
        description: row.description,
        location: row.location || void 0,
        date: row.date || void 0,
        isFeatured: Boolean(row.is_featured)
      }));
      db.setGalleryItems(mappedGal);
    }
    db.logAction("SUPABASE_PULL", session.email, `Pulled ${pulledPlayers} players and records from Supabase`);
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
  } catch (err) {
    console.error("Supabase pull error:", err);
    return res.status(500).json({ error: err.message || "Failed to pull from Supabase" });
  }
});
app.get("/api/owner-profile", (_req, res) => {
  const profile = db.getOwnerProfile();
  return res.json(profile);
});
app.put("/api/owner-profile", requireAdmin, async (req, res) => {
  const session = req.user;
  const updated = db.updateOwnerProfile(req.body, session.email);
  syncOwnerProfileToSupabase(updated);
  return res.json(updated);
});
app.get("/api/gallery", (_req, res) => {
  const items = db.getGalleryItems();
  return res.json(items);
});
app.post("/api/gallery", requireAdmin, async (req, res) => {
  const session = req.user;
  const { title, category, imageUrl, description } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: "Title and image URL are required." });
  }
  const item = db.createGalleryItem(req.body, session.email);
  syncGalleryItemToSupabase(item, "upsert");
  return res.status(201).json(item);
});
app.put("/api/gallery/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const updated = db.updateGalleryItem(req.params.id, req.body, session.email);
  if (!updated) return res.status(404).json({ error: "Gallery item not found" });
  syncGalleryItemToSupabase(updated, "upsert");
  return res.json(updated);
});
app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
  const session = req.user;
  const success = db.deleteGalleryItem(req.params.id, session.email);
  if (!success) return res.status(404).json({ error: "Gallery item not found" });
  syncGalleryItemToSupabase({ id: req.params.id }, "delete");
  return res.json({ success: true });
});
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
