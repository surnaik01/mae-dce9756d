
# SaleSpot India — MVP Plan

A website to discover **local store sales, online deals, festival offers, and grocery discounts** across India, all in one place. Government schemes for women come in Phase 2 once the sales finder is solid.

## What we'll build (Phase 1)

### Pages
- **Home (`/`)** — Hero, search bar, featured deals, category tiles (Local · Online · Festival · Grocery), city selector
- **Deals (`/deals`)** — Full browsable list with filters: category, city, store, discount %, expiry
- **Deal detail (`/deals/$id`)** — Image, store, validity, original/sale price, link to source, "Save" button
- **Stores (`/stores`)** — Browse by retailer (Amazon, Flipkart, Myntra, DMart, Big Bazaar, Reliance, local malls)
- **About (`/about`)** — What this is, how it works, contact your mom for tips

### Core features
- City selector (saved in localStorage) — Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata + "All India"
- Search by keyword (store name, brand, category)
- Filters: category, discount %, expiry soon, online vs local
- Sort: newest, ending soon, biggest discount
- Save favorite deals (localStorage initially, no login needed for MVP)
- "Trending now" and "Ending soon" sections on home

## How auto-updating works (the hard part)

Honest reality check: **truly reliable scraping requires paid APIs and ongoing maintenance**. Here's the pragmatic approach:

1. **Perplexity API** (Sonar model) — runs daily, asks "What are the latest sales/discounts on Amazon India, Flipkart, Myntra, DMart this week?" Returns structured JSON with citations. Best for online + festival deals.
2. **Firecrawl** — scrapes specific store sale pages (e.g. amazon.in/deals, flipkart.com/offers-store) on a schedule. Best for store-specific deals.
3. **Seed data** — a starter set of ~30 hand-curated deals so the app isn't empty on day one.
4. **Refresh job** — a server function `/api/public/refresh-deals` triggered by a daily cron (free option: cron-job.org or GitHub Actions hitting the URL). Fetches → dedupes → upserts into Lovable Cloud DB.

**Both Perplexity and Firecrawl require API keys.** Lovable has built-in connectors for both — you'll be prompted to connect them during build. Perplexity is ~$5/mo for light use; Firecrawl has a free tier (500 pages/mo).

## Tech approach

- **Frontend**: TanStack Start + Tailwind + shadcn/ui (already set up)
- **Backend**: Lovable Cloud (Postgres) — single `deals` table with: title, description, store, category, city, discount_percent, original_price, sale_price, image_url, source_url, valid_from, valid_until, is_online, created_at
- **Server functions**: `getDeals(filters)`, `getDealById(id)`, `refreshDeals()` (admin/cron)
- **AI fetching**: Perplexity for web-grounded deal discovery, Firecrawl for targeted store scraping

## Design direction

Clean, energetic, India-friendly — bright accent color (saffron/coral), white background, large deal cards with prominent discount badges, mobile-first since most users will be on phones.

## What's NOT in Phase 1

- User login (saves go to localStorage)
- Government schemes for women (Phase 2 — separate section once sales work)
- Push/email notifications
- Submitting deals from users

## Phase 2 preview

Add a `/schemes` section listing central + state government schemes for women (Beti Bachao, Sukanya Samriddhi, PMMVY, Ujjwala, state-specific ones). Same auto-refresh approach using Perplexity to monitor official sources (india.gov.in, myscheme.gov.in, ministry sites).

---

**Want me to adjust anything before I build?** A few things you might want to change:
- Start with fewer cities or a single city?
- Skip Firecrawl and use only Perplexity to keep costs lower?
- Include government schemes from day one (longer build)?
