import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AppError } from "@/infrastructure/errors";
import { StrongPasswordRule, Validator } from "@/shared/validation";
import { UseCase } from "../use-case";
import { RedefinicaoSenhaRepository } from "../_shared/redefinicao-senha.port";
import { PasswordHasher } from "../_shared/password-hasher.port";

export interface RedefinirSenhaIn {
  token: string;
  novaSenha: string;
}

export interface RedefinirSenhaOut {
  user: User;
}

export class RedefinirSenhaUseCase implements UseCase<RedefinirSenhaIn, RedefinirSenhaOut> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redefinicaoRepository: RedefinicaoSenhaRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ token, novaSenha }: RedefinirSenhaIn): Promise<RedefinirSenhaOut> {
    const registro = await this.redefinicaoRepository.findByToken(token);
    if (!registro) {
      throw new AppError("Link de redefinição inválido.", "TOKEN_INVALIDO", 400);
    }

    if (registro.expiraEm.getTime() < Date.now()) {
      await this.redefinicaoRepository.delete(registro.id);
      throw new AppError("Link de redefinição expirado. Peça um novo.", "TOKEN_EXPIRADO", 400);
    }

    const user = await this.userRepository.findById(registro.userId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", "USUARIO_NAO_ENCONTRADO", 404);
    }

    Validator.validate([{ code: "senha", value: novaSenha, rules: [new StrongPasswordRule()] }]);

    const passwordHash = await this.passwordHasher(novaSenha);
    const userAtualizado = user.clone({ passwordHash });
    const userSalvo = await this.userRepository.update(userAtualizado);

    await this.redefinicaoRepository.delete(registro.id);

    return { user: userSalvo };
  }
}
