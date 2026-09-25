import { Entity, EntityState } from "../entity";
import { InRule, RequiredRule, Validator } from "@/shared/validation";

export type StatusPresenca = "CONFIRMADO" | "AUSENTE" | "PENDENTE";

export interface ConfirmacaoPresencaState extends EntityState {
  jogoId: string;
  atletaId: string;
  status: StatusPresenca;
  respondidoEm?: Date | null;
}

export class ConfirmacaoPresenca extends Entity<ConfirmacaoPresencaState> {
  private constructor(props: ConfirmacaoPresencaState) {
    super(props);
    this.validate();
  }

  static create(props: ConfirmacaoPresencaState): ConfirmacaoPresenca {
    return new ConfirmacaoPresenca(props);
  }

  get jogoId(): string {
    return this.props.jogoId;
  }

  get atletaId(): string {
    return this.props.atletaId;
  }

  get status(): StatusPresenca {
    return this.props.status;
  }

  confirmar(): ConfirmacaoPresenca {
    return this.clone({
      status: "CONFIRMADO",
      respondidoEm: new Date(),
    } as Partial<ConfirmacaoPresencaState>);
  }

  marcarAusente(): ConfirmacaoPresenca {
    return this.clone({
      status: "AUSENTE",
      respondidoEm: new Date(),
    } as Partial<ConfirmacaoPresencaState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "jogoId", value: this.props.jogoId, rules: [new RequiredRule()] },
      { code: "atletaId", value: this.props.atletaId, rules: [new RequiredRule()] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(["CONFIRMADO", "AUSENTE", "PENDENTE"] as const)],
      },
    ]);
  }
}
