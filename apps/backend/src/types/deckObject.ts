import type { Deck, DeckCard } from '@prisma/client';

export type userDecks = Array<Deck> | void;
export type DeckCardInterface = Omit<DeckCard, 'deck_id' | 'card_id'>;
export type DeckCreationInterface = Omit<Deck, 'id'>;
export type DeckRef = Omit<Deck, 'deck_name'>;
