import { Patrocinador } from "./patrocinador.entity";
import { Produto } from "../loja/produto.entity";

export interface PatrocinadorRepository {
  findAllAtivos(): Promise<Patrocinador[]>;
  create(patrocinador: Patrocinador): Promise<Patrocinador>;
}

export interface ProdutoRepository {
  findAllAtivos(): Promise<Produto[]>;
  create(produto: Produto): Promise<Produto>;
}
