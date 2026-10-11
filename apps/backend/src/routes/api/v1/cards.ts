import Fastify from "fastify";
import cardController from "@controllers/cardController.js";
import { cardFilterSchema } from "./routeschemas.js";

export default async function authRoutes(
	fastify: Fastify.FastifyInstance,
	options: object,
) {
	const controller = new cardController();

	fastify.get(
		"/protected",
		{ preHandler: [fastify.jwt_verify] },
		controller.protectedGet,
	);
}
