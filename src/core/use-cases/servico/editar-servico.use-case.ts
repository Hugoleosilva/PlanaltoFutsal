import { FormaPagamento, Servico } from "@/core/domain/servico/servico.entity";
import { ServicoRepository } from "@/core/domain/servico/servico.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface EditarServicoIn {
  actor: AuthenticatedActor;
  servicoId: string;
  titulo: string;
  descricao: string;
  imagensUrls: string[];
  valores?: string;
  formasPagamento: FormaPagamento[];
  nomeContato: string;
  contato: string;
}

export interface EditarServicoOut {
  servico: Servico;
}

export class EditarServicoUseCase implements UseCase<EditarServicoIn, EditarServicoOut> {
  constructor(private readonly servicoRepository: ServicoRepository) {}

  async execute(input: EditarServicoIn): Promise<EditarServicoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const servico = await this.servicoRepository.findById(input.servicoId);
    if (!servico) throw new NotFoundError("Serviço não encontrado.");

    const editado = servico.editar({
      titulo: input.titulo,
      descricao: input.descricao,
      imagensUrls: input.imagensUrls,
      valores: input.valores,
      formasPagamento: input.formasPagamento,
      nomeContato: input.nomeContato,
      contato: input.contato,
    });

    const salvo = await this.servicoRepository.update(editado);

    return { servico: salvo };
  }
}
