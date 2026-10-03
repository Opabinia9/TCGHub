import { v7 as uuidv7 } from 'uuid';

export default class BaseModel {
  id: string;
  created_at: number;
  updated_at: number;

  constructor() {
    this.id = uuidv7();
    this.created_at = Date.now();
    this.updated_at = Date.now();
  }
}
