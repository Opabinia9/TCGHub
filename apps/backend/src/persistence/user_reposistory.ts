import repository from '@persistence/reposistory.js';
import User from '../models/user.js';

export default class user_repository extends repository<User> {
  constructor() {
    super();
    const u = new User('seb', 'price', 'seb.price@gmail.com', 'password');
    this.add(u);
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
