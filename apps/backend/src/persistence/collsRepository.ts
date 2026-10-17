import NotFoundError from "@/errortypes/NotFoundError.js";
import Repository from "@/persistence/reposistory.js";
import { prisma } from "@/utils/prisma.js";
import type { Card, Prisma, PrismaClient } from "@prisma/client";
import type { CardSearchFilters } from "@/types/cardObject.js";

export type CardSummary = Omit<Card, "rawData">;

export default class CardRepository extends Repository<CardSummary> {
	db: PrismaClient;
	constructor() {
		super();
		this.db = prisma;
	}

	async add() {
		throw NotFoundError;
	}

	async get(cardID: string): Promise<CardSummary | null> {
		return this.db.card.findUnique({
			where: {
				id: cardID,
			},
			omit: { rawData: true },
		});
	}
}
