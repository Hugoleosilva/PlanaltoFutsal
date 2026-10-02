import { Servico, StatusServico } from "./servico.entity";

export interface ServicoRepository {
  findById(id: string): Promise<Servico | null>;
  findByStatus(status: StatusServico): Promise<Servico[]>;
  create(servico: Servico): Promise<Servico>;
  update(servico: Servico): Promise<Servico>;
}
