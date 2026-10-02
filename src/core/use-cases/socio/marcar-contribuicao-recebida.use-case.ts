import { MovimentacaoFinanceira } from "@/core/domain/financeiro/movimentacao-financeira.entity";
import { MovimentacaoFinanceiraRepository } from "@/core/domain/financeiro/movimentacao-financeira.repository";
import { ContribuicaoSocioRepository } from "@/core/domain/socio/contribuicao-socio.repository";
import { UserRepository } from "@/core/domain/user/user.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { NotFoundError } from "@/infrastructure/errors";

export interface MarcarContribuicaoRecebidaIn {
  actor: AuthenticatedActor;
  contribuicaoId: string;
}

export interface MarcarContribuicaoRecebidaOut {
  contribuicaoId: string;
}

/**
 * Como o Pix aqui é só chave/QR estático (sem gateway de pagamento), a
 * confirmação de que o dinheiro caiu na conta é sempre manual — um diretor
 * confere e marca a contribuição como recebida. Isso já lança a receita
 * correspondente no Financeiro (origem: Apoiadores), fechando o ciclo.
 */
export class MarcarContribuicaoRecebidaUseCase
  implements UseCase<MarcarContribuicaoRecebidaIn, MarcarContribuicaoRecebidaOut>
{
  constructor(
    private readonly contribuicaoRepository: ContribuicaoSocioRepository,
    private readonly userRepository: UserRepository,
    private readonly movimentacaoRepository: MovimentacaoFinanceiraRepository,
  ) {}

  async execute(input: MarcarContribuicaoRecebidaIn): Promise<MarcarContribuicaoRecebidaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const contribuicao = await this.contribuicaoRepository.findById(input.contribuicaoId);
    if (!contribuicao) throw new NotFoundError("Contribuição não encontrada.");
    if (!contribuicao.isPendente) return { contribuicaoId: contribuicao.id };

    const socio = await this.userRepository.findById(contribuicao.userId);
    if (!socio) throw new NotFoundError("Sócio não encontrado.");

    const movimentacao = await this.movimentacaoRepository.create(
      MovimentacaoFinanceira.create({
        tipo: "RECEITA",
        descricao: `Contribuição de sócio — ${socio.name}`,
        valor: contribuicao.valor,
        data: new Date(),
        origemReceita: "APOIADORES",
        registradoPorUserId: input.actor.id,
      }),
    );

    await this.contribuicaoRepository.update(contribuicao.marcarComoPago(movimentacao.id));

    return { contribuicaoId: contribuicao.id };
  }
}
