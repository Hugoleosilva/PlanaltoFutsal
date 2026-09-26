import { describe, expect, it } from "vitest";
import { Campeonato } from "@/core/domain/campeonato/campeonato.entity";
import { Atleta } from "@/core/domain/atleta/atleta.entity";
import { VincularAtletaCampeonatoUseCase } from "@/core/use-cases/campeonato/vincular-atleta-campeonato.use-case";
import { AppError, NotFoundError } from "@/infrastructure/errors";
import {
  FakeCampeonatoRepository,
  FakeInscricaoCampeonatoRepository,
} from "../../fakes/fake-campeonato.repository";
import { FakeAtletaRepository } from "../../fakes/fake-atleta.repository";

async function setup() {
  const campeonatoRepository = new FakeCampeonatoRepository();
  const atletaRepository = new FakeAtletaRepository();
  const inscricaoRepository = new FakeInscricaoCampeonatoRepository();
  const useCase = new VincularAtletaCampeonatoUseCase(
    campeonatoRepository,
    atletaRepository,
    inscricaoRepository,
  );

  const campeonato = await campeonatoRepository.create(
    Campeonato.create({ nome: "Copa Zona Oeste", status: "INSCRITO" }),
  );

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

  return { useCase, campeonato, atleta, inscricaoRepository };
}

describe("VincularAtletaCampeonatoUseCase", () => {
  it("links an atleta to a campeonato", async () => {
    const { useCase, campeonato, atleta } = await setup();

    const { inscricao } = await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      campeonatoId: campeonato.id,
      atletaId: atleta.id,
      categoria: "Sub-20",
    });

    expect(inscricao.campeonatoId).toBe(campeonato.id);
    expect(inscricao.atletaId).toBe(atleta.id);
  });

  it("rejects a duplicate link", async () => {
    const { useCase, campeonato, atleta } = await setup();

    await useCase.execute({
      actor: { id: "admin-1", role: "ADMIN" },
      campeonatoId: campeonato.id,
      atletaId: atleta.id,
    });

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        campeonatoId: campeonato.id,
        atletaId: atleta.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("throws NotFoundError for an unknown campeonato", async () => {
    const { useCase, atleta } = await setup();

    await expect(
      useCase.execute({
        actor: { id: "admin-1", role: "ADMIN" },
        campeonatoId: "unknown",
        atletaId: atleta.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
