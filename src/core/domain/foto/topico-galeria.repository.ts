import { TopicoGaleria } from "./topico-galeria.entity";
import { CategoriaFoto } from "./foto.entity";

export interface TopicoGaleriaRepository {
  findById(id: string): Promise<TopicoGaleria | null>;
  findAll(): Promise<TopicoGaleria[]>;
  findByCategoria(categoria: CategoriaFoto): Promise<TopicoGaleria[]>;
  create(topico: TopicoGaleria): Promise<TopicoGaleria>;
}
