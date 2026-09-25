import user_repository from "@persistence/user_reposistory.js";
import NotFoundError from "@errortypes/notFoundError.js";
import type { userObject } from "@persistence/types.js";

export default class facade {
  user_repo: user_repository;

  constructor() {
    this.user_repo = new user_repository();
  }

  getUserByEmail(email: string): userObject {
    const user = this.user_repo.getByAttribute("email", email);

    if (user !== null) {
      return user; 
    } else {
      throw new NotFoundError(`User Not Found`)
    }
  }
  
}
