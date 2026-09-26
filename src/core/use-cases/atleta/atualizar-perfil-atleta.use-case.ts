import { Atleta, AtletaPosicao } from "@/core/domain/atleta/atleta.entity";
import { AtletaRepository } from "@/core/domain/atleta/atleta.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface AtualizarPerfilAtletaIn {
  actor: AuthenticatedActor;
  apelido?: string;
  bio?: string;
  posicao?: AtletaPosicao | null;
  estiloDeJogo?: string;
  preferencias?: string;
  fotoPrincipalUrl?: string | null;
}

export interface AtualizarPerfilAtletaOut {
  atleta: Atleta;
}

/**
 * Auto-atualização do próprio perfil pelo atleta logado. Diferente de
 * EditarAtletaUseCase (ADMIN edita qualquer atleta): aqui o atleta só pode
 * mexer no próprio registro, e apenas nos campos "sociais" do perfil —
 * nomeCompleto e dataNascimento continuam sendo dados oficiais mantidos
 * pela diretoria.
 */
export class AtualizarPerfilAtletaUseCase
  implements UseCase<AtualizarPerfilAtletaIn, AtualizarPerfilAtletaOut>
{
  constructor(private readonly atletaRepository: AtletaRepository) {}

  async execute(input: AtualizarPerfilAtletaIn): Promise<AtualizarPerfilAtletaOut> {
    assertRole(input.actor, ["ATLETA"]);

    const atleta = await this.atletaRepository.findByUserId(input.actor.id);
    if (!atleta) throw new NotFoundError("Perfil de atleta não encontrado para este usuário.");

    const editado = atleta.clone({
      apelido: input.apelido ?? atleta.apelido,
      bio: input.bio ?? atleta.bio,
      posicao: input.posicao !== undefined ? input.posicao : atleta.posicao,
      estiloDeJogo: input.estiloDeJogo ?? atleta.estiloDeJogo,
      preferencias: input.preferencias ?? atleta.preferencias,
      fotoPrincipalUrl:
        input.fotoPrincipalUrl !== undefined ? input.fotoPrincipalUrl : atleta.fotoPrincipalUrl,
    });

    const salvo = await this.atletaRepository.update(editado);

    return { atleta: salvo };
  }
}
