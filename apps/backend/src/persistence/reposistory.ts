import type BaseModel from '../models/baseclass.js';

export default class repository<BaseType extends BaseModel> {
  __storage: Record<string, BaseType>;

  constructor() {
    this.__storage = {};
  }

  add(obj: BaseType): void {
    this.__storage[obj.id] = obj;
  }

  get(id: string): BaseType | null {
    return this.__storage[id] ?? null;
  }
}
