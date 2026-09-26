import { CaronaSolidaria } from "./carona-solidaria.entity";

export interface CaronaSolidariaRepository {
  findById(id: string): Promise<CaronaSolidaria | null>;
  findByJogo(jogoId: string): Promise<CaronaSolidaria[]>;
  findProximas(): Promise<CaronaSolidaria[]>;
  create(carona: CaronaSolidaria): Promise<CaronaSolidaria>;
  update(carona: CaronaSolidaria): Promise<CaronaSolidaria>;
}
