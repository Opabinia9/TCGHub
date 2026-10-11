import * as argon2 from 'argon2';

const hashOptions: argon2.HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 3,
  parallelism: 2,
  hashLength: 32,
};

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, hashOptions);
}

export async function verifyPassword(password: string, hash: string) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
