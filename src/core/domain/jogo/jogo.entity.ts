import { Entity, EntityState } from "../entity";
import { InRule, MaxLengthRule, RequiredRule, Validator } from "@/shared/validation";

export type StatusJogo = "AGENDADO" | "REALIZADO" | "CANCELADO";

export interface JogoState extends EntityState {
  adversario: string;
  dataHora: Date;
  local: string;
  campeonatoId?: string | null;
  status: StatusJogo;
  placarPlanalto?: number | null;
  placarAdversario?: number | null;
}

export class Jogo extends Entity<JogoState> {
  private constructor(props: JogoState) {
    super(props);
    this.validate();
  }

  static create(props: JogoState): Jogo {
    return new Jogo(props);
  }

  get adversario(): string {
    return this.props.adversario;
  }

  get dataHora(): Date {
    return this.props.dataHora;
  }

  get local(): string {
    return this.props.local;
  }

  get campeonatoId(): string | null | undefined {
    return this.props.campeonatoId;
  }

  get status(): StatusJogo {
    return this.props.status;
  }

  get placarPlanalto(): number | null | undefined {
    return this.props.placarPlanalto;
  }

  get placarAdversario(): number | null | undefined {
    return this.props.placarAdversario;
  }

  registrarResultado(placarPlanalto: number, placarAdversario: number): Jogo {
    return this.clone({
      status: "REALIZADO",
      placarPlanalto,
      placarAdversario,
    } as Partial<JogoState>);
  }

  cancelar(): Jogo {
    return this.clone({ status: "CANCELADO" } as Partial<JogoState>);
  }

  public validate(): void {
    Validator.validate([
      {
        code: "adversario",
        value: this.props.adversario,
        rules: [new RequiredRule(), new MaxLengthRule(150)],
      },
      { code: "dataHora", value: this.props.dataHora, rules: [new RequiredRule()] },
      { code: "local", value: this.props.local, rules: [new RequiredRule(), new MaxLengthRule(200)] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(["AGENDADO", "REALIZADO", "CANCELADO"] as const)],
      },
    ]);
  }
}
