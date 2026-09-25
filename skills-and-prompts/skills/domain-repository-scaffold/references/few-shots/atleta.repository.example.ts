import { CrudRepository } from "../repositories";
import { Atleta } from "./atleta.entity";

export interface AtletaPageParams {
  page: number;
  perPage: number;
}

export interface AtletaRepository extends CrudRepository<
  Atleta,
  Atleta,
  Atleta,
  AtletaPageParams
> {}
