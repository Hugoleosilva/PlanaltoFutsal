import { Entity, EntityState } from "../entity";
import { RequiredRule, Validator } from "@/shared/validation";

export interface VotoCraqueState extends EntityState {
  jogoId: string;
  atletaId: string;
  identificadorVotante: string;
}

export class VotoCraque extends Entity<VotoCraqueState> {
  private constructor(props: VotoCraqueState) {
    super(props);
    this.validate();
  }

  static create(props: VotoCraqueState): VotoCraque {
    return new VotoCraque(props);
  }

  get jogoId(): string {
    return this.props.jogoId;
  }

  get atletaId(): string {
    return this.props.atletaId;
  }

  get identificadorVotante(): string {
    return this.props.identificadorVotante;
  }

  public validate(): void {
    Validator.validate([
      { code: "jogoId", value: this.props.jogoId, rules: [new RequiredRule()] },
      { code: "atletaId", value: this.props.atletaId, rules: [new RequiredRule()] },
      {
        code: "identificadorVotante",
        value: this.props.identificadorVotante,
        rules: [new RequiredRule()],
      },
    ]);
  }
}
