import { describe, expect, it } from "vitest";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { ValidationException } from "@/infrastructure/errors";

function buildAtletaProps(overrides: Partial<Parameters<typeof Atleta.create>[0]> = {}) {
  return {
    nomeCompleto: "Carlos Eduardo da Silva",
    apelido: "Cadu",
    dataNascimento: new Date("2000-05-10"),
    galeriaFotosUrls: [],
    documentos: [],
    status: "ATIVO" as const,
    ...overrides,
  };
}

describe("Atleta entity", () => {
  it("creates a valid atleta", () => {
    const atleta = Atleta.create(buildAtletaProps());

    expect(atleta.nomeCompleto).toBe("Carlos Eduardo da Silva");
    expect(atleta.status).toBe("ATIVO");
    expect(atleta.id).toBeTruthy();
  });

  it("computes idade from dataNascimento", () => {
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

    const atleta = Atleta.create(buildAtletaProps({ dataNascimento: twentyYearsAgo }));

    expect(atleta.idade).toBe(20);
  });

  it("flags atletas under 18 as isMenorDeIdade", () => {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    const atleta = Atleta.create(buildAtletaProps({ dataNascimento: tenYearsAgo }));

    expect(atleta.isMenorDeIdade).toBe(true);
  });

  it("rejects a nomeCompleto that is too short", () => {
    expect(() => Atleta.create(buildAtletaProps({ nomeCompleto: "Al" }))).toThrow(
      ValidationException,
    );
  });

  it("rejects a dataNascimento in the future", () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    expect(() => Atleta.create(buildAtletaProps({ dataNascimento: nextYear }))).toThrow(
      ValidationException,
    );
  });

  it("rejects a galeriaFotosUrls with more than 4 photos", () => {
    expect(() =>
      Atleta.create(
        buildAtletaProps({
          galeriaFotosUrls: ["a.jpg", "b.jpg", "c.jpg", "d.jpg", "e.jpg"],
        }),
      ),
    ).toThrow(ValidationException);
  });

  it("desativar() returns a new instance with status INATIVO", () => {
    const atleta = Atleta.create(buildAtletaProps());
    const desativado = atleta.desativar();

    expect(desativado.status).toBe("INATIVO");
    expect(atleta.status).toBe("ATIVO");
    expect(desativado.equals(atleta)).toBe(true);
  });
});
