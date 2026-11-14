import { ENV } from '@/api/env';
import type { DeckCard } from '@/api/types';
import { authClient } from '@/utils/auth-client';
import {
  toCollectionCard,
  type FilterOption,
  type UserCard,
  type Pagination,
} from './types';
import { CardsPage } from './cards';

export type Deck = {
  id: string;
  owner_id: string;
  deck_name: string;
};

export type DeckCardsResponse = {
  items: DeckCard[];
  total: number;
};

export async function fetchDecks(): Promise<Deck[]> {
  const cookies = await authClient.getCookie();

  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/decks`, {
    headers: { Cookie: cookies },
  });

  if (!res.ok) {
    throw new Error(`Failed to load decks (${res.status})`);
  }

  return res.json();
}

export async function createDeck(deckName: string): Promise<Deck> {
  const cookies = await authClient.getCookie();

  const res = await fetch(`http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/decks`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deck_name: deckName }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create deck (${res.status})`);
  }

  return res.json();
}

type MyDeckApiResponse = {
  items: Array<UserCard>;
  pagination: Pagination;
};

export function fetchDeck(deck_id: string) {
  return async function fetchDeckCards(
    search: string,
    filter: FilterOption = 'all',
    page = 1,
    limit = 20,
  ): Promise<CardsPage> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filter === 'all') {
      params.set('name', search);
    } else if (search) {
      params.set(filter, search);
    }
    const cookies = await authClient.getCookie();
    const headers = { Cookie: cookies };
    const res = await fetch(
      `http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/decks/${encodeURIComponent(
        deck_id,
      )}?${params.toString()}`,
      { headers },
    );
    if (!res.ok) {
      throw new Error(`Failed to load Deck (${res.status})`);
    }
    const data: MyDeckApiResponse = await res.json();
    return {
      items: data.items.map(toCollectionCard),
      pagination: data.pagination,
    };
  };
}

export async function addCardToDeck(
  deckId: string,
  cardId: string,
  quantity: number = 1,
): Promise<void> {
  const cookies = await authClient.getCookie();

  const res = await fetch(
    `http://${ENV.EXPO_PUBLIC_API_URL}/api/v1/decks/${deckId}/cards/${cardId}`,
    {
      method: 'POST',
      headers: {
        Cookie: cookies,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to add card to deck (${res.status})`);
  }
}
