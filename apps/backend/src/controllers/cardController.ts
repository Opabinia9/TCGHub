import Facade from "@/services/facade.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { cardSearchQuery } from "@/types/cardObjects.js";

const facade = new Facade();

export default class cardController {
	async searchGet(
		request: FastifyRequest<{ Querystring: cardSearchQuery }>,
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
}
