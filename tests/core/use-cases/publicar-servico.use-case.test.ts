import { describe, expect, it } from "vitest";
import { PublicarServicoUseCase } from "@/core/use-cases/servico/publicar-servico.use-case";
import { FakeServicoRepository } from "../../fakes/fake-servico.repository";

describe("PublicarServicoUseCase", () => {
  it("creates a servico pending approval for an authenticated USER", async () => {
    const servicoRepository = new FakeServicoRepository();
    const useCase = new PublicarServicoUseCase(servicoRepository);

    const { servico } = await useCase.execute({
      actor: { id: "user-1", role: "USER" },
      titulo: "Corte de cabelo a domicílio",
      descricao: "Corte, barba e sobrancelha, atendo na sua casa.",
      imagensUrls: ["/api/arquivos/1"],
      valores: "A partir de R$ 25",
      formasPagamento: ["DINHEIRO", "PIX"],
      nomeContato: "Cicrano",
      contato: "81999999999",
    });

    expect(servico.status).toBe("PENDENTE_APROVACAO");
    expect(servico.autorUserId).toBe("user-1");
    expect(servico.formasPagamento).toEqual(["DINHEIRO", "PIX"]);
  });

  it("works for ATLETA role too, still pending approval", async () => {
    const servicoRepository = new FakeServicoRepository();
    const useCase = new PublicarServicoUseCase(servicoRepository);

    const { servico } = await useCase.execute({
      actor: { id: "atleta-1", role: "ATLETA" },
      titulo: "Aulas de futsal",
      descricao: "Aulas particulares.",
      imagensUrls: ["/api/arquivos/2"],
      formasPagamento: ["PIX"],
      nomeContato: "Fulano",
      contato: "81988888888",
    });

    expect(servico.status).toBe("PENDENTE_APROVACAO");
  });

  it("auto-approves a servico published by the diretoria (ADMIN)", async () => {
    const servicoRepository = new FakeServicoRepository();
    const useCase = new PublicarServicoUseCase(servicoRepository);

    const { servico } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      titulo: "Higienização de Estofados",
      descricao: "Sofás, colchões e carpetes.",
      imagensUrls: ["/api/arquivos/3"],
      formasPagamento: ["PIX"],
      nomeContato: "Windson",
      contato: "81988505028",
    });

    expect(servico.status).toBe("APROVADO");
    expect(servico.moderadoPorUserId).toBe("admin-1");
    expect(servico.moderadoEm).toBeInstanceOf(Date);
  });
});
