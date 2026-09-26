import {
  CaronaSolidaria,
  CaronaSolidariaState,
} from "@/core/domain/carona/carona-solidaria.entity";
import { CaronaSolidariaRepository } from "@/core/domain/carona/carona-solidaria.repository";
import { connectToDatabase } from "../mongoose";
import { CaronaSolidariaDocument, CaronaSolidariaModel } from "../schemas/carona.schema";

function toEntity(doc: CaronaSolidariaDocument): CaronaSolidaria {
  const state: CaronaSolidariaState = {
    id: doc.id as string,
    jogoId: doc.jogoId.toString(),
    motoristaNome: doc.motoristaNome,
    contato: doc.contato,
    horarioSaida: doc.horarioSaida,
    local: doc.local,
    vagasDisponiveis: doc.vagasDisponiveis,
    criadoPorUserId: doc.criadoPorUserId ? doc.criadoPorUserId.toString() : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return CaronaSolidaria.create(state);
}

export class MongoCaronaSolidariaRepository implements CaronaSolidariaRepository {
  async findById(id: string): Promise<CaronaSolidaria | null> {
    await connectToDatabase();
    const doc = await CaronaSolidariaModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByJogo(jogoId: string): Promise<CaronaSolidaria[]> {
    await connectToDatabase();
    const docs = await CaronaSolidariaModel.find({ jogoId }).sort({ horarioSaida: 1 });
    return docs.map(toEntity);
  }

  async findProximas(): Promise<CaronaSolidaria[]> {
    await connectToDatabase();
    const docs = await CaronaSolidariaModel.find({ horarioSaida: { $gte: new Date() } }).sort({
      horarioSaida: 1,
    });
    return docs.map(toEntity);
  }

  async create(carona: CaronaSolidaria): Promise<CaronaSolidaria> {
    await connectToDatabase();
    const created = await CaronaSolidariaModel.create({
      jogoId: carona.jogoId,
      motoristaNome: carona.motoristaNome,
      contato: carona.contato,
      horarioSaida: carona.horarioSaida,
      local: carona.local,
      vagasDisponiveis: carona.vagasDisponiveis,
      criadoPorUserId: carona.criadoPorUserId ?? null,
    });
    return toEntity(created);
  }

  async update(carona: CaronaSolidaria): Promise<CaronaSolidaria> {
    await connectToDatabase();
    const updated = await CaronaSolidariaModel.findByIdAndUpdate(
      carona.id,
      { vagasDisponiveis: carona.vagasDisponiveis },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Carona ${carona.id} não encontrada para atualização.`);
    }

    return toEntity(updated);
  }
}
