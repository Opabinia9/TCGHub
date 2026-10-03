import user_repository from "@persistence/user_reposistory.js";
import NotFoundError from "@errortypes/notFoundError.js";
import User from '../models/user.js';
import type { UserCreationInterface } from '../types/userObject.js';

export default class facade {
  user_repo: user_repository;

  constructor() {
    this.user_repo = new user_repository();
  }

  /** User functions  */

  getUserByEmail(email: string): User {
    const user = this.user_repo.getByAttribute('email', email);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`)
    }
  }
  
}
