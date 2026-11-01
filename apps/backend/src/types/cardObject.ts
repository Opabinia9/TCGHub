import type { Card } from '@prisma/client';
import { z } from 'zod';

export const CardSearchFiltersSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(200).optional(),
  set: z.string().trim().min(1).max(10).optional(),
  rarity: z.string().trim().min(1).max(20).optional(),
  colors: z.string().trim().min(1).max(20).optional(),
  oracleText: z.string().trim().min(1).max(500).optional(),
  typeLine: z.string().trim().min(1).max(200).optional(),
  manaCost: z.string().trim().min(1).max(50).optional(),
  cmc: z.coerce.number().min(0).max(1000).optional(),
  releasedAt: z.string().trim().min(1).max(30).optional(),
  prices: z.coerce.number().min(0).optional(),
  legalities: z.string().trim().min(1).max(50).optional(),
  colorIdentity: z.string().trim().min(1).max(20).optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const CardIdParamsSchema = z.object({
  id: z.uuid(),
});

export const CardSearchQuerySchema = CardSearchFiltersSchema;

export type CardSearchFilters = z.infer<typeof CardSearchFiltersSchema>;
export type CardIdParams = z.infer<typeof CardIdParamsSchema>;
export type CardSearchQuery = z.infer<typeof CardSearchQuerySchema>;
export type CardSummary = Omit<Card, 'rawData'>;
