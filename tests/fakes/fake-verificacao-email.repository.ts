import { randomUUID } from "node:crypto";
import {
  VerificacaoEmailRepository,
  VerificacaoEmailToken,
} from "@/core/use-cases/_shared/verificacao-email.port";

export class FakeVerificacaoEmailRepository implements VerificacaoEmailRepository {
  private readonly tokens = new Map<string, VerificacaoEmailToken>();

  async create(userId: string, token: string, expiraEm: Date): Promise<VerificacaoEmailToken> {
    const registro: VerificacaoEmailToken = { id: randomUUID(), userId, token, expiraEm };
    this.tokens.set(registro.id, registro);
    return registro;
  }

  async findByToken(token: string): Promise<VerificacaoEmailToken | null> {
    return [...this.tokens.values()].find((registro) => registro.token === token) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.tokens.delete(id);
  }
}
