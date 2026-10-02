import { Entity, EntityState } from "../entity";
import { InRule, MaxLengthRule, RequiredRule, Validator } from "@/shared/validation";

export type StatusFoto = "PENDENTE_APROVACAO" | "APROVADA" | "REJEITADA";
export type CategoriaFoto = "ANTIGA" | "ATUAL";

export interface FotoState extends EntityState {
  url: string;
  descricao?: string;
  categoria: CategoriaFoto;
  status: StatusFoto;
  enviadoPorNome?: string;
  enviadoPorContato?: string;
  atletaId?: string | null;
  loteEnvioId: string;
  moderadoPorUserId?: string | null;
  moderadoEm?: Date | null;
  topicoId?: string | null;
  destaque?: boolean;
}

export class Foto extends Entity<FotoState> {
  private constructor(props: FotoState) {
    super(props);
    this.validate();
  }

  static create(props: FotoState): Foto {
    return new Foto(props);
  }

  get url(): string {
    return this.props.url;
  }

  get descricao(): string | undefined {
    return this.props.descricao;
  }

  get categoria(): CategoriaFoto {
    return this.props.categoria;
  }

  get status(): StatusFoto {
    return this.props.status;
  }

  get enviadoPorNome(): string | undefined {
    return this.props.enviadoPorNome;
  }

  get atletaId(): string | null | undefined {
    return this.props.atletaId;
  }

  get loteEnvioId(): string {
    return this.props.loteEnvioId;
  }

  get enviadoPorContato(): string | undefined {
    return this.props.enviadoPorContato;
  }

  get moderadoPorUserId(): string | null | undefined {
    return this.props.moderadoPorUserId;
  }

  get moderadoEm(): Date | null | undefined {
    return this.props.moderadoEm;
  }

  get topicoId(): string | null | undefined {
    return this.props.topicoId;
  }

  get destaque(): boolean {
    return this.props.destaque === true;
  }

  marcarDestaque(destaque: boolean): Foto {
    return this.clone({ destaque } as Partial<FotoState>);
  }

  aprovar(moderadoPorUserId: string): Foto {
    return this.clone({
      status: "APROVADA",
      moderadoPorUserId,
      moderadoEm: new Date(),
    } as Partial<FotoState>);
  }

  rejeitar(moderadoPorUserId: string): Foto {
    return this.clone({
      status: "REJEITADA",
      moderadoPorUserId,
      moderadoEm: new Date(),
    } as Partial<FotoState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "url", value: this.props.url, rules: [new RequiredRule()] },
      { code: "descricao", value: this.props.descricao, rules: [new MaxLengthRule(500)] },
      {
        code: "categoria",
        value: this.props.categoria,
        rules: [new RequiredRule(), new InRule(["ANTIGA", "ATUAL"] as const)],
      },
      {
        code: "status",
        value: this.props.status,
        rules: [
          new RequiredRule(),
          new InRule(["PENDENTE_APROVACAO", "APROVADA", "REJEITADA"] as const),
        ],
      },
      { code: "loteEnvioId", value: this.props.loteEnvioId, rules: [new RequiredRule()] },
    ]);
  }
}
