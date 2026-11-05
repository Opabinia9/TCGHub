import type { Prisma } from '@prisma/client';
import { z } from 'zod';

export const UuidSchema = z.uuid();
export const QuantitySchema = z.number().int().min(1).max(999);
export const DeckNameSchema = z.string().trim().min(1).max(100);

export const DeckSchema = z.object({
  id: UuidSchema,
  owner_id: UuidSchema,
  deck_name: DeckNameSchema,
});

export const DeckCardSchema = z.object({
  deck_id: UuidSchema,
  card_id: UuidSchema,
  quantity: QuantitySchema,
});

export const DeckCardInterfaceSchema = DeckCardSchema.omit({
  deck_id: true,
  card_id: true,
});

export const DeckCreationInterfaceSchema = DeckSchema.omit({ id: true });

export const DeckRefSchema = DeckSchema.omit({ deck_name: true });

export const UserDecksSchema = z.array(DeckSchema);

export type Deck = z.infer<typeof DeckSchema>;
export type DeckCard = z.infer<typeof DeckCardSchema>;
export type DeckCardInterface = z.infer<typeof DeckCardInterfaceSchema>;
export type DeckCreationInterface = z.infer<typeof DeckCreationInterfaceSchema>;
export type DeckRef = z.infer<typeof DeckRefSchema>;
export type UserDecks = z.infer<typeof UserDecksSchema>;

export const deckWithDeckCards = {
  include: {
    Card: true,
  },
} satisfies Prisma.DeckCardDefaultArgs;

export type DeckCards = {
  items: Array<Prisma.DeckCardGetPayload<typeof deckWithDeckCards>>;
  total: number;
};
