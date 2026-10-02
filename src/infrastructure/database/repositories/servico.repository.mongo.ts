import { Servico, ServicoState, StatusServico } from "@/core/domain/servico/servico.entity";
import { ServicoRepository } from "@/core/domain/servico/servico.repository";
import { connectToDatabase } from "../mongoose";
import { ServicoDocument, ServicoModel } from "../schemas/servico.schema";

function toEntity(doc: ServicoDocument): Servico {
  const state: ServicoState = {
    id: doc.id as string,
    titulo: doc.titulo,
    descricao: doc.descricao,
    imagensUrls: doc.imagensUrls,
    valores: doc.valores,
    formasPagamento: doc.formasPagamento as ServicoState["formasPagamento"],
    categoria: doc.categoria as ServicoState["categoria"],
    bairro: doc.bairro,
    nomeContato: doc.nomeContato,
    contato: doc.contato,
    autorUserId: doc.autorUserId.toString(),
    status: doc.status,
    moderadoPorUserId: doc.moderadoPorUserId ? doc.moderadoPorUserId.toString() : null,
    moderadoEm: doc.moderadoEm ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return Servico.create(state);
}

export class MongoServicoRepository implements ServicoRepository {
  async findById(id: string): Promise<Servico | null> {
    await connectToDatabase();
    const doc = await ServicoModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByStatus(status: StatusServico): Promise<Servico[]> {
    await connectToDatabase();
    const docs = await ServicoModel.find({ status }).sort({ createdAt: -1 });
    return docs.map(toEntity);
  }

  async create(servico: Servico): Promise<Servico> {
    await connectToDatabase();
    const created = await ServicoModel.create({
      titulo: servico.titulo,
      descricao: servico.descricao,
      imagensUrls: [...servico.imagensUrls],
      valores: servico.valores,
      formasPagamento: [...servico.formasPagamento],
      categoria: servico.categoria,
      bairro: servico.bairro,
      nomeContato: servico.nomeContato,
      contato: servico.contato,
      autorUserId: servico.autorUserId,
      status: servico.status,
      moderadoPorUserId: servico.moderadoPorUserId ?? null,
      moderadoEm: servico.moderadoEm ?? null,
    });
    return toEntity(created);
  }

  async update(servico: Servico): Promise<Servico> {
    await connectToDatabase();
    const updated = await ServicoModel.findByIdAndUpdate(
      servico.id,
      {
        titulo: servico.titulo,
        descricao: servico.descricao,
        imagensUrls: [...servico.imagensUrls],
        valores: servico.valores,
        formasPagamento: [...servico.formasPagamento],
        categoria: servico.categoria,
        bairro: servico.bairro,
        nomeContato: servico.nomeContato,
        contato: servico.contato,
        status: servico.status,
        moderadoPorUserId: servico.moderadoPorUserId ?? null,
        moderadoEm: servico.moderadoEm ?? null,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Serviço ${servico.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }
}
