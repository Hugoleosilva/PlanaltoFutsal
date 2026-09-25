import { Atleta, FakeAtletaRepository } from "../../domain/atleta";
import { DeleteAtleta } from "./delete-atleta.usecase";

describe("DeleteAtleta", () => {
  test("deve excluir a entidade quando ela existir", async () => {
    const atleta = new Atleta({
      nome: "Joao Silva",
      email: "joao@silva.com",
      dataNascimento: new Date("2000-01-01"),
      numeroCamisa: 10,
    });
    const atletaRepository = new FakeAtletaRepository([atleta]);
    const useCase = new DeleteAtleta(atletaRepository);

    await expect(useCase.execute({ id: atleta.id })).resolves.toBeUndefined();
    await expect(atletaRepository.findById(atleta.id)).resolves.toBeNull();
  });

  test("deve continuar previsivel mesmo quando o id nao existir", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new DeleteAtleta(atletaRepository);

    await expect(useCase.execute({ id: "missing-id" })).resolves.toBeUndefined();
    expect(atletaRepository.atletas).toEqual([]);
  });
});
