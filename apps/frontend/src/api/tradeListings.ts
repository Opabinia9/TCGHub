import { ENV } from '@/api/env';
import { MagicCard, toCollectionCard, UserCard } from './types';
import { Pagination } from './types';
import { authClient } from '@/utils/auth-client';

type TradeListingsPage = {
  items: Array<MagicCard>;
  pagination: Pagination;
};

type TradeListingsApiResponse = {
  items: Array<UserCard>;
  pagination: Pagination;
};

export async function fetchTradeListings(
  search: string,
  page = 1,
  limit = 20,
): Promise<TradeListingsPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) {
    params.set('name', search);
  }
  const cookies = await authClient.getCookie();
  const headers = { Cookie: cookies };
  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/trades`, {
    headers,
  });
  if (!res.ok) {
    throw new Error(`Failed to load available listings (${res.status})`);
  }
  const data: TradeListingsApiResponse = await res.json();
  return {
    items: data.items.map(toCollectionCard),
    pagination: data.pagination,
  };
}
