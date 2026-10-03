import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AppError } from "@/infrastructure/errors";
import { StrongPasswordRule, Validator } from "@/shared/validation";
import { UseCase } from "../use-case";
import { RedefinicaoSenhaRepository } from "../_shared/redefinicao-senha.port";
import { PasswordHasher } from "../_shared/password-hasher.port";
import { EmailSender } from "../_shared/email-sender.port";
import { emailTemplateBranded } from "@/infrastructure/notifications/email-template";

export interface RedefinirSenhaIn {
  token: string;
  novaSenha: string;
  linkLoginBase: string;
}

export interface RedefinirSenhaOut {
  user: User;
}

export class RedefinirSenhaUseCase implements UseCase<RedefinirSenhaIn, RedefinirSenhaOut> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redefinicaoRepository: RedefinicaoSenhaRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailSender: EmailSender,
  ) {}

  async execute({ token, novaSenha, linkLoginBase }: RedefinirSenhaIn): Promise<RedefinirSenhaOut> {
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

    const origin = new URL(linkLoginBase).origin;

    await this.emailSender({
      to: userSalvo.email,
      subject: "Senha alterada — Planalto Futsal",
      html: emailTemplateBranded({
        origin,
        titulo: `Senha alterada.`,
        paragrafos: [
          "Agora seu acesso está garantido e você já pode acompanhar o Planalto Futsal sem perder nenhum lance! Se não foi você, pode ignorar esse e-mail!",
          "Dica de craque: guarde bem a sua senha para não ser pego de contra-ataque, combinado?",
        ],
        linkBotao: linkLoginBase,
        textoBotao: "Fazer Login",
      }),
    });

    return { user: userSalvo };
  }
}
