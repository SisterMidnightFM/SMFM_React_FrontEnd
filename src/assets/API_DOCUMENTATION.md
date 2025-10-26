# SMFM Strapi API Documentation

Complete reference for all API endpoints in the Sister Midnight FM Strapi backend.

## Base URL

- **Development**: `http://localhost:1337/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication. Include your JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Collection Types

### 1. Shows

**API ID**: `api::show.show`
**Collection Name**: `shows`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows` | Get all shows |
| GET | `/api/shows/:id` | Get a specific show by ID |
| GET | `/api/shows/:id?populate=*` | Get a show with all relations populated |
| POST | `/api/shows` | Create a new show |
| PUT | `/api/shows/:id` | Update a show |
| DELETE | `/api/shows/:id` | Delete a show |

#### Fields

- `ShowName` (string, required, unique)
- `ShowSlug` (UID, required)
- `ShowDescription` (blocks)
- `ShowImage` (media)
- `Show_Instagram` (string)
- `WebLink1` (string)
- `WebLink2` (string)
- `Broadcast_IsRepeat` (boolean)
- `Broadcast_Day` (enum: Monday-Sunday)
- `Broadcast_Time` (integer, 1-12)
- `Broadcast_AmPm` (enum: am/pm)
- `Broadcast_RepeatEvery_Weeks` (integer, default: 4)
- `StaffComments` (blocks, private)

#### Relations

- `Show_Episodes` (oneToMany → Episodes)
- `Main_Host` (manyToMany → Artists)

#### Example Queries

```
GET /api/shows?populate=*
GET /api/shows?populate[Main_Host]=*&populate[Show_Episodes]=*
GET /api/shows?filters[ShowName][$eq]=My Show Name
GET /api/shows?sort=ShowName:asc
GET /api/shows?pagination[page]=1&pagination[pageSize]=10
```

---

### 2. Episodes

**API ID**: `api::episode.episode`
**Collection Name**: `episodes`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/episodes` | Get all episodes |
| GET | `/api/episodes/:id` | Get a specific episode by ID |
| GET | `/api/episodes/:id?populate=*` | Get an episode with all relations populated |
| POST | `/api/episodes` | Create a new episode |
| PUT | `/api/episodes/:id` | Update an episode |
| DELETE | `/api/episodes/:id` | Delete an episode |

#### Fields

- `EpisodeTitle` (string, required)
- `EpisodeSlug` (UID, required)
- `BroadcastDateTime` (datetime, required, unique)
- `EpisodeDescription` (text, required)
- `EpisodeImage` (media)
- `EpisodeTracklist` (blocks)
- `SoundcloudLink` (string, required)
- `MixCloudLink` (string, required, unique)
- `StaffPick` (boolean)
- `StaffPickComments` (string, conditional on StaffPick)

#### Relations

- `link_episode_to_show` (manyToOne → Show)
- `guest_artists` (manyToMany → Artists)
- `tag_genres` (manyToMany → Tag_Genre)
- `tag_mood_vibes` (manyToMany → Tag_MoodVibe)
- `tag_themes` (manyToMany → Tag_Theme)

#### Example Queries

```
GET /api/episodes?populate=*
GET /api/episodes?populate[link_episode_to_show]=*&populate[guest_artists]=*
GET /api/episodes?populate[tag_genres]=*&populate[tag_mood_vibes]=*&populate[tag_themes]=*
GET /api/episodes?filters[StaffPick][$eq]=true
GET /api/episodes?sort=BroadcastDateTime:desc
GET /api/episodes?filters[BroadcastDateTime][$gte]=2024-01-01
GET /api/episodes?pagination[page]=1&pagination[pageSize]=20
```

---

### 3. Artists

**API ID**: `api::artist.artist`
**Collection Name**: `artists`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/artists` | Get all artists |
| GET | `/api/artists/:id` | Get a specific artist by ID |
| GET | `/api/artists/:id?populate=*` | Get an artist with all relations populated |
| POST | `/api/artists` | Create a new artist |
| PUT | `/api/artists/:id` | Update an artist |
| DELETE | `/api/artists/:id` | Delete an artist |

#### Fields

