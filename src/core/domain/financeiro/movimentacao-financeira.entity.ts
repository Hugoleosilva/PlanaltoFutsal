import { Entity, EntityState } from "../entity";
import { InRule, MaxLengthRule, PositiveRule, RequiredRule, Validator } from "@/shared/validation";

export type TipoMovimentacao = "RECEITA" | "DESPESA";

export interface MovimentacaoFinanceiraState extends EntityState {
  tipo: TipoMovimentacao;
  descricao: string;
  valor: number;
  data: Date;
  categoria?: string;
  campeonatoId?: string | null;
  registradoPorUserId: string;
}

export class MovimentacaoFinanceira extends Entity<MovimentacaoFinanceiraState> {
  private constructor(props: MovimentacaoFinanceiraState) {
    super(props);
    this.validate();
  }

  static create(props: MovimentacaoFinanceiraState): MovimentacaoFinanceira {
    return new MovimentacaoFinanceira(props);
  }

  get tipo(): TipoMovimentacao {
    return this.props.tipo;
  }

  get descricao(): string {
    return this.props.descricao;
  }

  get valor(): number {
    return this.props.valor;
  }

  get data(): Date {
    return this.props.data;
  }

  get categoria(): string | undefined {
    return this.props.categoria;
  }

  get campeonatoId(): string | null | undefined {
    return this.props.campeonatoId;
  }

  get registradoPorUserId(): string {
    return this.props.registradoPorUserId;
  }

  get valorComSinal(): number {
    return this.props.tipo === "DESPESA" ? -this.props.valor : this.props.valor;
  }

  public validate(): void {
    Validator.validate([
      {
        code: "tipo",
        value: this.props.tipo,
        rules: [new RequiredRule(), new InRule(["RECEITA", "DESPESA"] as const)],
      },
      {
        code: "descricao",
        value: this.props.descricao,
        rules: [new RequiredRule(), new MaxLengthRule(300)],
      },
      { code: "valor", value: this.props.valor, rules: [new RequiredRule(), new PositiveRule()] },
      { code: "data", value: this.props.data, rules: [new RequiredRule()] },
      {
        code: "registradoPorUserId",
        value: this.props.registradoPorUserId,
        rules: [new RequiredRule()],
      },
    ]);
  }
}
