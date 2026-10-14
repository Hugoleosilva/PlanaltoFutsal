import { MembroDiretoria } from "./membro-diretoria.entity";

export interface MembroDiretoriaRepository {
  findById(id: string): Promise<MembroDiretoria | null>;
  findAllAtivos(): Promise<MembroDiretoria[]>;
  findAllSemAcesso(): Promise<MembroDiretoria[]>;
  findByContatoNaoVinculado(email?: string, whatsapp?: string): Promise<MembroDiretoria | null>;
  create(membro: MembroDiretoria): Promise<MembroDiretoria>;
  update(membro: MembroDiretoria): Promise<MembroDiretoria>;
}
