import { describe, expect, it, vi } from "vitest";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { MembroDiretoria } from "@/core/domain/diretoria/membro-diretoria.entity";
import { User } from "@/core/domain/user/user.entity";
import { VerificarEmailUseCase } from "@/core/use-cases/user/verificar-email.use-case";
import { AppError } from "@/infrastructure/errors";
import { FakeUserRepository } from "../../fakes/fake-user.repository";
import { FakeAtletaRepository } from "../../fakes/fake-atleta.repository";
import { FakeMembroDiretoriaRepository } from "../../fakes/fake-membro-diretoria.repository";
import { FakeVerificacaoEmailRepository } from "../../fakes/fake-verificacao-email.repository";

const LINK_LOGIN_BASE = "https://planaltofutsal.com.br/login";

function setup() {
  const userRepository = new FakeUserRepository();
  const atletaRepository = new FakeAtletaRepository();
  const membroDiretoriaRepository = new FakeMembroDiretoriaRepository();
  const verificacaoRepository = new FakeVerificacaoEmailRepository();
  const emailSender = vi.fn().mockResolvedValue(undefined);
  const useCase = new VerificarEmailUseCase(
    userRepository,
    atletaRepository,
    membroDiretoriaRepository,
    verificacaoRepository,
    emailSender,
  );
  return {
    userRepository,
    atletaRepository,
    membroDiretoriaRepository,
    verificacaoRepository,
    emailSender,
    useCase,
  };
}

describe("VerificarEmailUseCase", () => {
  it("confirms the e-mail and activates the account when there's no matching atleta", async () => {
    const { userRepository, verificacaoRepository, useCase } = setup();

    const user = await userRepository.create(
      User.create({
        name: "Cicrano",
        email: "cicrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "PENDENTE_VERIFICACAO",
      }),
    );
    const registro = await verificacaoRepository.create(user.id, "token-123", new Date(Date.now() + 1000 * 60));

    const { user: userVerificado, promovidoParaAtleta, promovidoParaDiretor } = await useCase.execute({
      token: registro.token,
      linkLoginBase: LINK_LOGIN_BASE,
    });

    expect(userVerificado.status).toBe("ATIVO");
    expect(userVerificado.isEmailVerificado).toBe(true);
    expect(userVerificado.role).toBe("USER");
    expect(promovidoParaAtleta).toBe(false);
    expect(promovidoParaDiretor).toBe(false);
  });

  it("auto-promotes to ATLETA when there's a matching unlinked atleta (Fulano case)", async () => {
    const { userRepository, atletaRepository, verificacaoRepository, useCase } = setup();

    await atletaRepository.create(
      Atleta.create({
        nomeCompleto: "Fulano da Silva",
        apelido: "Fulano",
        dataNascimento: new Date("1995-01-01"),
        galeriaFotosUrls: [],
        documentos: [],
        status: "ATIVO",
        contatoEmail: "fulano@example.com",
      }),
    );

    const user = await userRepository.create(
      User.create({
        name: "Fulano",
        email: "fulano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "PENDENTE_VERIFICACAO",
      }),
    );
    const registro = await verificacaoRepository.create(user.id, "token-456", new Date(Date.now() + 1000 * 60));

    const { user: userVerificado, promovidoParaAtleta } = await useCase.execute({
      token: registro.token,
      linkLoginBase: LINK_LOGIN_BASE,
    });

    expect(promovidoParaAtleta).toBe(true);
    expect(userVerificado.role).toBe("ATLETA");
    expect(userVerificado.atletaId).toBeTruthy();

    const atletaVinculado = await atletaRepository.findByUserId(userVerificado.id);
    expect(atletaVinculado?.apelido).toBe("Fulano");
  });

  it("auto-promotes to ADMIN when there's a matching unlinked membro da diretoria", async () => {
    const { userRepository, membroDiretoriaRepository, verificacaoRepository, useCase } = setup();

    await membroDiretoriaRepository.create(
      MembroDiretoria.create({
        nome: "Beltrano Diretor",
        funcao: "Presidente",
        ordem: 0,
        contatoEmail: "beltrano@example.com",
        status: "ATIVO",
      }),
    );

    const user = await userRepository.create(
      User.create({
        name: "Beltrano",
        email: "beltrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "PENDENTE_VERIFICACAO",
      }),
    );
    const registro = await verificacaoRepository.create(user.id, "token-789", new Date(Date.now() + 1000 * 60));

    const { user: userVerificado, promovidoParaDiretor } = await useCase.execute({
      token: registro.token,
      linkLoginBase: LINK_LOGIN_BASE,
    });

    expect(promovidoParaDiretor).toBe(true);
    expect(userVerificado.role).toBe("ADMIN");

    const membroVinculado = await membroDiretoriaRepository.findByContatoNaoVinculado("beltrano@example.com");
    expect(membroVinculado).toBeNull();
  });

  it("keeps ADMIN and still links the atletaId for a director who also plays", async () => {
    const { userRepository, atletaRepository, membroDiretoriaRepository, verificacaoRepository, useCase } =
      setup();

    await membroDiretoriaRepository.create(
      MembroDiretoria.create({
        nome: "Fulano Diretor",
        funcao: "Diretor Técnico",
        ordem: 0,
        contato: "81999998888",
        status: "ATIVO",
      }),
    );
    await atletaRepository.create(
      Atleta.create({
        nomeCompleto: "Fulano da Silva",
        apelido: "Fulano",
        dataNascimento: new Date("1990-01-01"),
        galeriaFotosUrls: [],
        documentos: [],
        status: "ATIVO",
        contatoWhatsapp: "81999998888",
      }),
    );

    const user = await userRepository.create(
      User.create({
        name: "Fulano",
        email: "fulano.diretor@example.com",
        whatsapp: "81999998888",
        passwordHash: "hash",
        role: "USER",
        status: "PENDENTE_VERIFICACAO",
      }),
    );
    const registro = await verificacaoRepository.create(user.id, "token-321", new Date(Date.now() + 1000 * 60));

    const { user: userVerificado, promovidoParaDiretor, promovidoParaAtleta } = await useCase.execute({
      token: registro.token,
      linkLoginBase: LINK_LOGIN_BASE,
    });

    expect(promovidoParaDiretor).toBe(true);
    expect(promovidoParaAtleta).toBe(true);
    expect(userVerificado.role).toBe("ADMIN");
    expect(userVerificado.atletaId).toBeTruthy();
  });

  it("rejects an unknown token", async () => {
    const { useCase } = setup();

    await expect(
      useCase.execute({ token: "inexistente", linkLoginBase: LINK_LOGIN_BASE }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects an expired token", async () => {
    const { userRepository, verificacaoRepository, useCase } = setup();

    const user = await userRepository.create(
      User.create({
        name: "Cicrano",
        email: "cicrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "PENDENTE_VERIFICACAO",
      }),
    );
    const registro = await verificacaoRepository.create(
      user.id,
      "token-expirado",
      new Date(Date.now() - 1000),
    );

    await expect(
      useCase.execute({ token: registro.token, linkLoginBase: LINK_LOGIN_BASE }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
