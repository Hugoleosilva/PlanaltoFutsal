import { Servico, StatusServico } from "@/core/domain/servico/servico.entity";
import { ServicoRepository } from "@/core/domain/servico/servico.repository";

export class FakeServicoRepository implements ServicoRepository {
  private readonly servicos = new Map<string, Servico>();

  async findById(id: string): Promise<Servico | null> {
    return this.servicos.get(id) ?? null;
  }

  async findByStatus(status: StatusServico): Promise<Servico[]> {
    return [...this.servicos.values()].filter((servico) => servico.status === status);
  }

  async create(servico: Servico): Promise<Servico> {
    this.servicos.set(servico.id, servico);
    return servico;
  }

  async update(servico: Servico): Promise<Servico> {
    this.servicos.set(servico.id, servico);
    return servico;
  }
}
