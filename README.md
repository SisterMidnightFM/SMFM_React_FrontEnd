# SMFM Radio Website

This is the front-end website for SMFM Radio. It's built as a modern web application that displays radio shows, episodes, and artists from the SMFM catalog.

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Strapi URL and API token.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render.com.

### Security

See [SECURITY.md](./SECURITY.md) for security best practices and guidelines.

## What This Website Does

The website allows visitors to:
- Browse all radio shows, episodes, and guest artists
- Search and filter content with multi-criteria search (text, date range, genre, mood, theme)
- View detailed information about each show or episode
- Discover featured content and staff picks on the homepage
- Filter content by multiple tags simultaneously with relevance-based results

## Main Project Files

Here's what the important files in the root folder do:

- **package.json** - Lists all the external tools and libraries the website needs to run
- **index.html** - The main HTML file that loads when you visit the website
- **vite.config.ts** - Configuration for Vite (the tool that builds and runs the website)
- **.env** - Stores private settings like the address of the content database (NOT committed to git)
- **.env.example** - Template for environment variables (safe to commit)
- **DEPLOYMENT.md** - Guide for deploying to Render.com
- **SECURITY.md** - Security best practices and guidelines
- **public/** - Contains images, logos, and example data files that don't need processing

## Folder Structure

The website's code is organized into these main folders inside `src/`:

### **routes/** - The Different Pages
Each file here represents a page you can visit on the website. The file names match the web addresses:

- `index.tsx` - The homepage (www.smfm.com/)
- `search.tsx` - The search page (/search)
- **episodes/**
  - `index.tsx` - List of all episodes (/episodes)
  - `$slug.tsx` - Individual episode pages (/episodes/episode-name)
- **shows/**
  - `index.tsx` - List of all shows (/shows)
  - `$slug.tsx` - Individual show pages (/shows/show-name)
- **artists/**
  - `index.tsx` - List of all artists (/artists)
  - `$slug.tsx` - Individual artist pages (/artists/artist-name)
- `__root.tsx` - The wrapper that appears on every page (navigation menu, layout)

### **components/** - Reusable Building Blocks
These are pieces of the user interface that get used multiple times across different pages:

- **layout/** - The overall structure of pages
  - `Header.tsx` - The top navigation bar
  - `SidePanel.tsx` - Side panel that can slide in/out
  - `UpNextPanel.tsx` - Shows upcoming episodes
  - `ExplorePanel.tsx` - Browse and discover content

- **home/** - Special components for the homepage
  - `LatestEpisodes.tsx` - Shows the most recent episodes
  - `LatestShows.tsx` - Shows the most recent shows
  - `StaffPicks.tsx` - Featured content picked by staff
  - `ShowCard.tsx` - A card showing one show's info

- **episodes/** - For displaying episode information
  - `EpisodeCard.tsx` - A small preview card for one episode
  - `EpisodeList.tsx` - A grid or list of many episode cards
  - `EpisodeDetail.tsx` - The full detailed view of an episode

- **shows/** - For displaying show information
  - `ShowCard.tsx` - A small preview card for one show
  - `ShowList.tsx` - A grid or list of many show cards
  - `ShowDetail.tsx` - The full detailed view of a show

- **artists/** - For displaying artist information
  - `ArtistCard.tsx` - A small preview card for one artist
  - `ArtistList.tsx` - A grid or list of many artist cards
  - `ArtistDetail.tsx` - The full detailed view of an artist

- **search/** - Advanced search and filtering system
  - `SearchBar.tsx` - Text input for searching show names, episode titles, artist names, and descriptions
  - `ContentTypeToggle.tsx` - Multi-select toggles to search Episodes, Shows, and/or Artists
  - `DateRangePicker.tsx` - Calendar dropdown for selecting single dates or date ranges (broadcast date filtering)
  - `FilterDropdowns.tsx` - Three multi-select dropdowns for Genre, Mood, and Theme tag filtering
  - `SearchButton.tsx` - Submit button to execute search with loading states
  - `SearchResults.tsx` - Displays mixed search results sorted by relevance, with pagination and empty states

- **tags/** - For category labels
  - `TagBadge.tsx` - A small colored label showing a category (like "Jazz" or "Electronic")
  - `TagFilter.tsx` - A clickable tag that filters content

- **shared/** - Components used across multiple sections
  - `Card.tsx` - Base card component with all styling (used by episode, show, artist, news cards)
  - `CardGrid.tsx` - Responsive grid layout for displaying cards

- **about/** - About page component
  - `AboutPage.tsx` - The complete about page with content from Strapi

- **staff-picks/** - Staff picks page component
  - `StaffPicksPage.tsx` - Displays staff-selected episodes

### **services/** - Data Fetchers
These files talk to Strapi (the content management system) to get information:

- `episodes.ts` - Gets episode data from the database
- `shows.ts` - Gets show data from the database
- `artists.ts` - Gets artist data from the database
- `news.ts` - Gets news/blog data from the database
- `about.ts` - Gets about page content from the database
- `tags.ts` - Gets all tag types (Genre, Mood, Theme, Location) from the database
- `search.ts` - Unified search service that queries episodes, shows, and artists with relevance scoring

### **types/** - Data Definitions
These files describe what information each type of content should have (like "an episode has a title, date, and description"):

- `episode.ts` - Defines what information an episode contains
- `show.ts` - Defines what information a show contains
- `artist.ts` - Defines what information an artist contains
- `news.ts` - Defines what information a news/blog post contains
- `about.ts` - Defines what information the about page contains
- `tag.ts` - Defines all tag types (Genre, MoodVibe, Theme, Location)
- `search.ts` - Defines search filters, content types, and result structures with relevance scoring
- `strapi.ts` - Defines how data comes from Strapi (response wrappers, pagination, images, rich text)

### **utils/** - Helper Tools
Small utility functions that make common tasks easier:

- `cardHelpers.ts` - Formats dates, extracts rich text, and truncates text for card display
- `buildSearchQuery.ts` - Builds Strapi query URLs for episodes, shows, and artists with filter parameters
- `calculateRelevance.ts` - Scores search results based on text matches and tag matches for sorting

### **hooks/** - Custom React Hooks
Reusable logic for managing state and side effects:

**TanStack Query Hooks** (Data Fetching with Caching):
- `useEpisodes.ts` - Fetches paginated episodes with infinite scroll support
- `useEpisodeBySlug.ts` - Fetches a single episode by slug with automatic caching
- `useStaffPicks.ts` - Fetches staff-picked episodes (10-minute cache)
- `useShows.ts` - Fetches paginated shows with infinite scroll support
- `useShowBySlug.ts` - Fetches a single show by slug with automatic caching
- `useArtists.ts` - Fetches paginated artists with infinite scroll support
- `useArtistBySlug.ts` - Fetches a single artist by slug with automatic caching
- `useSearch.ts` - Performs searches with filters and caching
- `useTags.ts` - Fetches all tags (genres, moods, themes) with 30-minute cache

**Other Hooks**:
- `useSearchParams.ts` - Manages search filters in URL query parameters for shareable search links

### **contexts/** - React Contexts
Global state management for app-wide features:

- `AudioPlayerContext.tsx` - Manages live radio stream playback state
- `EpisodePlayerContext.tsx` - Manages SoundCloud/MixCloud episode player state

### **Other Important Files**
- `main.tsx` - The starting point that launches the entire website
- `routeTree.gen.ts` - Auto-generated file that maps all pages (don't edit manually)

## How Components Work

The website is built using **components** - think of them like LEGO blocks. Each component is a self-contained piece that does one thing well:

### Basic Components
These do simple, specific tasks that need to happen repeatedly:
- Buttons that can be clicked
- Text input boxes
- Date pickers
- Tag labels
- Content type toggles

### Compound Components
These combine basic components to create more complex features:
- A search page that combines text search, content type toggles, date picker, tag filters, and results display
- An episode card that combines an image, title, description, and genre tags
- A full page layout that combines a header, content area, and sidebars

## Search Feature

The search functionality provides comprehensive filtering across all content:

### Search Criteria
- **Text Search**: Searches show names, episode titles, artist names, and descriptions
- **Content Types**: Filter by Episodes, Shows, and/or Artists (multi-select)
- **Date Range**: Filter episodes by broadcast date (single date or range)
- **Genre Tags**: Filter by multiple genres simultaneously
- **Mood Tags**: Filter by multiple moods/vibes simultaneously
- **Theme Tags**: Filter by multiple themes simultaneously

### Search Behavior
- **OR Logic**: Items matching any selected filter within a category are included
- **Relevance Sorting**: Results sorted by match count (most criteria matched appear first)
- **Pagination**: Load more button for additional results
- **Empty State**: Helpful message displayed until search is initiated
- **Mixed Results**: Episodes, shows, and artists can appear together in results based on selected content types

## Technology Stack

This website is built with:

- **React 19.1.1** - A JavaScript library for building user interfaces with components
- **TypeScript 5.8.3** - Adds type checking to make the code more reliable
- **Vite 7.1.7** - A fast build tool that bundles all the code and runs a development server
- **TanStack Router 1.132.27** - Handles page navigation and web addresses
- **TanStack Query 5.x** - Powerful data fetching with automatic caching, background updates, and request deduplication
- **Strapi** - The content management system (separate from this project) that stores all shows, episodes, and artists

### Data Fetching & Caching

The website uses **TanStack Query** (React Query) for all API calls, providing:
- **Automatic caching** - Data is cached for 5 minutes (episodes, shows, artists) to 30 minutes (tags)
- **Background refetching** - Data automatically updates when you return to the browser tab
- **Request deduplication** - Multiple components requesting the same data = single API call
- **Instant navigation** - Cached data displays immediately when navigating back
- **Optimistic updates** - UI feels fast and responsive
- **DevTools** - Built-in debugging tools to inspect cache and queries 
