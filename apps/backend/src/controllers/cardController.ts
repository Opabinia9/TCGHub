import Facade from "@/services/facade.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { CardSearchQuery, CardIdParams } from "@/types/cardObject.js";

const facade = new Facade();

export default class CardController {
	async searchGet(
		request: FastifyRequest<{ Querystring: CardSearchQuery }>,
		reply: FastifyReply,
	) {
		const filters = request.query;
		const { items, total } = await facade.searchCards(filters);

		return reply.code(200).send({
			items,
			pagination: {
				page: filters.page,
				limit: filters.limit,
				total,
				totalPages: Math.ceil(total / filters.limit),
			},
		});
	}

	async setsGet(_request: FastifyRequest, reply: FastifyReply) {
		const sets = await facade.listSets();
		return reply.code(200).send(sets);
	}

	async idGet(
		request: FastifyRequest<{ Params: CardIdParams }>,
		reply: FastifyReply,
	) {
		const card = await facade.searchId(request.params.id);
		return reply.code(200).send(card);
	}
}
