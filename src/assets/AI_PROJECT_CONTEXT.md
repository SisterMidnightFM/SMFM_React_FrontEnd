# SMFM React Project - AI Context Document

## CRITICAL AI INSTRUCTIONS

1. **ALWAYS keep responses minimal and concise**
2. **NEVER make unnecessary changes** - only modify what's explicitly requested
3. **MAINTAIN the existing project structure** - it's organized for human comprehension
4. **PRESERVE naming conventions** - BEM CSS, TypeScript types, component patterns
5. **Follow established patterns** - study existing code before adding new features
6. **Keep file locations consistent** - don't reorganize folders without explicit permission

---

## Project Overview

**SMFM Radio Website** is a React-based web application for Sister Midnight FM, an independent internet radio station. It provides content discovery, live streaming, and community engagement features.

### Core Purpose
- Browse radio shows, episodes, and guest artists
- Play live radio stream with real-time status
- Search and filter content by multiple criteria

---

## Technology Stack

- **React 19.1.1** + **TypeScript 5.8.3** (strict mode)
- **TanStack Router 1.132.27** (file-based routing)
- **Vite 7.1.7** (bundler with HMR)
- **Strapi CMS** (headless CMS backend at `localhost:1337`)
- **React Context API** (state management - NO Redux/Zustand)
- **Custom CSS** (NO Tailwind/Bootstrap - BEM naming convention)

---

## Project Structure

```
src/
├── components/          # UI components by domain
│   ├── layout/         # Header, SidePanels, Navigation
│   ├── home/           # StaffPicks, LatestEpisodes/Shows
│   ├── episodes/       # EpisodeList, EpisodeCard, EpisodeDetail
│   ├── shows/          # ShowList, ShowCard, ShowDetail
│   ├── artists/        # ArtistList, ArtistCard, ArtistDetail
│   ├── news/           # NewsCard, NewsList, NewsDetail
│   ├── about/          # AboutPage (page-level component with CSS)
│   ├── staff-picks/    # StaffPicksPage (page-level component with CSS)
│   ├── search/         # SearchBar, FilterPanel, DateRangePicker
│   ├── shared/         # Reusable cross-domain components (Card, CardGrid)
│   └── tags/           # TagBadge, TagFilter
├── contexts/           # AudioPlayerContext (live stream state)
├── routes/             # Thin route wrappers (TanStack Router)
├── services/           # API calls to Strapi (episodes, shows, artists, news)
├── types/              # TypeScript definitions (strapi, episode, show, artist, etc.)
├── utils/              # Helper functions (cardHelpers for data transformation)
├── assets/             # Fonts, template images
├── main.tsx            # Application entry point
└── index.css           # Global styles, fonts, CSS variables
```

---

## Key Architectural Patterns

### Routing (TanStack Router)
- **File-based routing** in `/src/routes/`
- `__root.tsx` provides layout with Header + SidePanels
- Route files auto-generate `/src/routeTree.gen.ts` (DO NOT EDIT MANUALLY)
- URL params: `/episodes/:slug`, `/shows/:slug`, `/artists/:slug`

### State Management
- **AudioPlayerContext**: Global live stream state (play/pause, loading, current show)
- **Local useState**: Page-level data fetching (episodes, shows, pagination)
- **NO global state library** (Redux/Zustand/Jotai)

### Data Fetching Pattern
```typescript
// Standard pattern in all pages:
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await serviceFetch(page, pageSize);
      setState(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, [page]);
```

### Styling Convention
- **BEM naming**: `.component__element--modifier`
- **CSS variables**: `--Colour1`, `--Colour2`, `--Colour3` (defined in `index.css`)
- **Component-scoped CSS files**: `ComponentName.css` alongside `.tsx`
- **Responsive breakpoints**: 480px (mobile), 768px (tablet), 1024px+ (desktop)

---

## Important Files & Their Roles

| File | Purpose |
|------|---------|
| `src/main.tsx` | App bootstrap, StrictMode wrapper |
| `src/routes/__root.tsx` | Root layout (Header + Panels structure) |
| `src/contexts/AudioPlayerContext.tsx` | Live stream state & radio.co API integration |
| `src/services/episodes.ts` | Strapi API calls for episodes |
| `src/types/strapi.ts` | Base Strapi response types |
| `src/index.css` | Global styles, fonts (@font-face), CSS variables |
| `.env` | Strapi URL & API token (VITE_ prefix required) |
| `vite.config.ts` | TanStack Router plugin (MUST be first) |

---

## Component Organization Rules

1. **Layout components** (`layout/`) - Site-wide structure (Header, Panels)
2. **Domain components** (`episodes/`, `shows/`, etc.) - Feature-specific UI
3. **Shared components** (`shared/`) - Cross-domain reusable elements
4. **Props should be typed** with TypeScript interfaces

### Card Component System
- **Base Card** (`shared/Card.tsx` + `Card.css`) - Single source of truth for all card styling
- **CardGrid** (`shared/CardGrid.tsx` + `CardGrid.css`) - Reusable responsive grid for card layouts
- **Wrapper Components** - Domain-specific cards are thin wrappers around the base Card:
  - `episodes/EpisodeCard.tsx` - Transforms Episode → Card props
  - `shows/ShowCard.tsx` - Transforms Show → Card props
  - `artists/ArtistCard.tsx` - Transforms Artist → Card props
  - `news/NewsCard.tsx` - Transforms News → Card props
