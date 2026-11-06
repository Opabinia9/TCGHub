import type { ChatWithMembersCreationInterface } from '@/types/chatObject.js';
import { ChatType } from '@prisma/client';
import { CardSearchQuerySchema } from '@/types/cardObject.js';
import { z } from 'zod';

// TODO: maybe rename? is schema still right, note: this is my own thoughts ignore them, get out of my head
/** Auth Types & Interfaces */

export const AuthLoginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type AuthLoginBody = z.infer<typeof AuthLoginBodySchema>;
export const authLoginSchema = { body: AuthLoginBodySchema };

export const AuthSignupBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  username: z.string(),
});
export type AuthSignupBody = z.infer<typeof AuthSignupBodySchema>;
export const authSignupSchema = { body: AuthSignupBodySchema };

/** Chat Types & Interfaces */

export const chatParamsSchema = z.object({
  chatId: z.string(),
});
export type ChatParamsInterface = z.infer<typeof chatParamsSchema>;

export const chatPostMessageBodySchema = z.object({
  body: z.string(),
});
export type ChatPostMessageBodyInterface = z.infer<typeof chatPostMessageBodySchema>;

export const chatCreationBodySchema = z.discriminatedUnion('type', [
  z.object({
    title: z.string(),
    type: z.enum([ChatType.TRADE]),
    seller_id: z.uuid(),
    card_id: z.uuid(),
    members: z.array(z.uuid()).min(1),
  }),
  z.object({
    title: z.string(),
    type: z.enum([ChatType.DIRECT, ChatType.GROUP]),
    members: z.array(z.uuid()).min(1),
  }),
]);

export type ChatCreationBodyInterface = z.infer<typeof chatCreationBodySchema>;

/** Card Types & Interfaces */

export const UserIdParamsSchema = z.object({
  userId: z.string(),
});
export type UserIdParamsInterface = z.infer<typeof UserIdParamsSchema>;

export const cardSearchQuerySchema = CardSearchQuerySchema;

export const cardIdParamsSchema = z.object({
  id: z.uuid(),
});

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
