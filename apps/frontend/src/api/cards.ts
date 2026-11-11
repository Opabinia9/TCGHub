import { ENV } from '@/api/env';
import type { SearchCard, Pagination, MagicCard, FilterOption } from '@/api/types';
import { toMagicCard } from '@/api/types';

export type CardsPage = {
  items: Array<MagicCard>;
  pagination: Pagination;
};

type CardsApiResponse = {
  items: Array<SearchCard>;
  pagination: Pagination;
};

export async function fetchCards(
  search: string,
  filter: FilterOption = 'all',
  page = 1,
  limit = 20,
): Promise<CardsPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search.length >= 1) {
    params.set(filter === 'all' ? 'name' : filter, search);
  }
  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/cards?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to load cards (${res.status})`);
  }
  const data: CardsApiResponse = await res.json();
  return { items: data.items.map(toMagicCard), pagination: data.pagination };
}
