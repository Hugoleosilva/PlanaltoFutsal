import { Entity, EntityState } from "../entity";
import { InRule, RequiredRule, Validator } from "@/shared/validation";

export type TipoEventoJogo = "GOL" | "ASSISTENCIA" | "CARTAO_AMARELO" | "CARTAO_VERMELHO";

export interface EventoJogoState extends EntityState {
  jogoId: string;
  atletaId: string;
  tipo: TipoEventoJogo;
  minuto?: number | null;
}

export class EventoJogo extends Entity<EventoJogoState> {
  private constructor(props: EventoJogoState) {
    super(props);
    this.validate();
  }

  static create(props: EventoJogoState): EventoJogo {
    return new EventoJogo(props);
  }

  get jogoId(): string {
    return this.props.jogoId;
  }

  get atletaId(): string {
    return this.props.atletaId;
  }

  get tipo(): TipoEventoJogo {
    return this.props.tipo;
  }

  get minuto(): number | null | undefined {
    return this.props.minuto;
  }

  get isCartao(): boolean {
    return this.props.tipo === "CARTAO_AMARELO" || this.props.tipo === "CARTAO_VERMELHO";
  }

  public validate(): void {
    Validator.validate([
      { code: "jogoId", value: this.props.jogoId, rules: [new RequiredRule()] },
      { code: "atletaId", value: this.props.atletaId, rules: [new RequiredRule()] },
      {
        code: "tipo",
        value: this.props.tipo,
        rules: [
          new RequiredRule(),
          new InRule(["GOL", "ASSISTENCIA", "CARTAO_AMARELO", "CARTAO_VERMELHO"] as const),
        ],
      },
    ]);
  }
}
