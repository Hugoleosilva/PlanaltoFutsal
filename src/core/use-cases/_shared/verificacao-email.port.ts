export interface VerificacaoEmailToken {
  id: string;
  userId: string;
  token: string;
  expiraEm: Date;
}

export interface VerificacaoEmailRepository {
  create(userId: string, token: string, expiraEm: Date): Promise<VerificacaoEmailToken>;
  findByToken(token: string): Promise<VerificacaoEmailToken | null>;
  delete(id: string): Promise<void>;
}
