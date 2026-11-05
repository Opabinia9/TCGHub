import { ENV } from '@/api/env';
import { DeckCard, MagicCard, toDeckCard } from './types';
import { Pagination } from './types';

type DeckList = {
  items: Array<MagicCard>;
  pagination: Pagination;
};

type CollectionApiResponse = {
  items: Array<DeckCard>;
  pagination: Pagination;
};

export async function fetchDeck(search: string, page = 1, limit = 20): Promise<DeckList> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) {
    params.set('name', search);
  }
  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/collection`, {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNzEyNTljNi0zZDM3LTQ4MjItYjM0ZS0xZjY2YzFiMTRmZWYiLCJpYXQiOjE3OTM3MDM2NTV9.uP2W6YnJq32UdAPuhPR7V_l1zkxu4IkLoFiQyEdWOh4',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to load collection (${res.status})`);
  }
  const data: CollectionApiResponse = await res.json();
  console.log(data.items);
  return { items: data.items.map(toDeckCard), pagination: data.pagination };
}
