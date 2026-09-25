import { Atleta, FakeAtletaRepository } from "../../domain/atleta";
import { FindAtletaById } from "./find-atleta-by-id.usecase";

describe("FindAtletaById", () => {
  test("deve devolver a entidade encontrada", async () => {
    const atleta = new Atleta({
      nome: "Joao Silva",
      email: "joao@silva.com",
      dataNascimento: new Date("2000-01-01"),
      numeroCamisa: 10,
    });
    const atletaRepository = new FakeAtletaRepository([atleta]);
    const useCase = new FindAtletaById(atletaRepository);

    await expect(useCase.execute({ id: atleta.id })).resolves.toEqual({
      atleta,
    });
  });

  test("deve devolver null quando a entidade nao existir", async () => {
    const atletaRepository = new FakeAtletaRepository();
    const useCase = new FindAtletaById(atletaRepository);

    await expect(useCase.execute({ id: "missing-id" })).resolves.toEqual({
      atleta: null,
    });
  });
});
