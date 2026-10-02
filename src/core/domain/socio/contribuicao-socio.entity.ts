import { Entity, EntityState } from "../entity";
import { InRule, PositiveRule, RequiredRule, Validator } from "@/shared/validation";

export const TIPOS_CONTRIBUICAO = ["MENSAL", "UNICO"] as const;
export type TipoContribuicao = (typeof TIPOS_CONTRIBUICAO)[number];

export const STATUS_CONTRIBUICAO = ["PENDENTE", "PAGO"] as const;
export type StatusContribuicao = (typeof STATUS_CONTRIBUICAO)[number];

export interface ContribuicaoSocioState extends EntityState {
  userId: string;
  tipo: TipoContribuicao;
  referencia: string;
  valor: number;
  status: StatusContribuicao;
  dataVencimento: Date;
  pagoEm?: Date | null;
  movimentacaoFinanceiraId?: string | null;
}

/**
 * Uma "parcela" de contribuição de sócio (Planalto Meu Amor!) — mensal ou
 * aporte único. Não existe cobrança automática via Pix (só chave/QR estático,
 * sem gateway), então cada parcela nasce PENDENTE e um diretor confirma
 * manualmente quando o Pix cai na conta.
 */
export class ContribuicaoSocio extends Entity<ContribuicaoSocioState> {
  private constructor(props: ContribuicaoSocioState) {
    super(props);
    this.validate();
  }

  static create(props: ContribuicaoSocioState): ContribuicaoSocio {
    return new ContribuicaoSocio(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get tipo(): TipoContribuicao {
    return this.props.tipo;
  }

  get referencia(): string {
    return this.props.referencia;
  }

  get valor(): number {
    return this.props.valor;
  }

  get status(): StatusContribuicao {
    return this.props.status;
  }

  get dataVencimento(): Date {
    return this.props.dataVencimento;
  }

  get pagoEm(): Date | null | undefined {
    return this.props.pagoEm;
  }

  get movimentacaoFinanceiraId(): string | null | undefined {
    return this.props.movimentacaoFinanceiraId;
  }

  get isPendente(): boolean {
    return this.props.status === "PENDENTE";
  }

  marcarComoPago(movimentacaoFinanceiraId: string): ContribuicaoSocio {
    return this.clone({ status: "PAGO", pagoEm: new Date(), movimentacaoFinanceiraId });
  }

  public validate(): void {
    Validator.validate([
      { code: "userId", value: this.props.userId, rules: [new RequiredRule()] },
      { code: "tipo", value: this.props.tipo, rules: [new RequiredRule(), new InRule(TIPOS_CONTRIBUICAO)] },
      { code: "referencia", value: this.props.referencia, rules: [new RequiredRule()] },
      { code: "valor", value: this.props.valor, rules: [new RequiredRule(), new PositiveRule()] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(STATUS_CONTRIBUICAO)],
      },
      { code: "dataVencimento", value: this.props.dataVencimento, rules: [new RequiredRule()] },
    ]);
  }
}
