import { Atleta, AtletaState } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { StrongPasswordRule, Validator } from "@/shared/validation";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";
import { PasswordHasher } from "../_shared/password-hasher.port";

export interface CriarAcessoAtletaIn {
  actor: AuthenticatedActor;
  atletaId: string;
  email: string;
  senha: string;
}

export interface CriarAcessoAtletaOut {
  user: User;
  atleta: Atleta;
}

export class CriarAcessoAtletaUseCase implements UseCase<CriarAcessoAtletaIn, CriarAcessoAtletaOut> {
  constructor(
    private readonly atletaRepository: AtletaRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CriarAcessoAtletaIn): Promise<CriarAcessoAtletaOut> {
    assertRole(input.actor, ["ADMIN"]);

    const atleta = await this.atletaRepository.findById(input.atletaId);
    if (!atleta) throw new NotFoundError("Atleta não encontrado.");

    if (atleta.userId) {
      throw new AppError("Este atleta já possui um acesso vinculado.", "ATLETA_JA_TEM_ACESSO", 409);
    }

    const emailExistente = await this.userRepository.findByEmail(input.email);
    if (emailExistente) {
      throw new AppError("Já existe uma conta com este e-mail.", "EMAIL_EM_USO", 409);
    }

    Validator.validate([{ code: "senha", value: input.senha, rules: [new StrongPasswordRule()] }]);

    const passwordHash = await this.passwordHasher(input.senha);

    const user = User.create({
      name: atleta.nomeCompleto,
      email: input.email,
      passwordHash,
      role: "ATLETA",
      status: "ATIVO",
    });

    const userCriado = await this.userRepository.create(user);

    const atletaVinculado = atleta.clone({ userId: userCriado.id } satisfies Partial<AtletaState>);
    const atletaSalvo = await this.atletaRepository.update(atletaVinculado);

    return { user: userCriado, atleta: atletaSalvo };
  }
}
