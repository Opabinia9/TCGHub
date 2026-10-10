import Repository from "@/persistence/repository.js";
import { prisma } from "@/utils/prisma.js";
import type { Card, Prisma, PrismaClient } from "@prisma/client";

export type CardSummary = Omit<Card, "rawData">;

export interface CardSearchFilters {
	name?: string | undefined;
	set?: string | undefined;
	rarity?: string | undefined;
	colors?: string | undefined;
	oracleText?: string | undefined;
	typeLine?: string | undefined;
	manaCost?: string | undefined;
	cmc?: number | undefined;
	releasedAt?: string | undefined;
	prices?: number | undefined;
	legalities?: string | undefined;
	colorIdentity?: string | undefined;
	page: number;
	limit: number;
}

export default class CardRepository extends Repository<CardSummary> {
	db: PrismaClient;
	constructor() {
		super();
		this.db = prisma;
	}

	async add() {
		throw new Error(
			"Cards are not created through the API, they are loaded by scryfallSync.",
		);
	}

	async get(cardID: string): Promise<Card | null> {
		return this.db.card.findUnique({
			where: {
				id: cardID,
			},
		});
	}

	async search(filters: CardSearchFilters) {
		const where: Prisma.CardWhereInput = { lang: "en" };
		if (filters.name) {
			where.name = { contains: filters.name, mode: "insensitive" };
		}
		if (filters.set) {
			where.setCode = {
				contains: filters.set.toLowerCase(),
				mode: "insensitive",
			};
		}
		if (filters.rarity) {
			where.rarity = filters.rarity.toLowerCase();
		}
		if (filters.colors) {
			where.colors = { has: filters.colors.toUpperCase() };
		}
		if (filters.oracleText) {
			where.oracleText = { contains: filters.oracleText, mode: "insensitive" };
		}
		if (filters.typeLine) {
			where.typeLine = filters.typeLine.toLowerCase();
		}
		if (filters.manaCost) {
			where.manaCost = filters.manaCost.toLowerCase();
		}
		if (filters.cmc) {
			where.cmc = filters.cmc;
		}
		if (filters.releasedAt) {
			if (/^\d{4}$/.test(filters.releasedAt)) {
				// Regex: ^ start of string, \d digit, {4} 4 chars
				where.releasedAt = { startsWith: filters.releasedAt };
			} else {
				where.releasedAt = {
					contains: filters.releasedAt,
					mode: "insensitive",
				};
			}
		}
		if (filters.prices) {
			where.prices = {
				path: ["usd"],
				equals: filters.prices,
			};
		}
		if (filters.legalities) {
			const formatKey = filters.legalities.toLowerCase();

			where.legalities = {
				path: [formatKey],
				equals: "legal",
			};
		}
		if (filters.colorIdentity) {
			where.colorIdentity = { has: filters.colorIdentity.toUpperCase() };
		}

		const [items, total] = await this.db.$transaction([
			this.db.card.findMany({
				where,
				omit: { rawData: true },
				orderBy: [{ name: "asc" }, { id: "asc" }],
				skip: (filters.page - 1) * filters.limit,
				take: filters.limit,
			}),
			this.db.card.count({ where }),
		]);
		return { items, total };
	}

	async listSets() {
		return this.db.card.findMany({
			distinct: ["setCode"],
			select: { setCode: true, setName: true },
			orderBy: { setName: "asc" },
		});
	}
}
