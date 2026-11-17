import type { PrismaClient } from '@prisma/client';

export default abstract class Repository<BaseType> {
  abstract db: PrismaClient;
  abstract add(obj: BaseType): Promise<BaseType>;
  abstract get(objID: string, ObjID2?: string): Promise<BaseType | null>;
}