- `ArtistName` (string, required)
- `Artist_Slug` (UID, required)
- `ArtistBio` (text)
- `ArtistImage` (media)
- `ArtistInstagram` (string)
- `ArtistWebsite` (string)
- `ArtistEmail` (email, private)
- `Real_Name` (string, private)
- `Artist_PhoneNumber` (string, private)

#### Relations

- `Main_host` (manyToMany → Shows)
- `episodes_guest_featured` (manyToMany → Episodes)
- `tag_locations` (manyToMany → Tag_Location)
- `blogs_written` (manyToMany → News/Blog)

#### Example Queries

```
GET /api/artists?populate=*
GET /api/artists?populate[Main_host]=*&populate[episodes_guest_featured]=*
GET /api/artists?populate[tag_locations]=*
GET /api/artists?filters[ArtistName][$contains]=John
GET /api/artists?sort=ArtistName:asc
```

**Note**: Private fields (ArtistEmail, Real_Name, Artist_PhoneNumber) are not returned by default in API responses.

---

### 4. News / Blog

**API ID**: `api::news.news`
**Collection Name**: `newsplural`
**Display Name**: Blog
**Draft & Publish**: Enabled

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newsplural` | Get all published blog posts |
| GET | `/api/newsplural/:id` | Get a specific blog post by ID |
| GET | `/api/newsplural/:id?populate=*` | Get a blog post with all relations populated |
| POST | `/api/newsplural` | Create a new blog post |
| PUT | `/api/newsplural/:id` | Update a blog post |
| DELETE | `/api/newsplural/:id` | Delete a blog post |

#### Fields

- `News_Title` (string, required)
- `News_Slug` (UID, required)
- `News_Text` (richtext, required)
- `CoverImage` (media, multiple images)
- `Additional_Images` (media, multiple images)

#### Relations

- `artists` (manyToMany → Artists)

#### Example Queries

```
GET /api/newsplural?populate=*
GET /api/newsplural?populate[artists]=*
GET /api/newsplural?filters[News_Title][$contains]=Radio
GET /api/newsplural?sort=createdAt:desc
GET /api/newsplural?publicationState=preview (includes drafts)
```

**Note**: Draft & Publish is enabled. Add `?publicationState=preview` to include draft posts.

---

### 5. Tag_Genre

**API ID**: `api::tag.tag`
**Collection Name**: `tags`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all genre tags |
| GET | `/api/tags/:id` | Get a specific genre tag by ID |
| GET | `/api/tags/:id?populate=*` | Get a genre tag with all relations populated |
| POST | `/api/tags` | Create a new genre tag |
| PUT | `/api/tags/:id` | Update a genre tag |
| DELETE | `/api/tags/:id` | Delete a genre tag |

#### Fields

- `Genre` (string)

#### Relations

- `episodes` (manyToMany → Episodes)

#### Example Queries

```
GET /api/tags?populate=*
GET /api/tags?populate[episodes]=*
GET /api/tags?filters[Genre][$eq]=Techno
GET /api/tags?sort=Genre:asc
```

---

### 6. Tag_MoodVibe

**API ID**: `api::mood-vibe-tag.mood-vibe-tag`
**Collection Name**: `mood_vibe_tags`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mood-vibe-tags` | Get all mood/vibe tags |
| GET | `/api/mood-vibe-tags/:id` | Get a specific mood/vibe tag by ID |
| GET | `/api/mood-vibe-tags/:id?populate=*` | Get a mood/vibe tag with all relations populated |
| POST | `/api/mood-vibe-tags` | Create a new mood/vibe tag |
| PUT | `/api/mood-vibe-tags/:id` | Update a mood/vibe tag |
| DELETE | `/api/mood-vibe-tags/:id` | Delete a mood/vibe tag |

#### Fields

- `Mood_or_Vibe` (string)

#### Relations

- `episodes` (manyToMany → Episodes)

#### Example Queries

```
GET /api/mood-vibe-tags?populate=*
GET /api/mood-vibe-tags?populate[episodes]=*
GET /api/mood-vibe-tags?filters[Mood_or_Vibe][$eq]=Energetic
GET /api/mood-vibe-tags?sort=Mood_or_Vibe:asc
```

---

### 7. Tag_Theme

