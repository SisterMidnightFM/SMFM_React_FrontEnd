const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

const ID_PAGE_SIZE = 100;

export type Collection = 'artists' | 'episodes' | 'shows';

/**
 * Fetch every id in a collection — the whole catalogue, not just what a list
 * has paged in so far. Only the id field is requested, so even ~1000 episodes
 * come back as a handful of tiny responses that are then cached by TanStack
 * Query and reused for every subsequent shuffle.
 */
export async function fetchAllIds(collection: Collection): Promise<number[]> {
  try {
    const ids: number[] = [];
    let page = 1;
    let pageCount = 1;

    do {
      const url = new URL(`${STRAPI_URL}/api/${collection}`);
      url.searchParams.append('fields[0]', 'id');
      url.searchParams.append('pagination[page]', page.toString());
      url.searchParams.append('pagination[pageSize]', ID_PAGE_SIZE.toString());

      const response = await fetch(url.toString(), { headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Strapi error response:', errorText);
        throw new Error(`Failed to fetch ${collection} ids: ${response.statusText}`);
      }

      const data: { data: Array<{ id: number }>; meta: { pagination: { pageCount: number } } } =
        await response.json();

      ids.push(...data.data.map((entry) => entry.id));
      pageCount = data.meta.pagination.pageCount;
      page++;
    } while (page <= pageCount);

    return ids;
  } catch (error) {
    console.error(`Error fetching ${collection} ids:`, error);
    throw error;
  }
}

/**
 * Add a `filters[id][$in]` clause for each id
 */
export function appendIdFilter(url: URL, ids: number[]): void {
  ids.forEach((id, index) => {
    url.searchParams.append(`filters[id][$in][${index}]`, id.toString());
  });
}

/**
 * Strapi returns matches in its own order — put them back in the order the
 * ids were asked for, which for a shuffle is the randomised order
 */
export function orderByIds<T extends { id: number }>(items: T[], ids: number[]): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is T => item !== undefined);
}
