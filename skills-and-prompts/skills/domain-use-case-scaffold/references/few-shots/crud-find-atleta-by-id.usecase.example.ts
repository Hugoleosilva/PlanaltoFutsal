import { UseCase } from "../../use-case";
import { Atleta, AtletaRepository } from "../../domain/atleta";

export interface FindAtletaByIdIn {
  id: string;
}

export interface FindAtletaByIdOut {
  atleta: Atleta | null;
}

export class FindAtletaById implements UseCase<FindAtletaByIdIn, FindAtletaByIdOut> {
  constructor(private readonly atletaRepository: AtletaRepository) {}

  async execute(input: FindAtletaByIdIn): Promise<FindAtletaByIdOut> {
    const atleta = await this.atletaRepository.findById(input.id);

    return {
      atleta,
    };
  }
}
