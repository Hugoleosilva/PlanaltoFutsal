import { Foto, StatusFoto } from "./foto.entity";

export interface FotoRepository {
  findById(id: string): Promise<Foto | null>;
  findByStatus(status: StatusFoto): Promise<Foto[]>;
  countByLoteEnvio(loteEnvioId: string): Promise<number>;
  create(foto: Foto): Promise<Foto>;
  createMany(fotos: Foto[]): Promise<Foto[]>;
  update(foto: Foto): Promise<Foto>;
}
