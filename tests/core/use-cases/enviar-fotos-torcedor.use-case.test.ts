import { describe, expect, it } from "vitest";
import { EnviarFotosTorcedorUseCase } from "@/core/use-cases/foto/enviar-fotos-torcedor.use-case";
import { AppError } from "@/infrastructure/errors";
import { FakeFotoRepository } from "../../fakes/fake-foto.repository";

describe("EnviarFotosTorcedorUseCase", () => {
  it("accepts up to 5 fotos in a single submission", async () => {
    const fotoRepository = new FakeFotoRepository();
    const useCase = new EnviarFotosTorcedorUseCase(fotoRepository);

    const { fotos } = await useCase.execute({
      fotos: Array.from({ length: 5 }, (_, index) => ({
        url: `https://example.com/foto-${index}.jpg`,
        categoria: "ATUAL" as const,
      })),
      enviadoPorNome: "Torcedor Anônimo",
    });

    expect(fotos).toHaveLength(5);
    expect(fotos.every((foto) => foto.status === "PENDENTE_APROVACAO")).toBe(true);
    expect(new Set(fotos.map((foto) => foto.loteEnvioId)).size).toBe(1);
  });

  it("rejects submissions with more than 5 fotos", async () => {
    const fotoRepository = new FakeFotoRepository();
    const useCase = new EnviarFotosTorcedorUseCase(fotoRepository);

    await expect(
      useCase.execute({
        fotos: Array.from({ length: 6 }, (_, index) => ({
          url: `https://example.com/foto-${index}.jpg`,
          categoria: "ATUAL" as const,
        })),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects submissions with zero fotos", async () => {
    const fotoRepository = new FakeFotoRepository();
    const useCase = new EnviarFotosTorcedorUseCase(fotoRepository);

    await expect(useCase.execute({ fotos: [] })).rejects.toBeInstanceOf(AppError);
  });
});
