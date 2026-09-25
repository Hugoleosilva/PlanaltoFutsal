import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface JogoDocument extends Document {
  adversario: string;
  dataHora: Date;
  local: string;
  campeonatoId?: Types.ObjectId | null;
  status: "AGENDADO" | "REALIZADO" | "CANCELADO";
  placarPlanalto?: number | null;
  placarAdversario?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const JogoSchema = new Schema<JogoDocument>(
  {
    adversario: { type: String, required: true, trim: true },
    dataHora: { type: Date, required: true },
    local: { type: String, required: true },
    campeonatoId: { type: Schema.Types.ObjectId, ref: "Campeonato", default: null },
    status: { type: String, enum: ["AGENDADO", "REALIZADO", "CANCELADO"], required: true, default: "AGENDADO" },
    placarPlanalto: { type: Number, default: null },
    placarAdversario: { type: Number, default: null },
  },
  { timestamps: true },
);

export const JogoModel: Model<JogoDocument> = models.Jogo ?? model<JogoDocument>("Jogo", JogoSchema);

export interface EventoJogoDocument extends Document {
  jogoId: Types.ObjectId;
  atletaId: Types.ObjectId;
  tipo: "GOL" | "ASSISTENCIA" | "CARTAO_AMARELO" | "CARTAO_VERMELHO";
  minuto?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const EventoJogoSchema = new Schema<EventoJogoDocument>(
  {
    jogoId: { type: Schema.Types.ObjectId, ref: "Jogo", required: true },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", required: true },
    tipo: {
      type: String,
      enum: ["GOL", "ASSISTENCIA", "CARTAO_AMARELO", "CARTAO_VERMELHO"],
      required: true,
    },
    minuto: { type: Number, default: null },
  },
  { timestamps: true },
);

EventoJogoSchema.index({ jogoId: 1 });
EventoJogoSchema.index({ atletaId: 1 });

export const EventoJogoModel: Model<EventoJogoDocument> =
  models.EventoJogo ?? model<EventoJogoDocument>("EventoJogo", EventoJogoSchema);

export interface ConfirmacaoPresencaDocument extends Document {
  jogoId: Types.ObjectId;
  atletaId: Types.ObjectId;
  status: "CONFIRMADO" | "AUSENTE" | "PENDENTE";
  respondidoEm?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ConfirmacaoPresencaSchema = new Schema<ConfirmacaoPresencaDocument>(
  {
    jogoId: { type: Schema.Types.ObjectId, ref: "Jogo", required: true },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", required: true },
    status: { type: String, enum: ["CONFIRMADO", "AUSENTE", "PENDENTE"], required: true, default: "PENDENTE" },
    respondidoEm: { type: Date, default: null },
  },
  { timestamps: true },
);

ConfirmacaoPresencaSchema.index({ jogoId: 1, atletaId: 1 }, { unique: true });

export const ConfirmacaoPresencaModel: Model<ConfirmacaoPresencaDocument> =
  models.ConfirmacaoPresenca ??
  model<ConfirmacaoPresencaDocument>("ConfirmacaoPresenca", ConfirmacaoPresencaSchema);

export interface VotoCraqueDocument extends Document {
  jogoId: Types.ObjectId;
  atletaId: Types.ObjectId;
  identificadorVotante: string;
  createdAt: Date;
  updatedAt: Date;
}

const VotoCraqueSchema = new Schema<VotoCraqueDocument>(
  {
    jogoId: { type: Schema.Types.ObjectId, ref: "Jogo", required: true },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", required: true },
    identificadorVotante: { type: String, required: true },
  },
  { timestamps: true },
);

VotoCraqueSchema.index({ jogoId: 1, identificadorVotante: 1 }, { unique: true });

export const VotoCraqueModel: Model<VotoCraqueDocument> =
  models.VotoCraque ?? model<VotoCraqueDocument>("VotoCraque", VotoCraqueSchema);
