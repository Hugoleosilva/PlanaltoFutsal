import { Atleta } from "./atleta.entity";

export interface AtletaRepository {
  findById(id: string): Promise<Atleta | null>;
  findByUserId(userId: string): Promise<Atleta | null>;
  findAllAtivos(): Promise<Atleta[]>;
  findAllSemAcesso(): Promise<Atleta[]>;
  /** Atleta sem login ainda vinculado cujo contato bate com o e-mail/whatsapp informado. */
  findByContatoNaoVinculado(email?: string, whatsapp?: string): Promise<Atleta | null>;
  create(atleta: Atleta): Promise<Atleta>;
  update(atleta: Atleta): Promise<Atleta>;
}
