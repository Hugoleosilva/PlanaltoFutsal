import { describe, expect, it } from "vitest";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { EditarAtletaUseCase } from "@/core/use-cases/atleta/editar-atleta.use-case";
import { NotFoundError } from "@/infrastructure/errors";
import { FakeAtletaRepository } from "../../fakes/fake-atleta.repository";
import { FakeAuditLogRepository } from "../../fakes/fake-audit-log.repository";

describe("EditarAtletaUseCase", () => {
  it("updates only the provided fields and keeps the rest untouched", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new EditarAtletaUseCase(atletaRepository, auditLogRepository);

    const atleta = await atletaRepository.create(
      Atleta.create({
        nomeCompleto: "Joao da Silva",
        apelido: "Joaozinho",
        dataNascimento: new Date("1998-01-01"),
        galeriaFotosUrls: [],
        documentos: [],
        status: "ATIVO",
      }),
    );

    const { atleta: editado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      atletaId: atleta.id,
      apelido: "Joao 10",
    });

    expect(editado.apelido).toBe("Joao 10");
    expect(editado.nomeCompleto).toBe("Joao da Silva");
    expect(auditLogRepository.logs[0]?.action).toBe("ATLETA_EDITADO");
  });

  it("throws NotFoundError for an unknown atleta", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new EditarAtletaUseCase(atletaRepository, auditLogRepository);

    await expect(
      useCase.execute({ actor: { id: "admin-1", role: "ADMIN" }, atletaId: "unknown" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
