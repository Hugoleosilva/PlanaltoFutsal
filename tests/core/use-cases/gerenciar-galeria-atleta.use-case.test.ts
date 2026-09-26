import { describe, expect, it } from "vitest";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import {
  AdicionarFotoGaleriaUseCase,
  RemoverFotoGaleriaUseCase,
} from "@/core/use-cases/atleta/gerenciar-galeria-atleta.use-case";
import { ValidationException } from "@/infrastructure/errors";
import { FakeAtletaRepository } from "../../fakes/fake-atleta.repository";

async function criarAtletaComUsuario(
  atletaRepository: FakeAtletaRepository,
  galeriaFotosUrls: string[] = [],
): Promise<Atleta> {
  return atletaRepository.create(
    Atleta.create({
      userId: "user-1",
      nomeCompleto: "Joao da Silva",
      apelido: "Joaozinho",
      dataNascimento: new Date("1998-01-01"),
      galeriaFotosUrls,
      documentos: [],
      status: "ATIVO",
    }),
  );
}

describe("AdicionarFotoGaleriaUseCase", () => {
  it("adds a photo to the atleta's own gallery", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new AdicionarFotoGaleriaUseCase(atletaRepository);
    await criarAtletaComUsuario(atletaRepository);

    const { atleta } = await useCase.execute({
      actor: { id: "user-1", role: "ATLETA" },
      url: "/api/arquivos/1",
    });

    expect(atleta.galeriaFotosUrls).toEqual(["/api/arquivos/1"]);
  });

  it("rejects a 5th photo in the gallery", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new AdicionarFotoGaleriaUseCase(atletaRepository);
    await criarAtletaComUsuario(atletaRepository, ["a", "b", "c", "d"]);

    await expect(
      useCase.execute({ actor: { id: "user-1", role: "ATLETA" }, url: "e" }),
    ).rejects.toBeInstanceOf(ValidationException);
  });
});

describe("RemoverFotoGaleriaUseCase", () => {
  it("removes a photo from the gallery", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new RemoverFotoGaleriaUseCase(atletaRepository);
    await criarAtletaComUsuario(atletaRepository, ["a", "b"]);

    const { atleta } = await useCase.execute({ actor: { id: "user-1", role: "ATLETA" }, url: "a" });

    expect(atleta.galeriaFotosUrls).toEqual(["b"]);
  });
});
