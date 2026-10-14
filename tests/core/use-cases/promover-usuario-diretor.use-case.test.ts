import { describe, expect, it } from "vitest";
import { MembroDiretoria } from "@/core/domain/diretoria/membro-diretoria.entity";
import { User } from "@/core/domain/user/user.entity";
import { PromoverUsuarioParaDiretorUseCase } from "@/core/use-cases/diretoria/promover-usuario-diretor.use-case";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { FakeUserRepository } from "../../fakes/fake-user.repository";
import { FakeMembroDiretoriaRepository } from "../../fakes/fake-membro-diretoria.repository";

describe("PromoverUsuarioParaDiretorUseCase", () => {
  it("links an existing USER account to an unlinked membro da diretoria", async () => {
    const userRepository = new FakeUserRepository();
    const membroDiretoriaRepository = new FakeMembroDiretoriaRepository();
    const useCase = new PromoverUsuarioParaDiretorUseCase(userRepository, membroDiretoriaRepository);

    const user = await userRepository.create(
      User.create({
        name: "Cicrano",
        email: "cicrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "ATIVO",
      }),
    );

    const membro = await membroDiretoriaRepository.create(
      MembroDiretoria.create({
        nome: "Cicrano Diretor",
        funcao: "Tesoureiro",
        ordem: 0,
        status: "ATIVO",
      }),
    );

    const { user: userAtualizado, membro: membroAtualizado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      termoBusca: "cicrano@example.com",
      membroId: membro.id,
    });

    expect(userAtualizado.role).toBe("ADMIN");
    expect(membroAtualizado.userId).toBe(user.id);
  });

  it("promotes to diretor without losing the atletaId already linked", async () => {
    const userRepository = new FakeUserRepository();
    const membroDiretoriaRepository = new FakeMembroDiretoriaRepository();
    const useCase = new PromoverUsuarioParaDiretorUseCase(userRepository, membroDiretoriaRepository);

    await userRepository.create(
      User.create({
        name: "Fulano",
        email: "fulano@example.com",
        passwordHash: "hash",
        role: "ATLETA",
        atletaId: "atleta-123",
        status: "ATIVO",
      }),
    );

    const membro = await membroDiretoriaRepository.create(
      MembroDiretoria.create({
        nome: "Fulano Diretor",
        funcao: "Diretor Técnico",
        ordem: 0,
        status: "ATIVO",
      }),
    );

    const { user: userAtualizado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      termoBusca: "fulano@example.com",
      membroId: membro.id,
    });

    expect(userAtualizado.role).toBe("ADMIN");
    expect(userAtualizado.atletaId).toBe("atleta-123");
  });

  it("throws NotFoundError for an unknown e-mail", async () => {
    const userRepository = new FakeUserRepository();
    const membroDiretoriaRepository = new FakeMembroDiretoriaRepository();
    const useCase = new PromoverUsuarioParaDiretorUseCase(userRepository, membroDiretoriaRepository);

    const membro = await membroDiretoriaRepository.create(
      MembroDiretoria.create({
        nome: "Cicrano Diretor",
        funcao: "Tesoureiro",
        ordem: 0,
        status: "ATIVO",
      }),
    );

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        termoBusca: "inexistente@example.com",
        membroId: membro.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects a membro da diretoria that already has an account", async () => {
    const userRepository = new FakeUserRepository();
    const membroDiretoriaRepository = new FakeMembroDiretoriaRepository();
    const useCase = new PromoverUsuarioParaDiretorUseCase(userRepository, membroDiretoriaRepository);

    await userRepository.create(
      User.create({
        name: "Cicrano",
        email: "cicrano@example.com",
        passwordHash: "hash",
        role: "USER",
        status: "ATIVO",
      }),
    );

    const membro = await membroDiretoriaRepository.create(
      MembroDiretoria.create({
        userId: "outro-user",
        nome: "Cicrano Diretor",
        funcao: "Tesoureiro",
        ordem: 0,
        status: "ATIVO",
      }),
    );

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        termoBusca: "cicrano@example.com",
        membroId: membro.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
