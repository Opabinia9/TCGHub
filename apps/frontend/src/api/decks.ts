import { ENV } from '@/api/env';
import {
  Pagination,
  FilterOption,
  MagicCard,
  toCollectionCard,
  UserCard,
  DeckList,
  Deck,
} from '@/api/types';
import { authClient } from '@/utils/auth-client';

type DeckPage = Array<Deck>;

export async function fetchDecks(): Promise<DeckPage> {
  const cookies = await authClient.getCookie();
  const headers = { Cookie: cookies };
  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/decks`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to load decks (${res.status})`);
  }
  const data: DeckPage = (await res.json()) ?? [];
  return data;
}

export async function createDeck(deck_name: string): Promise<Deck> {
  const cookies = await authClient.getCookie();
  const headers = { 'Content-Type': 'application/json', Cookie: cookies };
  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/decks`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ deck_name: deck_name }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create deck (${res.status})`);
  }
  return res.json();
}
