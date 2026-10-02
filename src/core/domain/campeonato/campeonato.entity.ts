import { Entity, EntityState } from "../entity";
import { InRule, MaxLengthRule, NonNegativeRule, RequiredRule, Validator } from "@/shared/validation";

export type CampeonatoStatus = "OPORTUNIDADE" | "INSCRITO" | "EM_ANDAMENTO" | "ENCERRADO";

export interface CampeonatoState extends EntityState {
  nome: string;
  dataInicio?: Date | null;
  diasDeJogo?: string[];
  horarios?: string[];
  taxaInscricao?: number | null;
  taxaArbitragem?: number | null;
  status: CampeonatoStatus;
}

export class Campeonato extends Entity<CampeonatoState> {
  private constructor(props: CampeonatoState) {
    super(props);
    this.validate();
  }

  static create(props: CampeonatoState): Campeonato {
    return new Campeonato(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  get dataInicio(): Date | null | undefined {
    return this.props.dataInicio;
  }

  get diasDeJogo(): readonly string[] {
    return this.props.diasDeJogo ?? [];
  }

  get horarios(): readonly string[] {
    return this.props.horarios ?? [];
  }

  get taxaInscricao(): number | null | undefined {
    return this.props.taxaInscricao;
  }

  get taxaArbitragem(): number | null | undefined {
    return this.props.taxaArbitragem;
  }

  get status(): CampeonatoStatus {
    return this.props.status;
  }

  encerrar(): Campeonato {
    return this.clone({ status: "ENCERRADO" } as Partial<CampeonatoState>);
  }

  public validate(): void {
    Validator.validate([
      {
        code: "nome",
        value: this.props.nome,
        rules: [new RequiredRule(), new MaxLengthRule(150)],
      },
      {
        code: "taxaInscricao",
        value: this.props.taxaInscricao,
        rules: [new NonNegativeRule()],
      },
      {
        code: "taxaArbitragem",
        value: this.props.taxaArbitragem,
        rules: [new NonNegativeRule()],
      },
      {
        code: "status",
        value: this.props.status,
        rules: [
          new RequiredRule(),
          new InRule(["OPORTUNIDADE", "INSCRITO", "EM_ANDAMENTO", "ENCERRADO"] as const),
        ],
      },
    ]);
  }
}
