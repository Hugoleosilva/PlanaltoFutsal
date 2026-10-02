import { Entity, EntityState } from "../entity";
import {
  EmailRule,
  InRule,
  MaxItemsRule,
  MaxLengthRule,
  MinLengthRule,
  PastDateRule,
  PhoneBrRule,
  RequiredRule,
  Validator,
} from "@/shared/validation";
import { POSICOES_ATLETA, PosicaoAtleta } from "@/shared/constants/posicoes-atleta";

export type AtletaStatus = "ATIVO" | "INATIVO";
export type AtletaPosicao = PosicaoAtleta;

export interface DocumentoAtleta {
  tipo: "RG" | "CPF" | "ATESTADO_MEDICO";
  url: string;
  enviadoEm: Date;
}

export interface AtletaState extends EntityState {
  userId?: string | null;
  nomeCompleto: string;
  apelido: string;
  dataNascimento: Date;
  fotoPrincipalUrl?: string | null;
  galeriaFotosUrls: string[];
  bio?: string;
  posicao?: AtletaPosicao | null;
  estiloDeJogo?: string;
  preferencias?: string;
  documentos: DocumentoAtleta[];
  status: AtletaStatus;
  /**
   * Contato usado pela diretoria ao lançar o atleta no elenco antes dele
   * ter login (o "BID"). Quando um usuário se auto-cadastra com o mesmo
   * e-mail ou WhatsApp, a verificação de e-mail promove a conta para
   * ATLETA e vincula automaticamente a este registro.
   */
  contatoEmail?: string;
  contatoWhatsapp?: string;
}

const MAX_GALERIA_FOTOS = 4;

export class Atleta extends Entity<AtletaState> {
  private constructor(props: AtletaState) {
    super(props);
    this.validate();
  }

  static create(props: AtletaState): Atleta {
    return new Atleta(props);
  }

  get userId(): string | null | undefined {
    return this.props.userId;
  }

  get nomeCompleto(): string {
    return this.props.nomeCompleto;
  }

  get apelido(): string {
    return this.props.apelido;
  }

  get dataNascimento(): Date {
    return this.props.dataNascimento;
  }

  get idade(): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - this.props.dataNascimento.getFullYear();
    const aniversarioJaPassouEsteAno =
      hoje.getMonth() > this.props.dataNascimento.getMonth() ||
      (hoje.getMonth() === this.props.dataNascimento.getMonth() &&
        hoje.getDate() >= this.props.dataNascimento.getDate());

    if (!aniversarioJaPassouEsteAno) idade -= 1;
    return idade;
  }

  get fotoPrincipalUrl(): string | null | undefined {
    return this.props.fotoPrincipalUrl;
  }

  get galeriaFotosUrls(): readonly string[] {
    return this.props.galeriaFotosUrls;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get posicao(): AtletaPosicao | null | undefined {
    return this.props.posicao;
  }

  get estiloDeJogo(): string | undefined {
    return this.props.estiloDeJogo;
  }

  get preferencias(): string | undefined {
    return this.props.preferencias;
  }

  get documentos(): readonly DocumentoAtleta[] {
    return this.props.documentos;
  }

  get status(): AtletaStatus {
    return this.props.status;
  }

  get contatoEmail(): string | undefined {
    return this.props.contatoEmail;
  }

  get contatoWhatsapp(): string | undefined {
    return this.props.contatoWhatsapp;
  }

  get isMenorDeIdade(): boolean {
    return this.idade < 18;
  }

  desativar(): Atleta {
    return this.clone({ status: "INATIVO" } as Partial<AtletaState>);
  }

  public validate(): void {
    Validator.validate([
      {
        code: "nomeCompleto",
        value: this.props.nomeCompleto,
        rules: [new RequiredRule(), new MinLengthRule(3), new MaxLengthRule(150)],
      },
      {
        code: "apelido",
        value: this.props.apelido,
        rules: [new RequiredRule(), new MaxLengthRule(50)],
      },
      {
        code: "dataNascimento",
        value: this.props.dataNascimento,
        rules: [new RequiredRule(), new PastDateRule()],
      },
      {
        code: "galeriaFotosUrls",
        value: this.props.galeriaFotosUrls,
        rules: [new MaxItemsRule(MAX_GALERIA_FOTOS)],
      },
      {
        code: "posicao",
        value: this.props.posicao,
        rules: [new InRule(POSICOES_ATLETA)],
      },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(["ATIVO", "INATIVO"] as const)],
      },
      { code: "contatoEmail", value: this.props.contatoEmail, rules: [new EmailRule()] },
      { code: "contatoWhatsapp", value: this.props.contatoWhatsapp, rules: [new PhoneBrRule()] },
    ]);
  }
}
