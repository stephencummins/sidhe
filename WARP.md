# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Sídhe** is a Celtic-themed tarot reading web application built with React, TypeScript, and Vite. It features:
- Interactive tarot readings (Single Card, Three Card Spread, Celtic Cross)
- Celtic and traditional tarot interpretations
- AI-generated reading interpretations using Claude (via Supabase Edge Functions)
- Shareable reading URLs
- Admin panel for content management
- Automated daily tarot email system via n8n workflows

## Development Commands

### Essential Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Supabase Commands
```bash
# Deploy all edge functions
supabase functions deploy

# Deploy specific function
supabase functions deploy generate-daily-reading
supabase functions deploy generate-tarot-interpretation
supabase functions deploy update-celtic-meanings

# View function logs
supabase functions logs generate-daily-reading --follow
```

### Database Utilities
The project includes numerous `.mjs` utility scripts in the root directory for database management:
- `check-*.mjs` - Verification scripts for data integrity
- `fix-*.mjs` - Data repair and migration scripts
- `add-*.mjs` - Scripts to add missing data or columns
- `apply-*.mjs` - Migration application scripts
- `generate-thumbnails.mjs` - Generate card thumbnail images

Run with: `node <script-name>.mjs`

## Architecture

### Frontend Structure

**Component Hierarchy:**
- `App.tsx` - Root component with React Router setup
  - `Layout.tsx` - Shared layout wrapper with navigation
  - `LandingPage.tsx` - Home page entry point
  - `TarotFlow.tsx` - Multi-step reading flow manager (spread → question → cards → display)
  - `AdminPanel.tsx` - Protected admin interface for content management
  - `SharedReading.tsx` - Public view for shareable reading URLs

**Reading Flow (4 screens):**
1. `SpreadSelection.tsx` - Choose reading type (Single, Three Card, Celtic Cross)
2. `QuestionInput.tsx` - Enter optional question for the reading
3. `CardSelection.tsx` - Interactive card selection with animation
4. `ReadingDisplay.tsx` - Show results with AI interpretation

**Data Layer:**
- `src/data/tarotDeck.ts` - Default 78-card tarot deck (fallback)
- `src/data/spreads.ts` - Reading spread configurations
- `src/hooks/useTarotDeck.ts` - Fetches active deck from Supabase, falls back to default
- `src/lib/supabase.ts` - Supabase client initialization

### Backend Structure (Supabase)

**Edge Functions:**
- `generate-daily-reading` - Creates automated daily 3-card readings with AI interpretation
- `generate-tarot-interpretation` - Takes cards + question, returns Claude-generated interpretation
- `update-celtic-meanings` - Batch update Celtic meanings for cards

**Database Schema:**
- `tarot_decks` - Deck configurations (name, theme, is_active, card_back_url)
- `tarot_cards` - Card data (78 cards per deck with traditional + Celtic meanings)
- `daily_readings` - Stored automated daily readings
- `shared_readings` - User-generated readings with shareable links

**Key Patterns:**
- The app can work with multiple tarot decks but only one is active at a time
- Each card has both traditional and Celtic interpretation fields
- Database cards are fetched at runtime; fallback to hardcoded deck if DB unavailable
- All readings can be shared via unique URLs (format: `/reading/:id`)

### Authentication

- Supabase Auth with Google OAuth provider
- Protected routes wrapped in `ProtectedRoute` component
- Auth state managed via `AuthContext` (React Context API)
- Admin panel requires authentication

### Styling

**Tailwind Configuration:**
- Custom color palette: `sidhe-navy`, `sidhe-deep-blue`, `sidhe-gold`, `sidhe-bright-gold`, `sidhe-orange`, `sidhe-coral`, `sidhe-teal`, `sidhe-sage`, `sidhe-cream`, `sidhe-moon`
- Additional CSS in `calan-safe-integration.css` for custom components
- Celtic-themed design with gradients and gold accents

### External Integrations

**n8n Workflows:**
- Daily automated tarot reading emails
- Workflow JSON files in root directory (e.g., `n8n-daily-tarot-workflow-resend.json`)
- See `DAILY-TAROT-SETUP.md` for configuration

**AI Generation:**
- Uses Anthropic Claude (via Supabase Edge Functions)
- `ANTHROPIC_API_KEY` must be set in Supabase environment variables
- Generates contextual interpretations based on card positions and user questions

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Required in Supabase (for Edge Functions):
```
ANTHROPIC_API_KEY=your_anthropic_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Important Architectural Decisions

### Dual-Meaning System
Cards support both **traditional** and **Celtic** interpretations:
- `upright_meaning` / `reversed_meaning` - Traditional tarot
- `celtic_upright` / `celtic_reversed` - Celtic mythology-based
- `keywords` / `celtic_keywords` - Different keyword sets
- `celtic_mythology` - Background mythology stories

When generating readings, specify `meaningType: 'traditional' | 'celtic'` in API calls.

### Card Reversal Logic
- 50% chance of reversal during card selection
- Visual indicator (⟲ symbol) for reversed cards
- Different meanings displayed based on orientation
- Reversals are preserved in shared readings

### Reading Persistence
- Daily readings are cached (one per day) to avoid regeneration
- User readings are stored with unique IDs for sharing
- Check `reading_date` to prevent duplicate daily readings

### Deck Management
- Only one deck can be active at a time (`is_active` flag in `tarot_decks`)
- The frontend uses `useTarotDeck()` hook to load the active deck
- Card images are stored as URLs (`image_url`, `card_back_url`)
- Fallback to hardcoded deck ensures app works if DB is unavailable

## Testing

No formal test framework is currently configured. To verify changes:
1. Run `npm run typecheck` to catch TypeScript errors
2. Run `npm run lint` to check code style
3. Test manually in the browser with `npm run dev`
4. For Edge Functions, test with `curl` (see `DAILY-TAROT-SETUP.md` for examples)

## Deployment

- Frontend deployed to **Netlify** (config in `.netlify/netlify.toml`)
- Edge Functions deployed to **Supabase**
- Build command: `npm run build`
- Output directory: `dist`
- Includes `historyApiFallback` for client-side routing

## Common Tasks

### Adding a New Card
1. Insert into `tarot_cards` table in Supabase
2. Include all required fields: name, arcana, suit (if minor), keywords, meanings
3. Optionally add Celtic meanings and mythology
4. Run `check-all-cards.mjs` to verify data integrity

### Modifying Reading Spreads
1. Edit `src/data/spreads.ts`
2. Add new spread configuration with positions array
3. Update `SpreadType` in `src/types/index.ts`
4. Ensure position count matches `cardCount`

### Updating AI Interpretation Prompts
1. Edit `supabase/functions/generate-tarot-interpretation/index.ts`
2. Modify the Claude API prompt in the function
3. Redeploy: `supabase functions deploy generate-tarot-interpretation`
4. Test with sample readings to verify output quality

### Creating Shareable Reading Links
Readings are automatically shareable:
- Format: `https://sidhe.netlify.app/reading/{reading_id}`
- Handled by `SharedReading.tsx` component
- Reading data fetched from `shared_readings` or `daily_readings` table

### Troubleshooting Database Issues
- Check RLS policies if queries fail (see `check-rls.mjs`)
- Verify deck ownership with `check-owner.mjs`
- Validate data consistency with `check-all-decks.mjs`
- Review Supabase logs in dashboard for detailed errors
