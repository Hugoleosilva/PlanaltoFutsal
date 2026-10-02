export interface RedefinicaoSenhaToken {
  id: string;
  userId: string;
  token: string;
  expiraEm: Date;
}

export interface RedefinicaoSenhaRepository {
  create(userId: string, token: string, expiraEm: Date): Promise<RedefinicaoSenhaToken>;
  findByToken(token: string): Promise<RedefinicaoSenhaToken | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
