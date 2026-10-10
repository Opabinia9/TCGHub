import user_repository from "@persistence/user_repository.js";
import NotFoundError from "@errortypes/notFoundError.js";
import type { UserCreationInterface } from "@/types/userObject.js";
import type { User } from "@prisma/client";

export default class Facade {
	getUserByusername(arg0: string): any {
		throw new Error("Method not implemented.");
	}
	user_repo: user_repository;

	constructor() {
		this.user_repo = new user_repository();
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

	/**
	 *
	 */
	async createUser(userData: UserCreationInterface): Promise<void> {
		this.user_repo.add(userData);
	}
}
