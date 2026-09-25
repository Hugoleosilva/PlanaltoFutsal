import { describe, expect, it } from "vitest";
import { Foto } from "@/core/domain/foto/foto.entity";
import { AprovarFotoUseCase } from "@/core/use-cases/foto/aprovar-foto.use-case";
import { AppError } from "@/infrastructure/errors";
import { FakeFotoRepository } from "../../fakes/fake-foto.repository";
import { FakeAuditLogRepository } from "../../fakes/fake-audit-log.repository";

describe("AprovarFotoUseCase", () => {
  it("approves a pending foto and writes an audit log entry", async () => {
    const fotoRepository = new FakeFotoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new AprovarFotoUseCase(fotoRepository, auditLogRepository);

    const foto = Foto.create({
      url: "https://example.com/foto.jpg",
      categoria: "ATUAL",
      status: "PENDENTE_APROVACAO",
      loteEnvioId: "lote-1",
    });
    await fotoRepository.create(foto);

    const { foto: aprovada } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      fotoId: foto.id,
    });

    expect(aprovada.status).toBe("APROVADA");
    expect(auditLogRepository.logs).toHaveLength(1);
    expect(auditLogRepository.logs[0]?.action).toBe("FOTO_APROVADA");
    expect(auditLogRepository.logs[0]?.actorUserId).toBe("admin-1");
  });

  it("rejects when the actor is not ADMIN", async () => {
    const fotoRepository = new FakeFotoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new AprovarFotoUseCase(fotoRepository, auditLogRepository);

    const foto = Foto.create({
      url: "https://example.com/foto.jpg",
      categoria: "ATUAL",
      status: "PENDENTE_APROVACAO",
      loteEnvioId: "lote-1",
    });
    await fotoRepository.create(foto);

    await expect(
      useCase.execute({ actor: { id: "torcedor-1", role: "USER" }, fotoId: foto.id }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("throws NotFoundError when the foto does not exist", async () => {
    const fotoRepository = new FakeFotoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new AprovarFotoUseCase(fotoRepository, auditLogRepository);

    await expect(
      useCase.execute({ actor: { id: "admin-1", role: "ADMIN" }, fotoId: "unknown-id" }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
