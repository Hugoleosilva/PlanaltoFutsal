import { compare, hash } from "bcrypt";
import { CryptoProvider } from "@/core/domain/usuario";

const BCRYPT_SALT_ROUNDS = 12;

export class BcryptCryptoProvider implements CryptoProvider {
  async encrypt(password: string): Promise<string> {
    return hash(password, BCRYPT_SALT_ROUNDS);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
