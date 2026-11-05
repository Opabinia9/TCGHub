import { CardsPage } from './cards';

type FetchFunc = (search: string, page?: number, limit?: number) => Promise<CardsPage>;

export interface CardListProps {
  fetchlist: FetchFunc;
  query: string;
  activeFilter: FilterOption;
  emptyMessage: string;
}

export const FILTERS = ['All', 'Creature', 'Sorcery', 'Enchantment', 'Instant', 'Artifact', 'Land'];

export type FilterOption = (typeof FILTERS)[number];

export type ApiCard = {
  id: string;
  name: string;
  typeLine: string;
  setName: string;
  imageUris: ImageUris;
  prices: {
    usd: number;
  };
};

export type UserCard = {
  user_id: string;
  card_id: string;
  condition: string;
  for_trade: boolean;
  wishlist: boolean;
  quantity: boolean;
  Card: ApiCard;
};

export type CollectionCard = Omit<UserCard, 'Card' | 'card_id'> & MagicCard;

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

export function toMagicCard(card: ApiCard): MagicCard {
  const type = card.typeLine ?? 'Unknown';
  return {
    id: card.id,
    name: card.name,
    type,
    category: toCategory(type),
    setName: card.setName,
    imageUris: card.imageUris,
    prices: card.prices,
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
  };
}

export function toDeckCard(card: ): DeckCard {

}
