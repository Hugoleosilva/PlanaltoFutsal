import { User } from "./user.entity";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByWhatsapp(whatsapp: string): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  countAll(): Promise<number>;
  countSocios(): Promise<number>;
  findSocios(): Promise<User[]>;
}
