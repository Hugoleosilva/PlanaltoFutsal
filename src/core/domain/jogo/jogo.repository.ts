import { Jogo } from "./jogo.entity";

export interface JogoRepository {
  findById(id: string): Promise<Jogo | null>;
  findProximos(): Promise<Jogo[]>;
  findAll(): Promise<Jogo[]>;
  create(jogo: Jogo): Promise<Jogo>;
  update(jogo: Jogo): Promise<Jogo>;
}
