import { ENV } from '@/api/env';
import { MagicCard, toCollectionCard, UserCard } from './types';
import { Pagination } from './types';
import { authClient } from '@/utils/auth-client';

type CollectionPage = {
  items: Array<MagicCard>;
  pagination: Pagination;
};

type CollectionApiResponse = {
  items: Array<UserCard>;
  pagination: Pagination;
};

export async function fetchCollection(
  search: string,
  page = 1,
  limit = 20,
): Promise<CollectionPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) {
    params.set('name', search);
  }
  const cookies = await authClient.getCookie();
  const headers = { Cookie: cookies };
  const res = await fetch(
    `http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/collection`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`Failed to load collection (${res.status})`);
  }
  const data: CollectionApiResponse = await res.json();
  return {
    items: data.items.map(toCollectionCard),
    pagination: data.pagination,
  };
}

export type CollectionUpdate = {
  card_id: string;
  quantity: number; 
  for_trade: boolean;
  wishlist: boolean;
  condition?: string;
};

// Add a card to your collection, or update one you already have.
export async function updateCollectionCard(body: CollectionUpdate): Promise<void> {
  const cookies = await authClient.getCookie();
  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/collection`, {
    method: 'POST',
    headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Failed to update collection (${res.status})`);
  }
}


// The ids of the cards on your wishlist.
export async function fetchWishlistIds(): Promise<Set<string>> {
  const cookies = await authClient.getCookie();
  const res = await fetch(
    `http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/collection/wishlist`,
    { headers: { Cookie: cookies } },
  );
  if (!res.ok) {
    throw new Error(`Failed to load wishlist (${res.status})`);
  }
  const data: CollectionApiResponse = await res.json();
  return new Set(data.items.map((item) => item.card_id));
}
