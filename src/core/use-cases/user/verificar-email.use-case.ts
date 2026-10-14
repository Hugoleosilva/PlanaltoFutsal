import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { MembroDiretoriaRepository } from "@/core/domain/diretoria/membro-diretoria.repository";
import { AppError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { VerificacaoEmailRepository } from "../_shared/verificacao-email.port";
import { EmailSender } from "../_shared/email-sender.port";
import { emailTemplateBranded } from "@/infrastructure/notifications/email-template";

export interface VerificarEmailIn {
  token: string;
  linkLoginBase: string;
}

export interface VerificarEmailOut {
  user: User;
  promovidoParaAtleta: boolean;
  promovidoParaDiretor: boolean;
}

export class VerificarEmailUseCase implements UseCase<VerificarEmailIn, VerificarEmailOut> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly atletaRepository: AtletaRepository,
    private readonly membroDiretoriaRepository: MembroDiretoriaRepository,
    private readonly verificacaoRepository: VerificacaoEmailRepository,
    private readonly emailSender: EmailSender,
  ) {}

  async execute({ token, linkLoginBase }: VerificarEmailIn): Promise<VerificarEmailOut> {
    const registro = await this.verificacaoRepository.findByToken(token);
    if (!registro) {
      throw new AppError("Link de verificação inválido.", "TOKEN_INVALIDO", 400);
    }

    if (registro.expiraEm.getTime() < Date.now()) {
      await this.verificacaoRepository.delete(registro.id);
      throw new AppError("Link de verificação expirado. Cadastre-se novamente.", "TOKEN_EXPIRADO", 400);
    }

    const user = await this.userRepository.findById(registro.userId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", "USUARIO_NAO_ENCONTRADO", 404);
    }

    let userConfirmado = user.confirmarEmail();

    const membroCorrespondente = await this.membroDiretoriaRepository.findByContatoNaoVinculado(
      userConfirmado.email,
      userConfirmado.whatsapp,
    );

    let promovidoParaDiretor = false;

    if (membroCorrespondente) {
      userConfirmado = userConfirmado.promoverParaDiretor();
      const membroVinculado = membroCorrespondente.clone({ userId: userConfirmado.id });
      await this.membroDiretoriaRepository.update(membroVinculado);
      promovidoParaDiretor = true;
    }

    const atletaCorrespondente = await this.atletaRepository.findByContatoNaoVinculado(
      userConfirmado.email,
      userConfirmado.whatsapp,
    );

    let promovidoParaAtleta = false;

    if (atletaCorrespondente) {
      // Se já virou diretor (ADMIN) acima, só vincula o atletaId sem mexer
      // no role — senão promoverParaAtleta rebaixaria ADMIN pra ATLETA.
      userConfirmado =
        userConfirmado.role === "ADMIN"
          ? userConfirmado.vincularAtleta(atletaCorrespondente.id)
          : userConfirmado.promoverParaAtleta(atletaCorrespondente.id);
      const atletaVinculado = atletaCorrespondente.clone({ userId: userConfirmado.id });
      await this.atletaRepository.update(atletaVinculado);
      promovidoParaAtleta = true;
    }

    const userSalvo = await this.userRepository.update(userConfirmado);
    await this.verificacaoRepository.delete(registro.id);

    const origin = new URL(linkLoginBase).origin;

    await this.emailSender({
      to: userSalvo.email,
      subject: "Cadastro confirmado — Planalto Futsal",
      html: emailTemplateBranded({
        origin,
        titulo: `Bem-vindo, ${userSalvo.name}!`,
        paragrafos: [
          "Seu cadastro no Planalto Futsal foi concluído com sucesso! Agora você joga junto com a gente e fica por dentro de todos os lances, tabelas e bastidores!",
        ],
        linkBotao: linkLoginBase,
        textoBotao: "Fazer Login",
      }),
    });

    return { user: userSalvo, promovidoParaAtleta, promovidoParaDiretor };
  }
}
