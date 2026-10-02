import { TipoPlanoSocio, User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { ContribuicaoSocio } from "@/core/domain/socio/contribuicao-socio.entity";
import { ContribuicaoSocioRepository } from "@/core/domain/socio/contribuicao-socio.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { NotFoundError, ValidationException, ValidationError } from "@/infrastructure/errors";

export interface TornarSocioIn {
  actor: AuthenticatedActor;
  tipo: TipoPlanoSocio;
  valor: number;
  diaVencimento?: number | null;
}

export interface TornarSocioOut {
  user: User;
  contribuicao: ContribuicaoSocio;
}

function referenciaDoMes(data: Date): string {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Qualquer usuário autenticado pode virar sócio (Planalto Meu Amor!) a partir
 * do próprio perfil, escolhendo um plano mensal ou um aporte único. Vantagens
 * de sócio (descontos, sorteios) ficam pra uma etapa futura — aqui nasce o
 * status + a primeira contribuição, já pendente de pagamento via Pix. Como o
 * Pix aqui é só chave/QR estático (sem gateway), não existe cobrança
 * automática: um diretor confirma manualmente quando o valor cai na conta.
 */
export class TornarSocioUseCase implements UseCase<TornarSocioIn, TornarSocioOut> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contribuicaoRepository: ContribuicaoSocioRepository,
  ) {}

  async execute(input: TornarSocioIn): Promise<TornarSocioOut> {
    assertRole(input.actor, ["USER", "ATLETA", "ADMIN"]);

    if (input.valor <= 0) {
      throw new ValidationException([new ValidationError("valor")]);
    }

    const user = await this.userRepository.findById(input.actor.id);
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const diaVencimento =
      input.tipo === "MENSAL" ? Math.min(28, Math.max(1, input.diaVencimento ?? 5)) : null;

    const atualizado = await this.userRepository.update(
      user.tornarSocio({ tipo: input.tipo, valor: input.valor, diaVencimento }),
    );

    const agora = new Date();
    const referencia = input.tipo === "MENSAL" ? referenciaDoMes(agora) : `UNICO-${agora.getTime()}`;

    const existente =
      input.tipo === "MENSAL"
        ? await this.contribuicaoRepository.findByReferenciaUsuario(user.id, referencia)
        : null;

    const contribuicao =
      existente ??
      (await this.contribuicaoRepository.create(
        ContribuicaoSocio.create({
          userId: user.id,
          tipo: input.tipo,
          referencia,
          valor: input.valor,
          status: "PENDENTE",
          dataVencimento: agora,
        }),
      ));

    return { user: atualizado, contribuicao };
  }
}
