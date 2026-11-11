import { ENV } from '@/api/env';
import {
  Pagination,
  FilterOption,
  ListedCard,
  ListingCard,
  MagicCard,
  toListingCard,
  UserCard,
} from './types';
import { authClient } from '@/utils/auth-client';

type TradeListingsPage = {
  items: Array<ListingCard>;
  pagination: Pagination;
};

type TradeListingsApiResponse = {
  items: Array<ListedCard>;
  pagination: Pagination;
};

export async function fetchTradeListings(
  search: string,
  filter: FilterOption = 'all',
  page = 1,
  limit = 20,
): Promise<TradeListingsPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) {
    params.set(filter, search);
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
    items: data.items.map(toListingCard),
    pagination: data.pagination,
  };
}

export async function fetchTrade(sellerId: string, cardId: string) {
  const cookies = await authClient.getCookie();
  const headers = { Cookie: cookies };
  const response = await fetch(
    `http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/trades/${sellerId}/${cardId}`,
    {
      headers,
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to load available listings (${response.status})`);
  }
  const payload: { success: string; trade: UserCard & { Card: MagicCard } } = await response.json();

  return payload.trade;
}