**API ID**: `api::tag-theme.tag-theme`
**Collection Name**: `tag_themes`
**Draft & Publish**: Enabled

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tag-themes` | Get all theme tags |
| GET | `/api/tag-themes/:id` | Get a specific theme tag by ID |
| GET | `/api/tag-themes/:id?populate=*` | Get a theme tag with all relations populated |
| POST | `/api/tag-themes` | Create a new theme tag |
| PUT | `/api/tag-themes/:id` | Update a theme tag |
| DELETE | `/api/tag-themes/:id` | Delete a theme tag |

#### Fields

- `Theme` (string)

#### Relations

- `episodes` (manyToMany → Episodes)

#### Example Queries

```
GET /api/tag-themes?populate=*
GET /api/tag-themes?populate[episodes]=*
GET /api/tag-themes?filters[Theme][$eq]=Politics
GET /api/tag-themes?publicationState=preview (includes drafts)
```

---

### 8. Tag_Location

**API ID**: `api::tag-location.tag-location`
**Collection Name**: `tag_locations`
**Draft & Publish**: Enabled

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tag-locations` | Get all location tags |
| GET | `/api/tag-locations/:id` | Get a specific location tag by ID |
| GET | `/api/tag-locations/:id?populate=*` | Get a location tag with all relations populated |
| POST | `/api/tag-locations` | Create a new location tag |
| PUT | `/api/tag-locations/:id` | Update a location tag |
| DELETE | `/api/tag-locations/:id` | Delete a location tag |

#### Fields

- `Location` (string)

#### Relations

- `artists` (manyToMany → Artists)

#### Example Queries

```
GET /api/tag-locations?populate=*
GET /api/tag-locations?populate[artists]=*
GET /api/tag-locations?filters[Location][$eq]=London
GET /api/tag-locations?publicationState=preview (includes drafts)
```

---

### 9. About Page

**API ID**: `api::about-page.about-page`
**Collection Name**: `about_pages`
**Draft & Publish**: Enabled

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about-pages` | Get all about pages |
| GET | `/api/about-pages/:id` | Get a specific about page by ID |
| POST | `/api/about-pages` | Create a new about page |
| PUT | `/api/about-pages/:id` | Update an about page |
| DELETE | `/api/about-pages/:id` | Delete an about page |

#### Fields

- `AboutPageText` (blocks)

#### Example Queries

```
GET /api/about-pages
GET /api/about-pages/:id
GET /api/about-pages?publicationState=preview (includes drafts)
```

---

### 10. Schedule

**API ID**: `api::schedule.schedule`
**Collection Name**: `schedules`
**Draft & Publish**: Enabled

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedules` | Get all schedules |
| GET | `/api/schedules/:id` | Get a specific schedule by ID |
| GET | `/api/schedules/:id?populate=*` | Get a schedule with all components populated |
| POST | `/api/schedules` | Create a new schedule |
| PUT | `/api/schedules/:id` | Update a schedule |
| DELETE | `/api/schedules/:id` | Delete a schedule |

#### Fields

- `Date` (date, required, unique)
- `Show_Slots` (component, repeatable)

#### Component: Show_Slots

Each Show_Slot component contains:
- `Show_Name` (relation, oneToOne → Show)
- `Start_Time` (time)
- `End_Time` (time)

#### Example Queries

```
GET /api/schedules?populate=*
GET /api/schedules?populate[Show_Slots][populate]=*
GET /api/schedules?populate[Show_Slots][populate][Show_Name]=*
GET /api/schedules?filters[Date][$eq]=2024-01-01
GET /api/schedules?filters[Date][$gte]=2024-01-01&filters[Date][$lte]=2024-01-31
GET /api/schedules?sort=Date:desc
GET /api/schedules?publicationState=preview (includes drafts)
```

**Note**: The `Show_Slots` component is repeatable, allowing multiple time slots per day. To fully populate the related Show information, use deep population: `?populate[Show_Slots][populate][Show_Name]=*`

---

## Common Query Parameters

### Filtering

```
GET /api/episodes?filters[EpisodeTitle][$contains]=Radio
GET /api/episodes?filters[StaffPick][$eq]=true
GET /api/episodes?filters[BroadcastDateTime][$gte]=2024-01-01
```

