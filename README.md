# CHAMONVIN LIMITED — International Sports Management & Travel Consulting Website

A complete, production-grade, multi-page business website and secure administrative control dashboard built for **CHAMONVIN LIMITED**, an international sports management firm specializing in football player representation, complemented by comprehensive travel, tours, flight reservations, and visa consultation services.

---

## 1. Brand Identity & Design System

- **Green (`#047857`, `#059669`, `#10b981`):** Primary brand color for key action buttons, badges, highlights, and links.
- **White (`#ffffff`, `#f8fafc`):** Clean and spacious background ensuring readability and clarity.
- **Black / Obsidian (`#020617`, `#09090b`):** Deep authority typography, headers, and footer surfaces.
- **Font:** Clean modern typography powered by **Plus Jakarta Sans**.
- **Hero Tagline:** Continuous left-to-right animated marquee displaying:
  > **“Your vision and Goal is our Priority”**

---

## 2. Public Website (Dedicated Multi-Page Architecture)

Every item in the navigation bar leads to its own dedicated, rich route:

1. **HOME (`/`)**:
   - 3-image football stadium/pitch hero slider (rotates every 15 seconds, loop, slide indicators, pause on interaction).
   - Left-to-right animated continuous tagline banner: *“Your vision and Goal is our Priority”*.
   - 4 Hero Action Buttons:
     - Explore Our Sports Management (`/sports-management`)
     - Explore Travel & Visa Services (`/travel-tours`)
     - Become a Represented Player (`/player-representation`)
     - Book a Consultation (`/contact`)
   - Official Approved Introduction copy.
   - Sports Management & Travel-Visa dual service highlight cards.
   - Featured Players Directory (backed by live database records; verified empty state when empty).
   - Why Choose Chamonvin Limited (4 pillars of advantage).
   - Structured 3-step client inquiry process.
   - Latest News & Announcements.
   - Consultation CTA Banner.

2. **ABOUT US (`/about`)**:
   - Company Overview, Mission, Vision, and Core Values.
   - Client-first service philosophy and 360° athlete/traveler care.
   - Deep-dive into Sports Management and Travel-Visa divisions.
   - Full content customizable directly from the Admin Dashboard.

3. **SPORTS MANAGEMENT (`/sports-management`)**:
   - Comprehensive service explanations: amateur, semi-professional, professional, and coach representation.
   - Scouting dossier preparation, club support, trials assistance, and transfer coordination.
   - Ethical representation standards and regulatory notice.
   - "Request Sports Management Support" action button.

4. **OUR PLAYERS (`/players` and `/players/:id`)**:
   - Dynamic player directory with search by name, position, or nationality.
   - Filter buttons for playing levels (Academy, Amateur, Semi-Pro, Pro) and positions.
   - Dedicated individual player profile views with verified achievements, video reels, and scouting inquiry actions.
   - Professional empty state with zero fake players.

5. **PLAYER REPRESENTATION (`/player-representation`)**:
   - Comprehensive representation intake form.
   - Fields: Full name, email, telephone/WhatsApp, country, playing level, primary position, date of birth, current club, video portfolio URL, experience summary, career goals, and privacy consent.
   - Anti-spam honeypot protection.
   - Automatic reference number generation (e.g., `CHM-REP-89421`).

6. **TRAVEL & TOURS (`/travel-tours`)**:
   - Curated sports tours, delegation itineraries, family holidays, and corporate travel.
   - Dynamic travel packages with cover images, destinations, durations, inclusions, and prices.
   - Custom travel and tour consultation request form.

7. **VISA CONSULTATION (`/visa-consultation`)**:
   - Advisory categories: Family reunion, visitor/tourist, business, study, skilled worker/employment, and permanent residency.
   - Prominent official regulatory disclaimer regarding government authority decisions.
   - Structured visa inquiry form with preferred consultation method (WhatsApp, phone, email, video call).

