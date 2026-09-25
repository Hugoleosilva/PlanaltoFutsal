import { PageResult } from "@/core/domain/repositories";
import { Atleta, AtletaPageParams, AtletaRepository } from "@/core/domain/atleta";

export class FakeAtletaRepository implements AtletaRepository {
  private readonly storage = new Map<string, Atleta>();

  constructor(initialAtletas: Atleta[] = []) {
    for (const atleta of initialAtletas) {
      this.storage.set(atleta.id, atleta);
    }
  }

  get atletas(): Atleta[] {
    return Array.from(this.storage.values());
  }

  async create(data: Atleta): Promise<Atleta> {
    this.storage.set(data.id, data);
    return data;
  }

  async update(data: Atleta): Promise<Atleta> {
    if (!this.storage.has(data.id)) {
      throw new Error(`Atleta with id "${data.id}" was not found.`);
    }

    this.storage.set(data.id, data);
    return data;
  }

  async delete(id: string): Promise<void> {
    this.storage.delete(id);
  }

  async findById(id: string): Promise<Atleta | null> {
    return this.storage.get(id) ?? null;
  }

  async findPage(params: AtletaPageParams): Promise<PageResult<Atleta>> {
    const page = Math.max(params.page, 1);
    const perPage = Math.max(params.perPage, 1);
    const start = (page - 1) * perPage;
    const items = this.atletas.slice(start, start + perPage);

    return {
      items,
      page,
      perPage,
      total: this.storage.size,
    };
  }
}
