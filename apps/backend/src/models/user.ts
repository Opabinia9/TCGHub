import BaseModel from './baseclass.js';
import type { UserInterface } from '../types/userObject.js';

export default class User extends BaseModel implements UserInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;

  constructor(first_name: string, last_name: string, email: string, password: string) {
    super();
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
  }
}
