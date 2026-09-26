import { describe, expect, it } from "vitest";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { CriarAcessoAtletaUseCase } from "@/core/use-cases/atleta/criar-acesso-atleta.use-case";
import { AppError } from "@/infrastructure/errors";
import { ValidationException } from "@/infrastructure/errors";
import { FakeAtletaRepository } from "../../fakes/fake-atleta.repository";
import { FakeUserRepository } from "../../fakes/fake-user.repository";

const fakeHasher = async (senha: string): Promise<string> => `hash(${senha})`;

async function criarAtleta(atletaRepository: FakeAtletaRepository): Promise<Atleta> {
  return atletaRepository.create(
    Atleta.create({
      nomeCompleto: "Joao da Silva",
      apelido: "Joaozinho",
      dataNascimento: new Date("1998-01-01"),
      galeriaFotosUrls: [],
      documentos: [],
      status: "ATIVO",
    }),
  );
}

describe("CriarAcessoAtletaUseCase", () => {
  it("creates a User with role ATLETA linked to the atleta", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const userRepository = new FakeUserRepository();
    const useCase = new CriarAcessoAtletaUseCase(atletaRepository, userRepository, fakeHasher);

    const atleta = await criarAtleta(atletaRepository);

    const { user, atleta: atletaAtualizado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      atletaId: atleta.id,
      email: "joaozinho@planaltofutsal.com",
      senha: "SenhaForte123",
    });

    expect(user.role).toBe("ATLETA");
    expect(user.email).toBe("joaozinho@planaltofutsal.com");
    expect(atletaAtualizado.userId).toBe(user.id);
  });

  it("rejects when the atleta already has an account", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const userRepository = new FakeUserRepository();
    const useCase = new CriarAcessoAtletaUseCase(atletaRepository, userRepository, fakeHasher);

    const atleta = await criarAtleta(atletaRepository);
    await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      atletaId: atleta.id,
      email: "joaozinho@planaltofutsal.com",
      senha: "SenhaForte123",
    });

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        atletaId: atleta.id,
        email: "outro@planaltofutsal.com",
        senha: "SenhaForte123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects a weak password", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const userRepository = new FakeUserRepository();
    const useCase = new CriarAcessoAtletaUseCase(atletaRepository, userRepository, fakeHasher);

    const atleta = await criarAtleta(atletaRepository);

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        atletaId: atleta.id,
        email: "joaozinho@planaltofutsal.com",
        senha: "123",
      }),
    ).rejects.toBeInstanceOf(ValidationException);
  });
});
