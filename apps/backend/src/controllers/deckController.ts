import NotFoundError from '@/errortypes/NotFoundError.js';
import type {
  DeckBody,
  DeckCardBody,
  DeckCardParams,
  DeckIdParams,
} from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import { UserJwt } from '@/types/JWTObject.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

/** Deck API Endpoint Class */
export default class DecksController {
  /** decks/ POST */
  async createDeck(
    request: FastifyRequest<{ Body: DeckBody }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      const deck = await facade.createDeck({
        owner_id: userId,
        deck_name: request.body.deck_name,
      });
      return reply.code(201).send(deck);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // Might need to be dropped
        return reply.code(404).send({ error: 'Could not create deck' });
      } else {
        throw error;
      }
    }
  }

  async delDeck(
    request: FastifyRequest<{ Params: DeckIdParams }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      await facade.delDeck({
        id: request.params.deck_id,
        owner_id: userId,
      });
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: 'Deck not found' });
      } else {
        throw error;
      }
    }
  }

  async updDeck(
    request: FastifyRequest<{ Params: DeckIdParams; Body: DeckBody }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      const { deck_id } = request.params;
      const { deck_name } = request.body;
      return reply.code(200).send(
        await facade.updDeck({
          id: deck_id,
          owner_id: userId,
          deck_name: deck_name,
        }),
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: 'Deck not found' });
      } else {
        throw error;
      }
    }
  }

  async getUserDecks(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    return reply.code(200).send(await facade.getUserDecks(userId));
  }

  async getDeck(
    request: FastifyRequest<{ Params: DeckIdParams }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      return reply.code(200).send(
        await facade.getDeck({
          id: request.params.deck_id,
          owner_id: userId,
        }),
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: 'Deck not found' });
      } else {
        throw error;
      }
    }
  }

  async addDeckCard(
    request: FastifyRequest<{
      Params: DeckCardParams;
      Body: DeckCardBody;
    }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      const { deck_id, card_id } = request.params;
      const { quantity } = request.body;
      return reply.code(201).send(
        await facade.addDeckCard(userId, {
          deck_id: deck_id,
          card_id: card_id,
          quantity: quantity,
        }),
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: 'Card not found' });
      } else {
        throw error;
      }
    }
  }

  async updDeckCard(
    request: FastifyRequest<{
      Params: DeckCardParams;
      Body: DeckCardBody;
    }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      const { deck_id, card_id } = request.params;
      const { quantity } = request.body;
      return reply.code(200).send(
        await facade.updDeckCard(userId, {
          deck_id: deck_id,
          card_id: card_id,
          quantity: quantity,
        }),
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: 'Card not found' });
      } else {
        throw error;
      }
    }
  }

  async delDeckCard(
    request: FastifyRequest<{ Params: DeckCardParams }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { userId } = UserJwt.parse(request.user);
    try {
      const { deck_id, card_id } = request.params;
      await facade.delDeckCard(userId, {
        deck_id: deck_id,
        card_id: card_id,
      });
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: 'Card not found' });
      } else {
        throw error;
      }
    }
  }
}
