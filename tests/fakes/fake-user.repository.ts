import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";

export class FakeUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return [...this.users.values()].find((user) => user.email === email) ?? null;
  }

  async findByWhatsapp(whatsapp: string): Promise<User | null> {
    const digitos = whatsapp.replace(/\D/g, "");
    return (
      [...this.users.values()].find((user) => (user.whatsapp ?? "").replace(/\D/g, "") === digitos) ??
      null
    );
  }

  async findByName(name: string): Promise<User | null> {
    const nomeNormalizado = name.trim().toLowerCase();
    return (
      [...this.users.values()].find((user) => user.name.toLowerCase() === nomeNormalizado) ?? null
    );
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async countAll(): Promise<number> {
    return this.users.size;
  }

  async countSocios(): Promise<number> {
    return [...this.users.values()].filter((user) => user.isSocio).length;
  }

  async findSocios(): Promise<User[]> {
    return [...this.users.values()].filter((user) => user.isSocio);
  }
}
