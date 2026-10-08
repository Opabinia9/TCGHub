import type { PrismaClient } from '@prisma/client';

export default abstract class repository<BaseType> {
  abstract db: PrismaClient;
  abstract add(obj: BaseType): Promise<void>;
  abstract get(objID: string): Promise<BaseType | null>;
}
