import { MembroDiretoria } from "@/core/domain/diretoria/membro-diretoria.entity";
import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";
import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface PromoverUsuarioParaDiretorIn {
  actor: AuthenticatedActor;
  termoBusca: string;
  membroId: string;
}

export interface PromoverUsuarioParaDiretorOut {
  user: User;
  membro: MembroDiretoria;
}

/**
 * Mesmo caso do "Cicrano" (PromoverUsuarioParaAtletaUseCase), só que pra
 * diretoria: alguém que já tem conta (torcedor ou atleta) é convidado pra
 * diretoria. O role vira ADMIN preservando o atletaId se já tiver um — a
 * sessão (JWT) só reflete isso no próximo login, não é bug.
 */
export class PromoverUsuarioParaDiretorUseCase
  implements UseCase<PromoverUsuarioParaDiretorIn, PromoverUsuarioParaDiretorOut>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly membroDiretoriaRepository: MembroDiretoriaRepository,
  ) {}

  async execute(input: PromoverUsuarioParaDiretorIn): Promise<PromoverUsuarioParaDiretorOut> {
    assertRole(input.actor, ["ADMIN"]);

    const user = await this.buscarUsuario(input.termoBusca);
    if (!user) {
      throw new NotFoundError("Nenhum usuário encontrado com esse e-mail, WhatsApp ou nome.");
    }

    if (user.role === "ADMIN") {
      throw new AppError("Este usuário já é diretor.", "USUARIO_JA_E_DIRETOR", 409);
    }

    const membro = await this.membroDiretoriaRepository.findById(input.membroId);
    if (!membro) throw new NotFoundError("Membro da diretoria não encontrado.");

    if (membro.userId) {
      throw new AppError("Este membro da diretoria já possui um acesso vinculado.", "MEMBRO_JA_TEM_ACESSO", 409);
    }

    const userPromovido = user.promoverParaDiretor();
    const membroVinculado = membro.clone({ userId: user.id });

    const userSalvo = await this.userRepository.update(userPromovido);
    const membroSalvo = await this.membroDiretoriaRepository.update(membroVinculado);

    return { user: userSalvo, membro: membroSalvo };
  }

  private async buscarUsuario(termoBusca: string): Promise<User | null> {
    const termo = termoBusca.trim();
    if (!termo) return null;

    if (termo.includes("@")) {
      return this.userRepository.findByEmail(termo);
    }

    const digitos = termo.replace(/\D/g, "");
    if (digitos.length >= 8) {
      return this.userRepository.findByWhatsapp(termo);
    }

    return this.userRepository.findByName(termo);
  }
}
