import repository from "@persistence/reposistory.js";
import type { userObject } from "@persistence/types.js";

export default class user_repository extends repository {
  __storage: Array<userObject>;
  constructor() {
    super();
    this.__storage = [
      { name: "user1", email: "user1@email.com", password: "onetwothree"  },
      { name: "user2", email: "user2@email.com", password: "twothreeone"  },
      { name: "user3", email: "user3@email.com", password: "threeonetwo"  }
    ];
  }
  getByAttribute(attribute: keyof userObject, value: string) {
    for (const x of this.__storage) {
      if (x[attribute] === value) {
        return x;
      }
    }
    return null;
  }
}
