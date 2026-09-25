import { Entity, EntityState } from "../entity";
import { RequiredRule, Validator } from "@/shared/validation";

export interface InscricaoCampeonatoState extends EntityState {
  campeonatoId: string;
  atletaId: string;
  categoria?: string;
}

export class InscricaoCampeonato extends Entity<InscricaoCampeonatoState> {
  private constructor(props: InscricaoCampeonatoState) {
    super(props);
    this.validate();
  }

  static create(props: InscricaoCampeonatoState): InscricaoCampeonato {
    return new InscricaoCampeonato(props);
  }

  get campeonatoId(): string {
    return this.props.campeonatoId;
  }

  get atletaId(): string {
    return this.props.atletaId;
  }

  get categoria(): string | undefined {
    return this.props.categoria;
  }

  public validate(): void {
    Validator.validate([
      { code: "campeonatoId", value: this.props.campeonatoId, rules: [new RequiredRule()] },
      { code: "atletaId", value: this.props.atletaId, rules: [new RequiredRule()] },
    ]);
  }
}
