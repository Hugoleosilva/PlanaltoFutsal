import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface PromoverUsuarioParaAtletaIn {
  actor: AuthenticatedActor;
  userEmail: string;
  atletaId: string;
}

export interface PromoverUsuarioParaAtletaOut {
  user: User;
  atleta: Atleta;
}

/**
 * Caso "Cicrano": um torcedor (role USER) que já tem conta é convocado
 * pela diretoria para o time. A sessão dele (JWT) só reflete o novo role
 * no próximo login — isso é esperado, não um bug.
 */
export class PromoverUsuarioParaAtletaUseCase
  implements UseCase<PromoverUsuarioParaAtletaIn, PromoverUsuarioParaAtletaOut>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly atletaRepository: AtletaRepository,
  ) {}

  async execute(input: PromoverUsuarioParaAtletaIn): Promise<PromoverUsuarioParaAtletaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const user = await this.userRepository.findByEmail(input.userEmail);
    if (!user) throw new NotFoundError("Nenhum usuário encontrado com este e-mail.");

    if (user.role === "ATLETA") {
      throw new AppError("Este usuário já é um atleta.", "USUARIO_JA_E_ATLETA", 409);
    }

    const atleta = await this.atletaRepository.findById(input.atletaId);
    if (!atleta) throw new NotFoundError("Atleta não encontrado.");

    if (atleta.userId) {
      throw new AppError("Este atleta já possui um acesso vinculado.", "ATLETA_JA_TEM_ACESSO", 409);
    }

    const userPromovido = user.promoverParaAtleta(atleta.id);
    const atletaVinculado = atleta.clone({ userId: user.id });

    const userSalvo = await this.userRepository.update(userPromovido);
    const atletaSalvo = await this.atletaRepository.update(atletaVinculado);

    return { user: userSalvo, atleta: atletaSalvo };
  }
}
