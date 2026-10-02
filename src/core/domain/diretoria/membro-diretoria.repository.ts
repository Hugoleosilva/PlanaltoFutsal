import { MembroDiretoria } from "./membro-diretoria.entity";

export interface MembroDiretoriaRepository {
  findById(id: string): Promise<MembroDiretoria | null>;
  findAllAtivos(): Promise<MembroDiretoria[]>;
  create(membro: MembroDiretoria): Promise<MembroDiretoria>;
  update(membro: MembroDiretoria): Promise<MembroDiretoria>;
}
