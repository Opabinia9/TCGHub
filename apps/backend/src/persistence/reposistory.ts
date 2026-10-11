import type { PrismaClient } from '@prisma/client';

export default abstract class Repository<BaseType> {
  abstract db: PrismaClient;
  abstract add(obj: BaseType): Promise<void>;
  // currently unused, so commend out, but may be usefull infuture
  // abstract get(objID: string): Promise<BaseType | null>;
}