8. **FLIGHT SERVICES (`/flight-services`)**:
   - Flight ticket reservation assistance, itinerary consultation, and group transit coordination.
   - Clear distinction that inquiry is for schedule assistance, without unsafe card collection.
   - Passenger and destination inquiry form.

9. **NEWS & UPDATES (`/news` and `/news/:id`)**:
   - Category filtering across Football Management, Player Announcements, Sports Opportunities, Travel & Visa Updates, and Company News.
   - Individual full article reading view with rich formatted body text and author byline.

10. **CONTACT US (`/contact`)**:
    - Direct company contacts: email, telephone, WhatsApp link, office address, and business hours.
    - General inquiry form organized by category.
    - Direct shortcuts to dedicated sports and travel inquiry forms.

11. **TERMS & PRIVACY (`/terms-privacy`)**:
    - Formal data confidentiality, representation guidelines, and immigration disclaimers.

---

## 3. Secure Admin Dashboard (`/admin/login` -> `/admin`)

The administration console is completely separated from the public interface, guarded by session token authentication.

### Default Administrator Credentials
- **Login URL:** `/admin/login`
- **Email:** `admin@chamonvin.com`
- **Password:** `Chamonvin2026!` *(can be updated in Settings)*

### Admin Capabilities
1. **Overview Dashboard (`/admin`)**:
   - Real-time live counts: Total players, published players, draft players, new player inquiries, unread general inquiries, travel/visa inquiries, and flight inquiries.
   - Recent client inquiries feed.
   - System security and audit logs.
   - Quick action shortcuts.

2. **Player Management (`/admin/players`)**:
   - Add, edit, publish/draft, and delete player profiles.
   - Upload photograph file via server API or specify external image URL.
   - Mark profiles as Featured.
   - Add verified career highlights and video links.

3. **Inquiries & Leads (`/admin/inquiries`)**:
   - Centralized lead database categorized by service.
   - Status tracking: New, In Progress, Awaiting Client Response, Completed, Closed.
   - Private internal staff notes with author and timestamp.
   - Follow-up target date setting.
   - One-click CSV export of client inquiries.

4. **Website Appearance (`/admin/appearance`)**:
   - **Company Logo**: Upload a logo image or enter an external image URL with live preview. Option to remove logo to fall back to clean typography wordmark.
   - **Hero Slider**: Manage all 3 football pitch slides, change images, edit titles and subtitles, and reorder slides.
   - **Hero Tagline**: Edit the exact tagline text that scrolls across the hero.
   - **Hero Action Buttons**: Customize labels and destination routes.
   - **Interval**: Set slide duration (default: 15 seconds).

5. **Travel Packages (`/admin/travel`)**:
   - Add/edit tour packages with inclusions, exclusions, pricing, and cover images.

6. **News Articles (`/admin/news`)**:
   - Author, preview, publish, and delete company news and announcements.

7. **CMS & Settings (`/admin/settings`)**:
   - Company contact details (email, phone, WhatsApp, office address, hours, social links).
   - Edit About Us statements, mission, vision, and core values.
   - Update regulatory disclaimers.
   - Password reset and security audit logs.

---

## 4. Technical Architecture

- **Backend:** Node.js Express server (`server.ts`) with Vite dev middleware mounted in development.
- **Database:** Atomic persistent JSON database (`data/database.json`) with salted PBKDF2 cryptography and session management.
- **File Uploads:** Multer image storage configured to `public/uploads/` with MIME-type and file size validation.
- **Styling:** Tailwind CSS with custom smooth marquee animation and zero-pill typographic discipline.
- **Routing:** React Router v7 genuine multi-page SPA with scroll-to-top behavior.

---

## 5. Development & Build Scripts

- `npm run dev`: Starts the full-stack Express server with Vite middleware on port 3000.
- `npm run build`: Compiles client assets with Vite.
- `npm run lint`: Validates TypeScript without compilation (`tsc --noEmit`).
- `npm start`: Runs the server entry point (`tsx server.ts`).
