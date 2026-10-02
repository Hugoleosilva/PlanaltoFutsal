import { Patrocinador } from "./patrocinador.entity";
import { Produto } from "../loja/produto.entity";

export interface PatrocinadorRepository {
  findAllAtivos(): Promise<Patrocinador[]>;
  findById(id: string): Promise<Patrocinador | null>;
  create(patrocinador: Patrocinador): Promise<Patrocinador>;
  update(patrocinador: Patrocinador): Promise<Patrocinador>;
}

export interface ProdutoRepository {
  findAllAtivos(): Promise<Produto[]>;
  create(produto: Produto): Promise<Produto>;
}
