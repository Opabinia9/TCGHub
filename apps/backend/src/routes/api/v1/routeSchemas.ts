import { DeckCardInterfaceSchema } from '@/types/deckObject.js';
import { z } from 'zod';

/** Auth Types & Interfaces */

export interface AuthLoginBody {
  email: string;
  password: string;
}
export const authLoginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: { type: 'string' },
    },
  },
};

export interface AuthSignupBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
}
export const authSignupSchema = {
  body: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password', 'username'],
    additionalProperties: false,
    properties: {
      first_name: { type: 'string' },
      last_name: { type: 'string' },
      email: {
        type: 'string',
        format: 'email',
      },
      password: { type: 'string' },
      username: { type: 'string' },
    },
  },
};

/** Card Types & Interfaces */

export const cardIdParamsSchema = z.object({
  id: z.uuid(),
});

export const cardSearchQuerySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    set: { type: 'string', minLength: 1 },
    rarity: { type: 'string', minLength: 1 },
    colors: { type: 'string', minLength: 1 },
    oracleText: { type: 'string', minLength: 1 },
    typeLine: { type: 'string', minLength: 1 },
    manaCost: { type: 'string', minLength: 1 },
    cmc: { type: 'number', minimum: 0 },
    releasedAt: { type: 'string', minLength: 1 },
    prices: { type: 'number', minimum: 0 },
    legalities: { type: 'string', minLength: 1 },
    colorIdentity: { type: 'string', minLength: 1 },
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
  },
};

/** Collections Types & Interfaces */

export const collectionBodyInterface = z.object({
  card_id: z.uuid(),
  quantity: z.number().int().min(-999).max(999),
  condition: z.string().trim().min(3).max(20),
  for_trade: z.boolean(),
  wishlist: z.boolean(),
});

export type CollectionBody = z.infer<typeof collectionBodyInterface>;

/** Deck Types & Interfaces */

export type DeckIdParams = z.infer<typeof deckIdParamsSchema>;

export const deckIdParamsSchema = z.object({
  deck_id: z.uuid(),
});

export const DeckBodySchema = z.object({
  deck_name: z.string().trim().min(1).max(100),
});

export type DeckBody = z.infer<typeof DeckBodySchema>;

/** DeckCard Types & Interfaces */

export const deckCardParamsSchema = z.object({
  deck_id: z.uuid(),
  card_id: z.uuid(),
});

export type DeckCardParams = z.infer<typeof deckCardParamsSchema>;

export const DeckCardSchema = z.object({
  quantity: z.number().int().min(-999).max(999),
});

export const DeckCardBody = DeckCardInterfaceSchema;
export type DeckCardBody = z.infer<typeof DeckCardBody>;
