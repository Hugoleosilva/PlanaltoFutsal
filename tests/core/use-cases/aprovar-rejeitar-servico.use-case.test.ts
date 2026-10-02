import { describe, expect, it } from "vitest";
import { Servico } from "@/core/domain/servico/servico.entity";
import { AprovarServicoUseCase } from "@/core/use-cases/servico/aprovar-servico.use-case";
import { RejeitarServicoUseCase } from "@/core/use-cases/servico/rejeitar-servico.use-case";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import { FakeServicoRepository } from "../../fakes/fake-servico.repository";
import { FakeAuditLogRepository } from "../../fakes/fake-audit-log.repository";

function criarServicoPendente() {
  return Servico.create({
    titulo: "Aulas de futsal",
    descricao: "Aulas particulares para crianças.",
    imagensUrls: ["/api/arquivos/1"],
    formasPagamento: ["PIX"],
    categoria: "EDUCACAO_APOIO",
    bairro: "Sancho",
    nomeContato: "Fulano",
    contato: "81999999999",
    autorUserId: "user-1",
    status: "PENDENTE_APROVACAO",
  });
}

describe("AprovarServicoUseCase", () => {
  it("approves a pending servico and audits it", async () => {
    const servicoRepository = new FakeServicoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new AprovarServicoUseCase(servicoRepository, auditLogRepository);

    const servico = await servicoRepository.create(criarServicoPendente());

    const { servico: aprovado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      servicoId: servico.id,
    });

    expect(aprovado.status).toBe("APROVADO");
    expect(auditLogRepository.logs[0]?.action).toBe("SERVICO_APROVADO");
  });

  it("rejects when the actor is not ADMIN", async () => {
    const servicoRepository = new FakeServicoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new AprovarServicoUseCase(servicoRepository, auditLogRepository);

    const servico = await servicoRepository.create(criarServicoPendente());

    await expect(
      useCase.execute({ actor: { id: "user-1", role: "USER" }, servicoId: servico.id }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("throws NotFoundError for an unknown servico", async () => {
    const servicoRepository = new FakeServicoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new AprovarServicoUseCase(servicoRepository, auditLogRepository);

    await expect(
      useCase.execute({ actor: { id: "admin-1", role: "ADMIN" }, servicoId: "unknown" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("RejeitarServicoUseCase", () => {
  it("rejects a pending servico and audits it", async () => {
    const servicoRepository = new FakeServicoRepository();
    const auditLogRepository = new FakeAuditLogRepository();
    const useCase = new RejeitarServicoUseCase(servicoRepository, auditLogRepository);

    const servico = await servicoRepository.create(criarServicoPendente());

    const { servico: rejeitado } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      servicoId: servico.id,
    });

    expect(rejeitado.status).toBe("REJEITADO");
    expect(auditLogRepository.logs[0]?.action).toBe("SERVICO_REJEITADO");
  });
});
