import { ContribuicaoSocio } from "./contribuicao-socio.entity";

export interface ContribuicaoSocioRepository {
  findById(id: string): Promise<ContribuicaoSocio | null>;
  findPendentePorUsuario(userId: string): Promise<ContribuicaoSocio | null>;
  findByReferenciaUsuario(userId: string, referencia: string): Promise<ContribuicaoSocio | null>;
  findAll(): Promise<ContribuicaoSocio[]>;
  create(contribuicao: ContribuicaoSocio): Promise<ContribuicaoSocio>;
  update(contribuicao: ContribuicaoSocio): Promise<ContribuicaoSocio>;
}
