import { Entity, EntityState } from "../entity";
import { InRule, MinItemsRule, RequiredRule, Validator } from "@/shared/validation";

export type StatusEnquete = "ATIVA" | "ENCERRADA";

export interface OpcaoEnquete {
  id: string;
  texto: string;
  votos: number;
}

export interface EnqueteState extends EntityState {
  pergunta: string;
  opcoes: OpcaoEnquete[];
  status: StatusEnquete;
  criadoPorUserId: string;
}

export class Enquete extends Entity<EnqueteState> {
  private constructor(props: EnqueteState) {
    super(props);
    this.validate();
  }

  static create(props: EnqueteState): Enquete {
    return new Enquete(props);
  }

  get pergunta(): string {
    return this.props.pergunta;
  }

  get opcoes(): readonly OpcaoEnquete[] {
    return this.props.opcoes;
  }

  get status(): StatusEnquete {
    return this.props.status;
  }

  votar(opcaoId: string): Enquete {
    if (this.props.status === "ENCERRADA") {
      throw new Error("Esta enquete já foi encerrada.");
    }

    const opcoes = this.props.opcoes.map((opcao) =>
      opcao.id === opcaoId ? { ...opcao, votos: opcao.votos + 1 } : opcao,
    );

    return this.clone({ opcoes } as Partial<EnqueteState>);
  }

  encerrar(): Enquete {
    return this.clone({ status: "ENCERRADA" } as Partial<EnqueteState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "pergunta", value: this.props.pergunta, rules: [new RequiredRule()] },
      {
        code: "opcoes",
        value: this.props.opcoes,
        rules: [new RequiredRule(), new MinItemsRule(2)],
      },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(["ATIVA", "ENCERRADA"] as const)],
      },
    ]);
  }
}
