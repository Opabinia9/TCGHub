import { ENV } from "../src/utils/env.js";
import { LightMyRequestResponse } from "fastify";
import buildServer from "../src/app.js";
import { describe, it, expect } from "vitest";

const server = await buildServer({}, ENV);

describe("GET /api/v1/cards/:id", () => {
	it("returns a card by id", async () => {
		const response: LightMyRequestResponse = await server.inject({
			method: "get",
			url: "/api/v1/cards?page=1&limit=1",
		});
		const response_id = response.json().items[0].id;
		const lookup: LightMyRequestResponse = await server.inject({
			method: "get",
			url: `/api/v1/cards/${response_id}`,
		});
		const lookup_payload = lookup.json();
		expect(lookup.statusCode).toBe(200);
		expect(lookup_payload.id).toBe(response_id);
		expect(lookup_payload).toHaveProperty("name");
		expect(lookup_payload).not.toHaveProperty("rawData");
	});
});

describe("GET /api/v1/cards?page=1&limit=20", () => {
	it("returns a list of cards", async () => {
		const response: LightMyRequestResponse = await server.inject({
			method: "get",
			url: "/api/v1/cards?page=1&limit=20",
		});
		const payload = response.json().items;
		expect(response.statusCode).toBe(200);
		expect(payload[0]).toHaveProperty("name");
		expect(payload[0]).not.toHaveProperty("rawData");
		expect(payload[payload.length - 1]).toHaveProperty("name");
		expect(payload[payload.length - 1]).not.toHaveProperty("rawData");
	});
});
