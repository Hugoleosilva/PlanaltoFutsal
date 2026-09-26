import { describe, expect, it } from "vitest";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { User } from "@/core/domain/user/user.entity";
import { PromoverUsuarioParaAtletaUseCase } from "@/core/use-cases/atleta/promover-usuario-atleta.use-case";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { FakeUserRepository } from "../../fakes/fake-user.repository";
import { FakeAtletaRepository } from "../../fakes/fake-atleta.repository";

describe("PromoverUsuarioParaAtletaUseCase", () => {
  it("links an existing USER account to an unlinked atleta", async () => {
    const userRepository = new FakeUserRepository();
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new PromoverUsuarioParaAtletaUseCase(userRepository, atletaRepository);

    const user = await userRepository.create(
      User.create({
        name: "Cicrano",
        email: "cicrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "ATIVO",
      }),
    );

    const atleta = await atletaRepository.create(
      Atleta.create({
        nomeCompleto: "Cicrano da Silva",
        apelido: "Cicrano",
        dataNascimento: new Date("1995-01-01"),
        galeriaFotosUrls: [],
        documentos: [],
        status: "ATIVO",
      }),
    );

    const { user: userAtualizado, atleta: atletaAtualizado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      userEmail: "cicrano@example.com",
      atletaId: atleta.id,
    });

    expect(userAtualizado.role).toBe("ATLETA");
    expect(userAtualizado.atletaId).toBe(atleta.id);
    expect(atletaAtualizado.userId).toBe(user.id);
  });

  it("throws NotFoundError for an unknown e-mail", async () => {
    const userRepository = new FakeUserRepository();
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new PromoverUsuarioParaAtletaUseCase(userRepository, atletaRepository);

    const atleta = await atletaRepository.create(
      Atleta.create({
        nomeCompleto: "Cicrano da Silva",
        apelido: "Cicrano",
        dataNascimento: new Date("1995-01-01"),
        galeriaFotosUrls: [],
        documentos: [],
        status: "ATIVO",
      }),
    );

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        userEmail: "inexistente@example.com",
        atletaId: atleta.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects an atleta that already has an account", async () => {
    const userRepository = new FakeUserRepository();
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new PromoverUsuarioParaAtletaUseCase(userRepository, atletaRepository);

    await userRepository.create(
      User.create({
        name: "Cicrano",
        email: "cicrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "ATIVO",
      }),
    );

    const atleta = await atletaRepository.create(
      Atleta.create({
        userId: "outro-user",
        nomeCompleto: "Cicrano da Silva",
        apelido: "Cicrano",
        dataNascimento: new Date("1995-01-01"),
        galeriaFotosUrls: [],
        documentos: [],
        status: "ATIVO",
      }),
    );

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        userEmail: "cicrano@example.com",
        atletaId: atleta.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
