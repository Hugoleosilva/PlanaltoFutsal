import { Campeonato } from "@/core/domain/campeonato/campeonato.entity";
import { InscricaoCampeonato } from "@/core/domain/campeonato/inscricao-campeonato.entity";
import {
  CampeonatoRepository,
  InscricaoCampeonatoRepository,
} from "@/core/domain/campeonato/campeonato.repository";

export class FakeCampeonatoRepository implements CampeonatoRepository {
  private readonly campeonatos = new Map<string, Campeonato>();

  async findById(id: string): Promise<Campeonato | null> {
    return this.campeonatos.get(id) ?? null;
  }

  async findAll(): Promise<Campeonato[]> {
    return [...this.campeonatos.values()];
  }

  async create(campeonato: Campeonato): Promise<Campeonato> {
    this.campeonatos.set(campeonato.id, campeonato);
    return campeonato;
  }

  async update(campeonato: Campeonato): Promise<Campeonato> {
    this.campeonatos.set(campeonato.id, campeonato);
    return campeonato;
  }
}

export class FakeInscricaoCampeonatoRepository implements InscricaoCampeonatoRepository {
  private readonly inscricoes: InscricaoCampeonato[] = [];

  async findByCampeonato(campeonatoId: string): Promise<InscricaoCampeonato[]> {
    return this.inscricoes.filter((inscricao) => inscricao.campeonatoId === campeonatoId);
  }

  async findByAtleta(atletaId: string): Promise<InscricaoCampeonato[]> {
    return this.inscricoes.filter((inscricao) => inscricao.atletaId === atletaId);
  }

  async create(inscricao: InscricaoCampeonato): Promise<InscricaoCampeonato> {
    this.inscricoes.push(inscricao);
    return inscricao;
  }
}
