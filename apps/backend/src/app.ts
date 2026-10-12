import Fastify from "fastify";
import fastify_jwt from "@fastify/jwt";
import authRoutes from "@/routes/api/v1/auth.js";
import cardRoutes from "@/routes/api/v1/cards.js";
import registerJwtDecorator from "@decorators/jwtDecorator.js";

export default function buildServer(opts = {}) {
	const server: Fastify.FastifyInstance = Fastify(opts);

	registerJwtDecorator(server);

	server.register(fastify_jwt, { secret: "supersecrets" });
	server.register(authRoutes, { prefix: "/api/v1/auth" });
	server.register(cardRoutes, { prefix: "/api/v1/cards" });

	return server;
}
