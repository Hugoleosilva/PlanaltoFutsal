import { Entity, EntityState } from "../entity";
import { InRule, PositiveRule, RequiredRule, Validator } from "@/shared/validation";

export type StatusMensalidade = "PENDENTE" | "PAGO" | "ATRASADO";

export interface MensalidadeState extends EntityState {
  atletaId: string;
  referencia: string;
  valor: number;
  status: StatusMensalidade;
  pagoEm?: Date | null;
}

export class Mensalidade extends Entity<MensalidadeState> {
  private constructor(props: MensalidadeState) {
    super(props);
    this.validate();
  }

  static create(props: MensalidadeState): Mensalidade {
    return new Mensalidade(props);
  }

  get atletaId(): string {
    return this.props.atletaId;
  }

  get referencia(): string {
    return this.props.referencia;
  }

  get valor(): number {
    return this.props.valor;
  }

  get status(): StatusMensalidade {
    return this.props.status;
  }

  get pagoEm(): Date | null | undefined {
    return this.props.pagoEm;
  }

  marcarComoPaga(dataPagamento: Date = new Date()): Mensalidade {
    return this.clone({
      status: "PAGO",
      pagoEm: dataPagamento,
    } as Partial<MensalidadeState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "atletaId", value: this.props.atletaId, rules: [new RequiredRule()] },
      { code: "referencia", value: this.props.referencia, rules: [new RequiredRule()] },
      { code: "valor", value: this.props.valor, rules: [new RequiredRule(), new PositiveRule()] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(["PENDENTE", "PAGO", "ATRASADO"] as const)],
      },
    ]);
  }
}
