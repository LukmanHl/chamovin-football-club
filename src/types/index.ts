export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface HeroButton {
  label: string;
  link: string;
}

export interface CompanySettings {
  companyName: string;
  logoUrl: string; // URL or uploaded path
  heroTagline: string;
  heroInterval: number; // in milliseconds (default 15000)
  heroSlides: HeroSlide[];
  heroButtons: HeroButton[];
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  officeAddress: string;
  businessHours: string;
  socials: {
    twitter: string;
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  content: {
    aboutOverview: string;
    aboutMission: string;
    aboutVision: string;
    aboutValues: string;
    aboutPhilosophy: string;
    sportsManagementOverview: string;
    travelVisaOverview: string;
    visaDisclaimer: string;
    flightDisclaimer: string;
    privacyPolicy: string;
    termsConditions: string;
  };
  supabase?: {
    projectUrl: string;
    anonKey: string;
    serviceRoleKey?: string;
    dbUri?: string;
    connected?: boolean;
    lastTestedAt?: string;
  };
}

export type PlayerPosition =
  | 'Goalkeeper'
  | 'Center Back'
  | 'Right Back'
  | 'Left Back'
  | 'Defensive Midfielder'
  | 'Central Midfielder'
  | 'Attacking Midfielder'
  | 'Winger'
  | 'Forward'
  | 'Striker';

export type PlayingLevel = 'Academy' | 'Amateur' | 'Semi-Professional' | 'Professional';

export interface Player {
  id: string;
  fullName: string;
  primaryPosition: PlayerPosition;
  nationality: string;
  yearOfBirth?: number | string;
  dateOfBirth?: string;
  age?: number;
  currentClub?: string;
  preferredFoot?: 'Left' | 'Right' | 'Both';
  playingLevel: PlayingLevel;
  status: 'published' | 'draft';
  isFeatured: boolean;
  photoUrl: string;
  bio?: string;
  careerDetails: string[];
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  coverImage: string;
  duration: string;
  description: string;
  inclusions: string[];
  exclusions: string[];
  price?: string;
  currency?: string;
  travelDates?: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type NewsCategory =
  | 'Football Management'
  | 'Player Announcements'
  | 'Sports Opportunities'
  | 'Travel & Visa Updates'
  | 'Company News';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: NewsCategory;
  publicationDate: string;
  author: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type InquiryType =
  | 'player_representation'
  | 'sports_management'
  | 'general_contact'
  | 'travel_tours'
  | 'visa_consultation'
  | 'flight_services';

export type InquiryStatus = 'new' | 'in_progress' | 'awaiting_client' | 'completed' | 'closed';

export interface InternalNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface Inquiry {
  id: string;
  refNumber: string;
  type: InquiryType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  countryOfResidence?: string;
  status: InquiryStatus;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  followUpDate?: string | null;
  internalNotes: InternalNote[];
  details: Record<string, any>;
}

export interface OwnerProfile {
  id: string;
  fullName: string;
  roleTitle: string;
  secondaryTitle?: string;
  photoUrl: string;
  bio: string;
  quote?: string;
  credentials: string[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  isPublished: boolean;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Scouting & Matches' | 'Training & Performance' | 'Travel & Tours' | 'Management & Events';
  imageUrl: string;
  description?: string;
  location?: string;
  date?: string;
  isFeatured?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface DatabaseSchema {
  adminUsers: AdminUser[];
  sessions: Session[];
  settings: CompanySettings;
  ownerProfile: OwnerProfile;
  galleryItems: GalleryItem[];
  players: Player[];
  travelPackages: TravelPackage[];
  newsArticles: NewsArticle[];
  inquiries: Inquiry[];
  auditLogs: AuditLog[];
}
