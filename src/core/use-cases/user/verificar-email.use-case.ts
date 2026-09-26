import { User } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { AppError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { VerificacaoEmailRepository } from "../_shared/verificacao-email.port";

export interface VerificarEmailIn {
  token: string;
}

export interface VerificarEmailOut {
  user: User;
  promovidoParaAtleta: boolean;
}

export class VerificarEmailUseCase implements UseCase<VerificarEmailIn, VerificarEmailOut> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly atletaRepository: AtletaRepository,
    private readonly verificacaoRepository: VerificacaoEmailRepository,
  ) {}

  async execute({ token }: VerificarEmailIn): Promise<VerificarEmailOut> {
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

    const atletaCorrespondente = await this.atletaRepository.findByContatoNaoVinculado(
      userConfirmado.email,
      userConfirmado.whatsapp,
    );

    let promovidoParaAtleta = false;

    if (atletaCorrespondente) {
      userConfirmado = userConfirmado.promoverParaAtleta(atletaCorrespondente.id);
      const atletaVinculado = atletaCorrespondente.clone({ userId: userConfirmado.id });
      await this.atletaRepository.update(atletaVinculado);
      promovidoParaAtleta = true;
    }

    const userSalvo = await this.userRepository.update(userConfirmado);
    await this.verificacaoRepository.delete(registro.id);

    return { user: userSalvo, promovidoParaAtleta };
  }
}