Available operators:
- `$eq`: Equal
- `$ne`: Not equal
- `$lt`: Less than
- `$lte`: Less than or equal
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$in`: In array
- `$notIn`: Not in array
- `$contains`: Contains (case-sensitive)
- `$notContains`: Not contains
- `$containsi`: Contains (case-insensitive)
- `$notContainsi`: Not contains (case-insensitive)
- `$null`: Is null
- `$notNull`: Is not null
- `$between`: Between two values
- `$startsWith`: Starts with
- `$endsWith`: Ends with

### Sorting

```
GET /api/episodes?sort=BroadcastDateTime:desc
GET /api/shows?sort=ShowName:asc
GET /api/episodes?sort[0]=StaffPick:desc&sort[1]=BroadcastDateTime:desc
```

### Pagination

```
GET /api/episodes?pagination[page]=1&pagination[pageSize]=25
GET /api/episodes?pagination[start]=0&pagination[limit]=25
```

### Population (Relations)

```
GET /api/episodes?populate=*
GET /api/episodes?populate[link_episode_to_show]=*
GET /api/episodes?populate[link_episode_to_show][fields][0]=ShowName
GET /api/episodes?populate[guest_artists]=*&populate[tag_genres]=*
```

### Field Selection

```
GET /api/shows?fields[0]=ShowName&fields[1]=ShowSlug
GET /api/episodes?fields=EpisodeTitle,BroadcastDateTime
```

### Publication State (Draft & Publish)

For collections with Draft & Publish enabled (News, Tag_Theme, Tag_Location, About Page):

```
GET /api/newsplural (published only)
GET /api/newsplural?publicationState=preview (includes drafts)
```

---

## Response Format

### Single Entry

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "ShowName": "Example Show",
      "ShowSlug": "example-show",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "meta": {}
}
```

### Multiple Entries

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "ShowName": "Example Show",
        "ShowSlug": "example-show"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

## Common Use Cases

### Get all episodes for a specific show

```
GET /api/episodes?filters[link_episode_to_show][id][$eq]=1&populate=*
```

### Get all shows hosted by a specific artist

```
GET /api/shows?filters[Main_Host][id][$eq]=1&populate=*
```

### Get recent staff picks

```
GET /api/episodes?filters[StaffPick][$eq]=true&sort=BroadcastDateTime:desc&populate=*
```

### Get episodes by genre

```
GET /api/episodes?filters[tag_genres][Genre][$eq]=Techno&populate=*
```

### Get episodes with specific mood/vibe

```
GET /api/episodes?filters[tag_mood_vibes][Mood_or_Vibe][$eq]=Energetic&populate=*
```

### Get artists from a specific location

```
GET /api/artists?filters[tag_locations][Location][$eq]=London&populate=*
```

### Search episodes by title

```
GET /api/episodes?filters[EpisodeTitle][$containsi]=radio&populate=*
```

### Get upcoming episodes

```
GET /api/episodes?filters[BroadcastDateTime][$gte]={current-datetime}&sort=BroadcastDateTime:asc
```

### Get schedule for a specific date

```
GET /api/schedules?filters[Date][$eq]=2024-01-15&populate[Show_Slots][populate][Show_Name]=*
```

### Get schedule for a date range (e.g., this week)

```
GET /api/schedules?filters[Date][$gte]=2024-01-01&filters[Date][$lte]=2024-01-07&sort=Date:asc&populate[Show_Slots][populate][Show_Name]=*
```

---

## Notes

1. **Private Fields**: Fields marked as `private` (like ArtistEmail, Real_Name, Artist_PhoneNumber) are not returned in API responses by default.

2. **Draft & Publish**: The following collections have draft/publish enabled:
   - News/Blog
   - Tag_Theme
   - Tag_Location
   - About Page
   - Schedule

   Use `?publicationState=preview` to include drafts.

3. **Unique Fields**: The following fields must be unique:
   - `ShowName` in Shows
   - `BroadcastDateTime` in Episodes
   - `MixCloudLink` in Episodes
   - `Date` in Schedule

4. **Media Fields**: All media fields can be populated with `?populate[field]=*` to get full image URLs and metadata.

5. **API Prefix**: All endpoints are prefixed with `/api/` in Strapi v4+.

---

## Generated Documentation

This documentation was automatically generated based on the Strapi schema files located in:
`/src/api/*/content-types/*/schema.json`

Last Updated: 2025-10-22
