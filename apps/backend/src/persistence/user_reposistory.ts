import repository from '@persistence/reposistory.js';
import User from '../models/user.js';

export default class user_repository extends repository<User> {
  constructor() {
    super();
    this.__storage = [
      { name: "user1", email: "user1@email.com", password: "onetwothree"  },
      { name: "user2", email: "user2@email.com", password: "twothreeone"  },
      { name: "user3", email: "user3@email.com", password: "threeonetwo"  }
    ];
  }
  getByAttribute(attribute: keyof User, value: string): User | null {
    for (const x of Object.values(this.__storage)) {
      if (x[attribute] === value) {
        return x;
      }
    }
    return null;
  }
}
