import { Foto, StatusFoto } from "@/core/domain/foto/foto.entity";
import { FotoRepository } from "@/core/domain/foto/foto.repository";

export class FakeFotoRepository implements FotoRepository {
  private readonly fotos = new Map<string, Foto>();

  async findById(id: string): Promise<Foto | null> {
    return this.fotos.get(id) ?? null;
  }

  async findByStatus(status: StatusFoto): Promise<Foto[]> {
    return [...this.fotos.values()].filter((foto) => foto.status === status);
  }

  async countByLoteEnvio(loteEnvioId: string): Promise<number> {
    return [...this.fotos.values()].filter((foto) => foto.loteEnvioId === loteEnvioId).length;
  }

  async create(foto: Foto): Promise<Foto> {
    this.fotos.set(foto.id, foto);
    return foto;
  }

  async createMany(fotos: Foto[]): Promise<Foto[]> {
    for (const foto of fotos) this.fotos.set(foto.id, foto);
    return fotos;
  }

  async update(foto: Foto): Promise<Foto> {
    this.fotos.set(foto.id, foto);
    return foto;
  }
}
