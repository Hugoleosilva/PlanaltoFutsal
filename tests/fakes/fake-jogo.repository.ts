import { Jogo } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";

export class FakeJogoRepository implements JogoRepository {
  private readonly jogos = new Map<string, Jogo>();

  async findById(id: string): Promise<Jogo | null> {
    return this.jogos.get(id) ?? null;
  }

  async findProximos(): Promise<Jogo[]> {
    return [...this.jogos.values()].filter((jogo) => jogo.status === "AGENDADO");
  }

  async findAll(): Promise<Jogo[]> {
    return [...this.jogos.values()];
  }

  async create(jogo: Jogo): Promise<Jogo> {
    this.jogos.set(jogo.id, jogo);
    return jogo;
  }

  async update(jogo: Jogo): Promise<Jogo> {
    this.jogos.set(jogo.id, jogo);
    return jogo;
  }

  async delete(id: string): Promise<void> {
    this.jogos.delete(id);
  }
}
