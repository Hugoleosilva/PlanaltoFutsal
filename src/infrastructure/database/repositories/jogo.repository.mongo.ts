import { Jogo, JogoState } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { connectToDatabase } from "../mongoose";
import { JogoDocument, JogoModel } from "../schemas/jogo.schema";

function toEntity(doc: JogoDocument): Jogo {
  const state: JogoState = {
    id: doc.id as string,
    adversario: doc.adversario,
    dataHora: doc.dataHora,
    local: doc.local,
    campeonatoId: doc.campeonatoId ? doc.campeonatoId.toString() : null,
    status: doc.status,
    placarPlanalto: doc.placarPlanalto ?? null,
    placarAdversario: doc.placarAdversario ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Jogo.create(state);
}

export class MongoJogoRepository implements JogoRepository {
  async findById(id: string): Promise<Jogo | null> {
    await connectToDatabase();
    const doc = await JogoModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findProximos(): Promise<Jogo[]> {
    await connectToDatabase();
    const docs = await JogoModel.find({ status: "AGENDADO" }).sort({ dataHora: 1 });
    return docs.map(toEntity);
  }

  async findAll(): Promise<Jogo[]> {
    await connectToDatabase();
    const docs = await JogoModel.find().sort({ dataHora: -1 });
    return docs.map(toEntity);
  }

  async create(jogo: Jogo): Promise<Jogo> {
    await connectToDatabase();
    const created = await JogoModel.create({
      adversario: jogo.adversario,
      dataHora: jogo.dataHora,
      local: jogo.local,
      campeonatoId: jogo.campeonatoId ?? null,
      status: jogo.status,
      placarPlanalto: jogo.placarPlanalto ?? null,
      placarAdversario: jogo.placarAdversario ?? null,
    });
    return toEntity(created);
  }

  async update(jogo: Jogo): Promise<Jogo> {
    await connectToDatabase();
    const updated = await JogoModel.findByIdAndUpdate(
      jogo.id,
      {
        adversario: jogo.adversario,
        dataHora: jogo.dataHora,
        local: jogo.local,
        campeonatoId: jogo.campeonatoId ?? null,
        status: jogo.status,
        placarPlanalto: jogo.placarPlanalto ?? null,
        placarAdversario: jogo.placarAdversario ?? null,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Jogo ${jogo.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }
}
