import { describe, expect, it } from "vitest";
import { Jogo } from "@/core/domain/jogo/jogo.entity";
import { RegistrarResultadoJogoUseCase } from "@/core/use-cases/jogo/registrar-resultado-jogo.use-case";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { FakeJogoRepository } from "../../fakes/fake-jogo.repository";

describe("RegistrarResultadoJogoUseCase", () => {
  it("marks the jogo as REALIZADO with the given score", async () => {
    const jogoRepository = new FakeJogoRepository();
    const useCase = new RegistrarResultadoJogoUseCase(jogoRepository);

    const jogo = await jogoRepository.create(
      Jogo.create({
        adversario: "Time Rival",
        dataHora: new Date("2026-10-08T21:30:00"),
        local: "Quadra do Planalto",
        status: "AGENDADO",
      }),
    );

    const { jogo: atualizado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      jogoId: jogo.id,
      placarPlanalto: 4,
      placarAdversario: 2,
    });

    expect(atualizado.status).toBe("REALIZADO");
    expect(atualizado.placarPlanalto).toBe(4);
    expect(atualizado.placarAdversario).toBe(2);
  });

  it("rejects when the actor is not ADMIN", async () => {
    const jogoRepository = new FakeJogoRepository();
    const useCase = new RegistrarResultadoJogoUseCase(jogoRepository);

    const jogo = await jogoRepository.create(
      Jogo.create({
        adversario: "Time Rival",
        dataHora: new Date("2026-10-08T21:30:00"),
        local: "Quadra do Planalto",
        status: "AGENDADO",
      }),
    );

    await expect(
      useCase.execute({
        actor: { id: "torcedor-1", role: "USER" },
        jogoId: jogo.id,
        placarPlanalto: 1,
        placarAdversario: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("throws NotFoundError for an unknown jogo", async () => {
    const jogoRepository = new FakeJogoRepository();
    const useCase = new RegistrarResultadoJogoUseCase(jogoRepository);

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        jogoId: "unknown",
        placarPlanalto: 1,
        placarAdversario: 0,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
