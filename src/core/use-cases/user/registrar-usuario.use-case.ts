import { randomBytes } from "node:crypto";
import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AppError } from "@/infrastructure/errors";
import { StrongPasswordRule, Validator } from "@/shared/validation";
import { UseCase } from "../use-case";
import { EmailSender } from "../_shared/email-sender.port";
import { VerificacaoEmailRepository } from "../_shared/verificacao-email.port";
import { PasswordHasher } from "../_shared/password-hasher.port";
import { emailTemplateBranded } from "@/infrastructure/notifications/email-template";

const TOKEN_VALIDADE_HORAS = 24;

export interface RegistrarUsuarioIn {
  nomeCompleto: string;
  email: string;
  whatsapp?: string;
  senha: string;
  linkVerificacaoBase: string;
}

export interface RegistrarUsuarioOut {
  user: User;
}

export class RegistrarUsuarioUseCase implements UseCase<RegistrarUsuarioIn, RegistrarUsuarioOut> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificacaoRepository: VerificacaoEmailRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailSender: EmailSender,
  ) {}

  async execute(input: RegistrarUsuarioIn): Promise<RegistrarUsuarioOut> {
    const emailExistente = await this.userRepository.findByEmail(input.email);
    if (emailExistente) {
      throw new AppError("Já existe uma conta com este e-mail.", "EMAIL_EM_USO", 409);
    }

    Validator.validate([{ code: "senha", value: input.senha, rules: [new StrongPasswordRule()] }]);

    const passwordHash = await this.passwordHasher(input.senha);

    const user = User.create({
      name: input.nomeCompleto,
      email: input.email,
      whatsapp: input.whatsapp,
      passwordHash,
      role: "USER",
      status: "PENDENTE_VERIFICACAO",
    });

    const userCriado = await this.userRepository.create(user);

    const token = randomBytes(32).toString("hex");
    const expiraEm = new Date(Date.now() + TOKEN_VALIDADE_HORAS * 60 * 60 * 1000);
    await this.verificacaoRepository.create(userCriado.id, token, expiraEm);

    const link = `${input.linkVerificacaoBase}?token=${token}`;
    const origin = new URL(input.linkVerificacaoBase).origin;

    await this.emailSender({
      to: userCriado.email,
      subject: "Confirme seu e-mail — Planalto Futsal",
      html: emailTemplateBranded({
        origin,
        titulo: `Olá, ${userCriado.name}!`,
        paragrafos: [
          `Falta só confirmar seu e-mail pra ativar sua conta no Planalto Futsal. Clique no botão abaixo (o link vale por ${TOKEN_VALIDADE_HORAS}h):`,
        ],
        linkBotao: link,
        textoBotao: "Confirmar e-mail",
        avisoRodape: "Se você não se cadastrou no Planalto Futsal, pode ignorar este e-mail.",
      }),
    });

    return { user: userCriado };
  }
}
