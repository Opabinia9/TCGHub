import userRepository from '@/persistence/userReposistory.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface } from '@/types/userObject.js';
import type { User } from '@prisma/client';

export default class Facade {
  user_repo: userRepository;

  constructor() {
    this.user_repo = new userRepository();
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
