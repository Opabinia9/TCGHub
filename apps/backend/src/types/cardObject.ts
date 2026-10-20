import type { Card } from '@prisma/client';
export interface CardSearchFilters {
  name?: string | undefined;
  set?: string | undefined;
  rarity?: string | undefined;
  colors?: string | undefined;
  oracleText?: string | undefined;
  typeLine?: string | undefined;
  manaCost?: string | undefined;
  cmc?: number | undefined;
  releasedAt?: string | undefined;
  prices?: number | undefined;
  legalities?: string | undefined;
  colorIdentity?: string | undefined;
  page: number;
  limit: number;
}
export type CardIdParams = { id: string };
export type CardSearchQuery = CardSearchFilters;
export type CardSummary = Omit<Card, 'rawData'>;
