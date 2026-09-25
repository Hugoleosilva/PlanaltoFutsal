import { Entity, EntityState } from "../entity";
import { MaxLengthRule, PositiveRule, RequiredRule, Validator } from "@/shared/validation";

export interface CaronaSolidariaState extends EntityState {
  jogoId: string;
  motoristaNome: string;
  contato: string;
  horarioSaida: Date;
  local: string;
  vagasDisponiveis: number;
  criadoPorUserId?: string | null;
}

export class CaronaSolidaria extends Entity<CaronaSolidariaState> {
  private constructor(props: CaronaSolidariaState) {
    super(props);
    this.validate();
  }

  static create(props: CaronaSolidariaState): CaronaSolidaria {
    return new CaronaSolidaria(props);
  }

  get jogoId(): string {
    return this.props.jogoId;
  }

  get motoristaNome(): string {
    return this.props.motoristaNome;
  }

  get contato(): string {
    return this.props.contato;
  }

  get horarioSaida(): Date {
    return this.props.horarioSaida;
  }

  get local(): string {
    return this.props.local;
  }

  get vagasDisponiveis(): number {
    return this.props.vagasDisponiveis;
  }

  ocuparVaga(): CaronaSolidaria {
    if (this.props.vagasDisponiveis <= 0) {
      throw new Error("Não há vagas disponíveis para esta carona.");
    }
    return this.clone({
      vagasDisponiveis: this.props.vagasDisponiveis - 1,
    } as Partial<CaronaSolidariaState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "jogoId", value: this.props.jogoId, rules: [new RequiredRule()] },
      {
        code: "motoristaNome",
        value: this.props.motoristaNome,
        rules: [new RequiredRule(), new MaxLengthRule(150)],
      },
      { code: "contato", value: this.props.contato, rules: [new RequiredRule()] },
      { code: "horarioSaida", value: this.props.horarioSaida, rules: [new RequiredRule()] },
      { code: "local", value: this.props.local, rules: [new RequiredRule()] },
      {
        code: "vagasDisponiveis",
        value: this.props.vagasDisponiveis,
        rules: [new RequiredRule(), new PositiveRule()],
      },
    ]);
  }
}
