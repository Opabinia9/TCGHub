import Fastify from "fastify";
import cardController from "@/controllers/cardController.js";
import {
	cardIdParamsSchema,
	cardSearchQuerySchema,
} from "@/routes/api/v1/routeSchemas.js";
import type { CardIdParams } from "@/types/cardObject.js";
const controller = new cardController();

export default async function cardRoutes(fastify: Fastify.FastifyInstance) {
	fastify.get(
		"/",
		{ schema: { querystring: cardSearchQuerySchema } },
		controller.searchGet,
	);

	fastify.get("/sets", controller.setsGet);

	fastify.get<{ Params: CardIdParams }>(
		"/:id",
		{ schema: { params: cardIdParamsSchema } },
		controller.idGet,
	);
}
