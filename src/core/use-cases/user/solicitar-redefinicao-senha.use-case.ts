import { randomBytes } from "node:crypto";
import { UserRepository } from "@/core/domain/user/user.repository";
import { UseCase } from "../use-case";
import { EmailSender } from "../_shared/email-sender.port";
import { RedefinicaoSenhaRepository } from "../_shared/redefinicao-senha.port";
import { emailTemplateBranded } from "@/infrastructure/notifications/email-template";

const TOKEN_VALIDADE_HORAS = 1;

export interface SolicitarRedefinicaoSenhaIn {
  email: string;
  linkRedefinicaoBase: string;
}

export type SolicitarRedefinicaoSenhaOut = void;

/**
 * Nunca revela se o e-mail existe ou não na base — se o usuário não for
 * encontrado, o caso de uso simplesmente não faz nada (mesmo retorno de
 * sucesso), pra não dar pista pra quem está tentando descobrir e-mails
 * cadastrados.
 */
export class SolicitarRedefinicaoSenhaUseCase
  implements UseCase<SolicitarRedefinicaoSenhaIn, SolicitarRedefinicaoSenhaOut>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redefinicaoRepository: RedefinicaoSenhaRepository,
    private readonly emailSender: EmailSender,
  ) {}

  async execute(input: SolicitarRedefinicaoSenhaIn): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) return;

    await this.redefinicaoRepository.deleteByUserId(user.id);

    const token = randomBytes(32).toString("hex");
    const expiraEm = new Date(Date.now() + TOKEN_VALIDADE_HORAS * 60 * 60 * 1000);
    await this.redefinicaoRepository.create(user.id, token, expiraEm);

    const link = `${input.linkRedefinicaoBase}?token=${token}`;
    const origin = new URL(input.linkRedefinicaoBase).origin;

    await this.emailSender({
      to: user.email,
      subject: "Redefinir senha — Planalto Futsal",
      html: emailTemplateBranded({
        origin,
        titulo: `Olá, ${user.name}!`,
        paragrafos: [
          `Pediram a redefinição da sua senha no Planalto Futsal. Clique no botão abaixo pra escolher uma nova (o link vale por ${TOKEN_VALIDADE_HORAS}h):`,
        ],
        linkBotao: link,
        textoBotao: "Redefinir senha",
        avisoRodape: "Se não foi você quem pediu, pode ignorar este e-mail — sua senha continua a mesma.",
      }),
    });
  }
}
