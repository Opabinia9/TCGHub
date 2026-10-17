const API_URL = "http://192.168.20.13:8080";

export type Pagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type CardsPage = {
	items: Array<MagicCard>;
	pagination: Pagination;
};

type CardsApiResponse = {
	items: Array<ApiCard>;
	pagination: Pagination;
};

export type CardCategory =
	| "Creature"
	| "Sorcery"
	| "Enchantment"
	| "Instant"
	| "Artifact"
	| "Land"
	| null;

type ImageUris = {
	art?: string | null;
	small?: string | null;
	normal?: string | null;
	large?: string | null;
	grid?: string | null;
};

export type MagicCard = {
	id: string;
	name: string;
	type: string;
	category: CardCategory;
	imageUris?: ImageUris | null;
};

type ApiCard = {
	id: string;
	name: string;
	typeLine?: string;
	imageUris?: ImageUris | null;
};

function toCategory(typeLine: string): CardCategory {
	const type = typeLine.toLowerCase();
	if (type.includes("creature")) return "Creature";
	if (type.includes("artifact")) return "Artifact";
	if (type.includes("sorcery")) return "Sorcery";
	if (type.includes("enchantment")) return "Enchantment";
	if (type.includes("instant")) return "Instant";
	if (type.includes("land")) return "Land";
	return null;
}

function toMagicCard(card: ApiCard): MagicCard {
	const type = card.typeLine ?? "Unknown";
	return {
		id: card.id,
		name: card.name,
		type,
		category: toCategory(type),
		imageUris: card.imageUris,
	};
}

export async function fetchCards(
	search: string,
	page = 1,
	limit = 20,
): Promise<CardsPage> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	if (search) {
		params.set("name", search);
	}
	const res = await fetch(`${API_URL}/api/v1/cards?${params}`);
	if (!res.ok) {
		throw new Error(`Failed to load cards (${res.status})`);
	}
	const data: CardsApiResponse = await res.json();
	return { items: data.items.map(toMagicCard), pagination: data.pagination };
}
