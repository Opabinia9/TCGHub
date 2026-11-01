import { CardSearchQuerySchema } from '@/types/cardObject.js';
import { z } from 'zod';

/** Auth Types & Interfaces */

export const AuthLoginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type AuthLoginBody = z.infer<typeof AuthLoginBodySchema>;
export const authLoginSchema = { body: AuthLoginBodySchema };

export const AuthSignupBodySchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  password: z.string(),
  username: z.string(),
});
export type AuthSignupBody = z.infer<typeof AuthSignupBodySchema>;
export const authSignupSchema = { body: AuthSignupBodySchema };

/** Card Types & Interfaces */

export const cardIdParamsSchema = z.object({
  id: z.uuid(),
});

export const cardSearchQuerySchema = CardSearchQuerySchema;

/** Collections Types & Interfaces */

export const collectionBodyInterface = z
  .object({
    card_id: z.uuid(),
    quantity: z.number().int().min(-999).max(999),
    condition: z.string().trim().min(3).max(20).optional(),
    for_trade: z.boolean(),
    wishlist: z.boolean(),
  })
  .refine((body) => !(body.for_trade && body.wishlist), {
    message: 'Card cannot be available for trade and on your wishlist',
    path: ['wishlist', 'for_trade'],
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

export const DeckCardBody = DeckCardSchema;
export type DeckCardBody = z.infer<typeof DeckCardBody>;
