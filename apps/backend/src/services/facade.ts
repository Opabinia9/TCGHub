import user_repository from "@persistence/userRepository.js";
import CardRepository from "@persistence/cardRepository.js";
import NotFoundError from "@errortypes/notFoundError.js";
import type { cardSearchQuery } from "@/types/cardObjects.js";
import type { UserCreationInterface } from "@/types/userObject.js";
import type { User, Card } from "@prisma/client";

export default class Facade {
	getUserByusername(arg0: string): any {
		throw new Error("Method not implemented.");
	}
	user_repo: user_repository;
	card_repo: CardRepository;

	constructor() {
		this.user_repo = new user_repository();
		this.card_repo = new CardRepository();
	}

	/** User functions  */

	async getUserByEmail(email: string): Promise<User> {
		const user = await this.user_repo.getUserByEmail(email);

		if (user !== null) {
			return user;
		} else {
			throw new NotFoundError(`User Not Found`);
		}
	}

	async getUserByUsername(username: string): Promise<User> {
		const user = await this.user_repo.getUserByUsername(username);

		if (user !== null) {
			return user;
		} else {
			throw new NotFoundError(`User Not Found`);
		}
	}

	async createUser(userData: UserCreationInterface): Promise<void> {
		this.user_repo.add(userData);
	}

	/**  Card Functions */

	async getCard(id: string): Promise<Card> {
		const card = await this.card_repo.get(id);
		if (card === null) {
			throw new NotFoundError("Card not Found");
		}
		return card;
	}

	async searchCards(filters: cardSearchQuery) {
		return this.card_repo.search(filters);
	}

	async listSets() {
		return this.card_repo.listSets();
	}
}
