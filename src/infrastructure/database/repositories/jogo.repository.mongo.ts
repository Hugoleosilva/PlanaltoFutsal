import { Jogo, JogoState } from "@/core/domain/jogo/jogo.entity";
import { JogoRepository } from "@/core/domain/jogo/jogo.repository";
import { connectToDatabase } from "../mongoose";
import { JogoDocument, JogoModel } from "../schemas/jogo.schema";

function toEntity(doc: JogoDocument): Jogo {
  const state: JogoState = {
    id: doc.id as string,
    adversario: doc.adversario,
    adversarioEscudoUrl: doc.adversarioEscudoUrl ?? null,
    dataHora: doc.dataHora ?? null,
    local: doc.local,
    campeonatoId: doc.campeonatoId ? doc.campeonatoId.toString() : null,
    status: doc.status,
    placarPlanalto: doc.placarPlanalto ?? null,
    placarAdversario: doc.placarAdversario ?? null,
    mandante: doc.mandante,
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
    const docs = await JogoModel.find({ status: "AGENDADO" });
    const jogos = docs.map(toEntity);

    // Jogos com data definida vêm primeiro, em ordem cronológica — um jogo
    // sem data ainda não pode ser "o próximo", então fica sempre por último.
    return jogos.sort((a, b) => {
      if (a.dataHora && b.dataHora) return a.dataHora.getTime() - b.dataHora.getTime();
      if (a.dataHora) return -1;
      if (b.dataHora) return 1;
      return 0;
    });
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
      adversarioEscudoUrl: jogo.adversarioEscudoUrl ?? null,
      dataHora: jogo.dataHora ?? null,
      local: jogo.local,
      campeonatoId: jogo.campeonatoId ?? null,
      status: jogo.status,
      placarPlanalto: jogo.placarPlanalto ?? null,
      placarAdversario: jogo.placarAdversario ?? null,
      mandante: jogo.mandante,
    });
    return toEntity(created);
  }

  async update(jogo: Jogo): Promise<Jogo> {
    await connectToDatabase();
    const updated = await JogoModel.findByIdAndUpdate(
      jogo.id,
      {
        adversario: jogo.adversario,
        adversarioEscudoUrl: jogo.adversarioEscudoUrl ?? null,
        dataHora: jogo.dataHora ?? null,
        local: jogo.local,
        campeonatoId: jogo.campeonatoId ?? null,
        status: jogo.status,
        placarPlanalto: jogo.placarPlanalto ?? null,
        placarAdversario: jogo.placarAdversario ?? null,
        mandante: jogo.mandante,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Jogo ${jogo.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await connectToDatabase();
    await JogoModel.findByIdAndDelete(id);
  }
}
