import type {
  deckBodyInterface,
  DeckIdParams,
  userDecks,
} from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import { UserJwt, type UserJwtType } from '@/types/JWTObject.js';
import type { Deck } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class DecksController {
  async createDeck(
    request: FastifyRequest<{ Body: deckBodyInterface }>,
  ): Promise<void> {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user_id = jwt.userId;
    await facade.createDeck({
      owner_id: user_id,
      deck_name: request.body.deck_name,
    });
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
    const deck = await facade.getDeck(userId, request.params.id);
    if (!deck) return reply.code(404).send({ error: 'Deck not found' });
    return deck;
  }
}
