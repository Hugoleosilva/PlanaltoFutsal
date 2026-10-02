import { FormaPagamento, Servico } from "@/core/domain/servico/servico.entity";
import { ServicoRepository } from "@/core/domain/servico/servico.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface PublicarServicoIn {
  actor: AuthenticatedActor;
  titulo: string;
  descricao: string;
  imagensUrls: string[];
  valores?: string;
  formasPagamento: FormaPagamento[];
  nomeContato: string;
  contato: string;
}

export interface PublicarServicoOut {
  servico: Servico;
}

/**
 * Só quem tem conta (qualquer role) pode divulgar um serviço — por isso o
 * assertRole aceita os 3 roles em vez de restringir a um só. Quando é a
 * própria diretoria publicando (ex: pela tela de Conteúdo do Site), o
 * serviço já nasce aprovado — sem passar pela fila de moderação, igual às
 * fotos publicadas direto pela diretoria.
 */
export class PublicarServicoUseCase implements UseCase<PublicarServicoIn, PublicarServicoOut> {
  constructor(private readonly servicoRepository: ServicoRepository) {}

  async execute(input: PublicarServicoIn): Promise<PublicarServicoOut> {
    assertRole(input.actor, ["USER", "ATLETA", "ADMIN"]);

    const publicadoPelaDiretoria = input.actor.role === "ADMIN";

    const servico = Servico.create({
      titulo: input.titulo,
      descricao: input.descricao,
      imagensUrls: input.imagensUrls,
      valores: input.valores,
      formasPagamento: input.formasPagamento,
      nomeContato: input.nomeContato,
      contato: input.contato,
      autorUserId: input.actor.id,
      status: publicadoPelaDiretoria ? "APROVADO" : "PENDENTE_APROVACAO",
      moderadoPorUserId: publicadoPelaDiretoria ? input.actor.id : null,
      moderadoEm: publicadoPelaDiretoria ? new Date() : null,
    });

    const salvo = await this.servicoRepository.create(servico);

    return { servico: salvo };
  }
}
