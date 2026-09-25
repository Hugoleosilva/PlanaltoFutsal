import { Atleta } from "./atleta.entity";

export interface AtletaRepository {
  findById(id: string): Promise<Atleta | null>;
  findAllAtivos(): Promise<Atleta[]>;
  create(atleta: Atleta): Promise<Atleta>;
  update(atleta: Atleta): Promise<Atleta>;
}
