import { UseCase } from "../../use-case";
import { AtletaRepository } from "../../domain/atleta";

export interface DeleteAtletaIn {
  id: string;
}

export class DeleteAtleta implements UseCase<DeleteAtletaIn, void> {
  constructor(private readonly atletaRepository: AtletaRepository) {}

  async execute(input: DeleteAtletaIn): Promise<void> {
    await this.atletaRepository.delete(input.id);
  }
}
