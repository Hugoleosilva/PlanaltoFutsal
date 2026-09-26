import { describe, expect, it } from "vitest";
import { CriarCampeonatoUseCase } from "@/core/use-cases/campeonato/criar-campeonato.use-case";
import { AppError } from "@/infrastructure/errors";
import { FakeCampeonatoRepository } from "../../fakes/fake-campeonato.repository";
import { FakeAuditLogRepository } from "../../fakes/fake-audit-log.repository";

describe("CriarCampeonatoUseCase", () => {
  it("creates a campeonato with default status OPORTUNIDADE and audits it", async () => {
    const campeonatoRepository = new FakeCampeonatoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new CriarCampeonatoUseCase(campeonatoRepository, auditLogRepository);

    const { campeonato } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      nome: "Copa Zona Oeste 2026",
      taxaInscricao: 150,
    });

    expect(campeonato.nome).toBe("Copa Zona Oeste 2026");
    expect(campeonato.status).toBe("OPORTUNIDADE");
    expect(auditLogRepository.logs).toHaveLength(1);
    expect(auditLogRepository.logs[0]?.action).toBe("CAMPEONATO_CRIADO");
  });

  it("rejects when the actor is not ADMIN", async () => {
    const campeonatoRepository = new FakeCampeonatoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new CriarCampeonatoUseCase(campeonatoRepository, auditLogRepository);

    await expect(
      useCase.execute({ actor: { id: "atleta-1", role: "ATLETA" }, nome: "Copa X" }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
