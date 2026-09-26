import { describe, expect, it, vi } from "vitest";
import { RegistrarUsuarioUseCase } from "@/core/use-cases/user/registrar-usuario.use-case";
import { AppError, ValidationException } from "@/infrastructure/errors";
import { FakeUserRepository } from "../../fakes/fake-user.repository";
import { FakeVerificacaoEmailRepository } from "../../fakes/fake-verificacao-email.repository";

const fakeHasher = async (senha: string): Promise<string> => `hash(${senha})`;

describe("RegistrarUsuarioUseCase", () => {
  it("creates a USER pending verification and sends the verification e-mail", async () => {
    const userRepository = new FakeUserRepository();
    const verificacaoRepository = new FakeVerificacaoEmailRepository();
    const emailSender = vi.fn().mockResolvedValue(undefined);
    const useCase = new RegistrarUsuarioUseCase(
      userRepository,
      verificacaoRepository,
      fakeHasher,
      emailSender,
    );

    const { user } = await useCase.execute({
      nomeCompleto: "Cicrano Torcedor",
      email: "cicrano@example.com",
      whatsapp: "81999999999",
      senha: "SenhaForte123",
      linkVerificacaoBase: "https://planaltofutsal.com.br/api/auth/verificar",
    });

    expect(user.role).toBe("USER");
    expect(user.status).toBe("PENDENTE_VERIFICACAO");
    expect(emailSender).toHaveBeenCalledOnce();
    expect(emailSender.mock.calls[0]?.[0].to).toBe("cicrano@example.com");
  });

  it("rejects a duplicate e-mail", async () => {
    const userRepository = new FakeUserRepository();
    const verificacaoRepository = new FakeVerificacaoEmailRepository();
    const emailSender = vi.fn().mockResolvedValue(undefined);
    const useCase = new RegistrarUsuarioUseCase(
      userRepository,
      verificacaoRepository,
      fakeHasher,
      emailSender,
    );

    await useCase.execute({
      nomeCompleto: "Cicrano",
      email: "cicrano@example.com",
      senha: "SenhaForte123",
      linkVerificacaoBase: "https://planaltofutsal.com.br/api/auth/verificar",
    });

    await expect(
      useCase.execute({
        nomeCompleto: "Outro",
        email: "cicrano@example.com",
        senha: "SenhaForte123",
        linkVerificacaoBase: "https://planaltofutsal.com.br/api/auth/verificar",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects a weak password", async () => {
    const userRepository = new FakeUserRepository();
    const verificacaoRepository = new FakeVerificacaoEmailRepository();
    const emailSender = vi.fn().mockResolvedValue(undefined);
    const useCase = new RegistrarUsuarioUseCase(
      userRepository,
      verificacaoRepository,
      fakeHasher,
      emailSender,
    );

    await expect(
      useCase.execute({
        nomeCompleto: "Cicrano",
        email: "cicrano@example.com",
        senha: "123",
        linkVerificacaoBase: "https://planaltofutsal.com.br/api/auth/verificar",
      }),
    ).rejects.toBeInstanceOf(ValidationException);
  });
});
