import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";

export class FakeAtletaRepository implements AtletaRepository {
  private readonly atletas = new Map<string, Atleta>();

  async findById(id: string): Promise<Atleta | null> {
    return this.atletas.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Atleta | null> {
    return [...this.atletas.values()].find((atleta) => atleta.userId === userId) ?? null;
  }

  async findAllAtivos(): Promise<Atleta[]> {
    return [...this.atletas.values()].filter((atleta) => atleta.status === "ATIVO");
  }

  async findAllSemAcesso(): Promise<Atleta[]> {
    return [...this.atletas.values()].filter(
      (atleta) => atleta.status === "ATIVO" && !atleta.userId,
    );
  }

  async findByContatoNaoVinculado(email?: string, whatsapp?: string): Promise<Atleta | null> {
    if (!email && !whatsapp) return null;

    return (
      [...this.atletas.values()].find(
        (atleta) =>
          !atleta.userId &&
          ((email && atleta.contatoEmail?.toLowerCase() === email.toLowerCase()) ||
            (whatsapp && atleta.contatoWhatsapp === whatsapp)),
      ) ?? null
    );
  }

  async create(atleta: Atleta): Promise<Atleta> {
    this.atletas.set(atleta.id, atleta);
    return atleta;
  }

  async update(atleta: Atleta): Promise<Atleta> {
    this.atletas.set(atleta.id, atleta);
    return atleta;
  }
}