- **Helper Utilities** (`utils/cardHelpers.ts`) - Shared transformation functions (date formatting, text truncation, rich text extraction)
- **No duplicate CSS** - Card styling in `shared/Card.css`, grid layout in `shared/CardGrid.css`

### Route Organization
- **Routes are thin wrappers** - Logic moved to components for better reusability
- **Page components** live in `components/` folders (e.g., `about/AboutPage.tsx`, `staff-picks/StaffPicksPage.tsx`)
- **CSS colocated** - Component CSS files alongside their `.tsx` files, not in routes

---

## API Integration (Strapi)

### Authentication
```typescript
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;
// Bearer token in Authorization header
```

### Key Service Functions
- `fetchEpisodes(page, pageSize)` - Paginated episodes (sort: BroadcastDateTime:desc)
- `fetchShows(page, pageSize)` - Paginated shows (sort: ShowName:asc)
- `fetchEpisodeBySlug(slug)` - Single episode with relations
- `fetchShowBySlug(slug)` - Single show with episodes & hosts
- `fetchStaffPickEpisodes()` - Staff-picked episodes for homepage

### Response Structure
```typescript
StrapiCollectionResponse<T> {
  data: T[],
  meta: { pagination: { page, pageSize, pageCount, total } }
}
```

---

## Live Stream Integration

- **Provider**: radio.co
- **Stream URLs**:
  - Standard: `https://stream.radio.co/s35e4926a1/listen`
  - Mobile: `https://stream.radio.co/s35e4926a1/low`
- **Polling intervals**:
  - Station status: 30 seconds
  - Current track: 10 seconds
- **HTML5 Audio API** for playback control

---

## TypeScript Types

### Core Domain Types
- **Episode**: Title, slug, description, BroadcastDateTime, show relation, guest artists, tags, image, tracklist
- **Show**: ShowName, slug, description, schedule (day/time), hosts, episodes, social links, image
- **Artist**: Name, slug, bio, social links, hosted shows, guest appearances, image
- **Tag**: Energy, genre, mood, action categories

### Strapi Wrapper Types
- `StrapiResponse<T>` - Single entity wrapper
- `StrapiCollectionResponse<T>` - Collection with pagination
- `StrapiImage` - Image with formats (thumbnail, small, medium, large)
- `StrapiRichText` - Paragraph-based rich text

---

## Design & Styling Details

### Color Palette (CSS Variables)
- `--Colour1`: #C0B7AF (beige background)
- `--Colour2`: #322824 (dark brown text)
- `--Colour3`: #000000 (black)

### Custom Fonts
- `ReworkText-Bold` - Headers/primary
- `SisterMidnight-Regular` - Secondary

### Visual Features
- Paper texture overlay (SVG noise pattern)
- Smooth transitions/animations
- Spinner for loading states
- Sticky header with z-index layering

---

## Development Commands

```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # TypeScript compile + production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## Code Modification Guidelines

### When Adding Features:
1. **Study existing patterns first** - check similar components
2. **Use TypeScript strictly** - define types for new data
3. **Follow BEM CSS naming** - keep styling conventions
4. **Create services for new APIs** - maintain service layer separation
5. **Update types** if adding Strapi content types
6. **Keep components small** - split large components into smaller ones

### When Fixing Bugs:
1. **Minimal changes only** - fix the specific issue
2. **Preserve existing structure** - don't refactor unnecessarily
3. **Test related functionality** - ensure no regressions
4. **Match existing code style** - formatting, naming, patterns

### When Refactoring:
1. **Only with explicit permission** - don't reorganize unprompted
2. **Maintain file locations** - avoid moving files without reason
3. **Keep component hierarchy** - don't flatten or nest differently
4. **Preserve import paths** - minimize breaking changes

---

## Common Patterns Reference

### Page Component Pattern
```typescript
export const Route = createFileRoute('/path')({
  component: PageComponent,
});

function PageComponent() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div className="page-container">
      {/* Content */}
    </div>
  );
}
```

### Service Function Pattern
```typescript
export async function fetchResource(params: QueryParams): Promise<Resource[]> {
  const query = qs.stringify({
    populate: ['relation1', 'relation2'],
    sort: ['field:asc'],
    pagination: { page: params.page, pageSize: params.pageSize }
  });

  const response = await fetch(`${STRAPI_URL}/api/resources?${query}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });

  const json: StrapiCollectionResponse<Resource> = await response.json();
  return json.data;
}
```

---

## What NOT to Do

- **DON'T** install new state management libraries (Redux, Zustand, etc.)
- **DON'T** add CSS frameworks (Tailwind, Bootstrap, etc.)
- **DON'T** change the routing system (stick with TanStack Router)
- **DON'T** reorganize folder structure without explicit request
- **DON'T** add build complexity (webpack, custom loaders, etc.)
- **DON'T** create documentation files unprompted (READMEs, etc.)
- **DON'T** use inline styles (keep CSS in separate files)
- **DON'T** bypass the service layer (always use service functions for API calls)

---

## Project Goals Summary

1. **Maintainability** - Clean separation of concerns, predictable structure
2. **Type Safety** - Comprehensive TypeScript coverage prevents runtime errors
3. **Performance** - Pagination, lazy loading, responsive images
4. **User Experience** - Smooth animations, responsive design, intuitive navigation
5. **Content Discovery** - Multiple browse paths (shows, episodes, artists, search)
6. **Live Radio** - Real-time stream with current show display

---

## Final Reminder

**This is a carefully structured project designed for human comprehension. Preserve its organization, maintain established patterns, and make minimal, targeted changes. When in doubt, ask before restructuring.**
