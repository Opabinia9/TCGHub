import userRepository from '@/persistence/userReposistory.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface } from '@/types/userObject.js';
import type { User } from '@prisma/client';
import { hashPassword } from '@/utils/hashing.js';
import type { AuthSignupBody } from '@/routes/api/v1/routeSchemas.js';

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
  async createUser(signupData: AuthSignupBody): Promise<void> {
    const { password, ...include } = signupData;
    const hash = await hashPassword(signupData.password);
    const userData: UserCreationInterface = { ...include, hash: hash };
    this.user_repo.add(userData);
  }
}
