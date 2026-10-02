"use server";

import { auth } from "@/infrastructure/security/auth";
import { connectToDatabase } from "@/infrastructure/database/mongoose";
import { PresencaAdminModel } from "@/infrastructure/database/schemas/presenca-admin.schema";
import { MongoMensagemChatRepository } from "@/infrastructure/database/repositories/mensagem-chat.repository.mongo";
import { EnviarMensagemChatUseCase } from "@/core/use-cases/chat/enviar-mensagem-chat.use-case";
import { UnauthorizedError, toActionError } from "@/infrastructure/errors";

const JANELA_ONLINE_MS = 40_000;

export interface AdminOnline {
  userId: string;
  nome: string;
}

export interface MensagemChatView {
  id: string;
  autorUserId: string;
  autorNome: string;
  texto: string;
  createdAt: string;
}

export interface HeartbeatResult {
  online: AdminOnline[];
  meuId: string | null;
  error: string | null;
}

export async function heartbeatAction(): Promise<HeartbeatResult> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") throw new UnauthorizedError();

    await connectToDatabase();
    await PresencaAdminModel.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { nome: session.user.name, lastSeenAt: new Date() } },
      { upsert: true },
    );

    const cutoff = new Date(Date.now() - JANELA_ONLINE_MS);
    const docs = await PresencaAdminModel.find({ lastSeenAt: { $gte: cutoff } }).sort({ nome: 1 });

    return {
      online: docs.map((doc) => ({ userId: doc.userId.toString(), nome: doc.nome })),
      meuId: session.user.id,
      error: null,
    };
  } catch (error) {
    return { online: [], meuId: null, error: toActionError(error).message };
  }
}

export interface ListarMensagensResult {
  mensagens: MensagemChatView[];
  error: string | null;
}

export async function listarMensagensAction(): Promise<ListarMensagensResult> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") throw new UnauthorizedError();

    const mensagens = await new MongoMensagemChatRepository().findRecentes(50);

    return {
      mensagens: mensagens.map((m) => ({
        id: m.id,
        autorUserId: m.autorUserId,
        autorNome: m.autorNome,
        texto: m.texto,
        createdAt: m.createdAt.toISOString(),
      })),
      error: null,
    };
  } catch (error) {
    return { mensagens: [], error: toActionError(error).message };
  }
}

export async function enviarMensagemAction(texto: string): Promise<{ error: string | null }> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const useCase = new EnviarMensagemChatUseCase(new MongoMensagemChatRepository());
    await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      autorNome: session.user.name,
      texto,
    });

    return { error: null };
  } catch (error) {
    return { error: toActionError(error).message };
  }
}
