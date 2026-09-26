import { Comunicado } from "./comunicado.entity";
import { Enquete } from "./enquete.entity";

export interface EnqueteRepository {
  findById(id: string): Promise<Enquete | null>;
  findAtiva(): Promise<Enquete | null>;
  create(enquete: Enquete): Promise<Enquete>;
  update(enquete: Enquete): Promise<Enquete>;
}

export interface ComunicadoRepository {
  findRecentes(limite: number): Promise<Comunicado[]>;
  create(comunicado: Comunicado): Promise<Comunicado>;
}
