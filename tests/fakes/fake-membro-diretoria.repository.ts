import { MembroDiretoria } from "@/core/domain/diretoria/membro-diretoria.entity";
import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";

export class FakeMembroDiretoriaRepository implements MembroDiretoriaRepository {
  private readonly membros = new Map<string, MembroDiretoria>();

  async findById(id: string): Promise<MembroDiretoria | null> {
    return this.membros.get(id) ?? null;
  }

  async findAllAtivos(): Promise<MembroDiretoria[]> {
    return [...this.membros.values()].filter((membro) => membro.status === "ATIVO");
  }

  async findAllSemAcesso(): Promise<MembroDiretoria[]> {
    return [...this.membros.values()].filter(
      (membro) => membro.status === "ATIVO" && !membro.userId,
    );
  }

  async findByContatoNaoVinculado(email?: string, whatsapp?: string): Promise<MembroDiretoria | null> {
    if (!email && !whatsapp) return null;

    return (
      [...this.membros.values()].find(
        (membro) =>
          !membro.userId &&
          ((email && membro.contatoEmail?.toLowerCase() === email.toLowerCase()) ||
            (whatsapp && membro.contato === whatsapp)),
      ) ?? null
    );
  }

  async create(membro: MembroDiretoria): Promise<MembroDiretoria> {
    this.membros.set(membro.id, membro);
    return membro;
  }

  async update(membro: MembroDiretoria): Promise<MembroDiretoria> {
    this.membros.set(membro.id, membro);
    return membro;
  }
}
