import type {
  deckBodyInterface,
  DeckCardParams,
  DeckIdParams,
} from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { DeckCardInterface, userDecks } from '@/types/deckObject.js';
import { UserJwt, type UserJwtType } from '@/types/JWTObject.js';
import type { Deck, DeckCard } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class DecksController {
  async createDeck(request: FastifyRequest<{ Body: deckBodyInterface }>): Promise<void> {
    const { userId }: UserJwtType = UserJwt.parse(request.user);
    await facade.createDeck({
      owner_id: userId,
      deck_name: request.body.deck_name,
    });
  }

  async delDeck(request: FastifyRequest<{ Params: DeckIdParams }>): Promise<void> {
    const { userId } = UserJwt.parse(request.user);
    await facade.delDeck({
      id: request.params.id,
      owner_id: userId,
    });
  }

  async updDeck(
    request: FastifyRequest<{ Params: DeckIdParams; Body: deckBodyInterface }>,
  ): Promise<Deck | null> {
    const { userId } = UserJwt.parse(request.user);
    const { id } = request.params;
    const { deck_name } = request.body;
    const deck = await facade.getDeck({
      owner_id: userId,
      id: id,
    });

    if (!deck) {
      return null;
    } else {
      deck.deck_name = deck_name;
      return await facade.updDeck(deck);
    }
  }

  async getUserDecks(request: FastifyRequest): Promise<userDecks> {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user_id = jwt.userId;
    return await facade.getUserDecks(user_id);
  }

  async getDeck(
    request: FastifyRequest<{ Params: DeckIdParams }>,
    reply: FastifyReply,
  ): Promise<Deck | null> {
    const { userId } = UserJwt.parse(request.user);
    const deck = await facade.getDeck({
      id: request.params.id,
      owner_id: userId,
    });
    if (!deck) return reply.code(404).send({ error: 'Deck not found' });
    return deck;
  }

  async addDeckCard(
    request: FastifyRequest<{ Params: DeckCardParams; Body: DeckCardInterface }>,
    reply: FastifyReply,
  ): Promise<DeckCard | null> {
    const { userId } = UserJwt.parse(request.user);
    const { deck_id, card_id } = request.params;
    const { quantity } = request.body;
    const verify_owner = await facade.getDeck({
      id: deck_id,
      owner_id: userId,
    });

    if (!verify_owner?.id) return reply.code(404).send({ error: 'Deck not found' });

    return await facade.addDeckCard({
      deck_id: deck_id,
      card_id: card_id,
      quantity: quantity,
    });
  }

  async delDeckCard(request: FastifyRequest<{ Params: DeckCardParams }>): Promise<void> {
    const { userId } = UserJwt.parse(request.user);
    const { deck_id, card_id } = request.params;

    if (
      (await facade.getDeck({
        id: deck_id,
        owner_id: userId,
      })) !== null
    ) {
      await facade.delDeckCard({
        deck_id: deck_id,
        card_id: card_id,
      });
    }
  }

  async updDeckCard(
    request: FastifyRequest<{ Params: DeckCardParams; Body: { quantity: number } }>,
  ): Promise<DeckCard | null> {
    const { userId } = UserJwt.parse(request.user);
    const { deck_id, card_id } = request.params;
    const { quantity } = request.body;

    if (
      (await facade.getDeck({
        id: deck_id,
        owner_id: userId,
      })) !== null
    ) {
      return await facade.updDeckCard({
        deck_id: deck_id,
        card_id: card_id,
        quantity: quantity,
      });
    } else {
      return null;
    }
  }
}
