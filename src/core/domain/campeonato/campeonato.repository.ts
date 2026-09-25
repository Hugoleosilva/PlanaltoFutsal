import { Campeonato } from "./campeonato.entity";
import { InscricaoCampeonato } from "./inscricao-campeonato.entity";

export interface CampeonatoRepository {
  findById(id: string): Promise<Campeonato | null>;
  findAll(): Promise<Campeonato[]>;
  create(campeonato: Campeonato): Promise<Campeonato>;
  update(campeonato: Campeonato): Promise<Campeonato>;
}

export interface InscricaoCampeonatoRepository {
  findByCampeonato(campeonatoId: string): Promise<InscricaoCampeonato[]>;
  findByAtleta(atletaId: string): Promise<InscricaoCampeonato[]>;
  create(inscricao: InscricaoCampeonato): Promise<InscricaoCampeonato>;
}
