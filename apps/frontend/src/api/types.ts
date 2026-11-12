import { ReactElement } from 'react';
import { CardsPage } from './cards';
import { User } from './userTypes';

type FetchFunc = (
  search: string,
  filter?: FilterOption,
  page?: number,
  limit?: number,
) => Promise<CardsPage>;

export interface CardListProps {
  fetchlist: FetchFunc;
  query: string;
  activeFilter: FilterOption;
  emptyMessage: string;
  header?: ReactElement;
  refreshOnFocus?: boolean; // reload every time the screen comes into view
  variant?: 'browse' | 'wishlist' | 'trades'; // which buttons each card shows
}

export const FILTERS = [
  'all',
  'set',
  'rarity',
  'colors',
  'oracleText',
  'typeLine',
  'manaCost',
  'cmc',
  'colorIdentity',
  'prices',
] as const;

export type FilterOption = (typeof FILTERS)[number];

export type SearchCard = {
  id: string;
  name: string;
  typeLine: string;
  setName: string;
  imageUris: ImageUris;
  prices: {
    usd: number;
  };
  finishes: Array<string>;
  power: string;
  toughness: string;
};

export type ListedCard = {
  user_id: string;
  card_id: string;
  condition: string;
  for_trade: boolean;
  wishlist: boolean;
  quantity: number;
  Card: SearchCard;
  User: User;
};

export type UserCard = {
  user_id: string;
  card_id: string;
  condition: string;
  for_trade: boolean;
  wishlist: boolean;
  quantity: number;
  Card: SearchCard;
};

export type ListingCard = Omit<UserCard, 'Card' | 'card_id'> &
  Omit<User, 'id' | 'createdAt'> &
  MagicCard;

export type CollectionCard = Omit<UserCard, 'Card' | 'card_id'> & MagicCard;

export type DeckCard = {
  deck_id: string;
  card_id: string;
  quantity: number;
  Card: SearchCard;
};

export type DeckList = Pick<DeckCard, 'quantity'> & MagicCard;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ImageUris = {
  art?: string | null;
  small?: string | null;
  normal?: string | null;
  large?: string | null;
  grid?: string | null;
};

export type MagicCard = {
  id: string;
  name: string;
  type: string;
  category: CardCategory;
  setName: string;
  imageUris: ImageUris;
  prices: {
    usd: number;
  };
  finishes: Array<string>;
  power: string;
  toughness: string;
};

export type CardCategory =
  'Creature' | 'Sorcery' | 'Enchantment' | 'Instant' | 'Artifact' | 'Land' | null;

export function toCategory(typeLine: string): CardCategory {
  const type = typeLine.toLowerCase();
  if (type.includes('creature')) return 'Creature';
  if (type.includes('artifact')) return 'Artifact';
  if (type.includes('sorcery')) return 'Sorcery';
  if (type.includes('enchantment')) return 'Enchantment';
  if (type.includes('instant')) return 'Instant';
  if (type.includes('land')) return 'Land';
  return null;
}

export function toMagicCard(card: SearchCard): MagicCard {
  const type = card.typeLine ?? 'Unknown';
  return {
    id: card.id,
    name: card.name,
    type,
    category: toCategory(type),
    setName: card.setName,
    imageUris: card.imageUris,
    prices: card.prices,
    finishes: card.finishes,
    power: card.power,
    toughness: card.toughness,
  };
}

export function toCollectionCard(card: UserCard): CollectionCard {
  const type = card.Card.typeLine ?? 'unknown';
  return {
    user_id: card.user_id,
    condition: card.condition,
    for_trade: card.for_trade,
    wishlist: card.wishlist,
    quantity: card.quantity,

    id: card.Card.id,
    name: card.Card.name,
    type: type,
    category: toCategory(type),
    setName: card.Card.setName,
    imageUris: card.Card.imageUris,
    prices: card.Card.prices,
    finishes: card.Card.finishes,
    power: card.Card.power,
    toughness: card.Card.toughness,
  };
}

export function toDeckCard(card: DeckCard): DeckList {
  const type = card.Card.typeLine ?? 'unknown';
  return {
    quantity: card.quantity,

    id: card.Card.id,
    name: card.Card.name,
    type: type,
    category: toCategory(type),
    setName: card.Card.setName,
    imageUris: card.Card.imageUris,
    prices: card.Card.prices,
    finishes: card.Card.finishes,
    power: card.Card.power,
    toughness: card.Card.toughness,
  };
}

export function toListingCard(card: ListedCard): ListingCard {
  const type = card.Card.typeLine ?? 'unknown';
  return {
    user_id: card.user_id,
    condition: card.condition,
    for_trade: card.for_trade,
    wishlist: card.wishlist,
    quantity: card.quantity,

    id: card.Card.id,
    name: card.Card.name,
    type,
    category: toCategory(type),
    setName: card.Card.setName,
    imageUris: card.Card.imageUris,
    prices: card.Card.prices,
    finishes: card.Card.finishes,
    power: card.Card.power,
    toughness: card.Card.toughness,

    username: card.User.username,
    email: card.User.email,
    image: card.User.image,
    email_verified: card.User.email_verified,
  };
}
