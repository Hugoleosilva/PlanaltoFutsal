import { Entity, EntityState } from "../entity";
import { MaxLengthRule, RequiredRule, UrlRule, Validator } from "@/shared/validation";

export interface PatrocinadorState extends EntityState {
  nome: string;
  logoUrl: string;
  depoimento?: string;
  link?: string;
  ativo: boolean;
}

export class Patrocinador extends Entity<PatrocinadorState> {
  private constructor(props: PatrocinadorState) {
    super(props);
    this.validate();
  }

  static create(props: PatrocinadorState): Patrocinador {
    return new Patrocinador(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  get logoUrl(): string {
    return this.props.logoUrl;
  }

  get depoimento(): string | undefined {
    return this.props.depoimento;
  }

  get link(): string | undefined {
    return this.props.link;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  public validate(): void {
    Validator.validate([
      {
        code: "nome",
        value: this.props.nome,
        rules: [new RequiredRule(), new MaxLengthRule(150)],
      },
      { code: "logoUrl", value: this.props.logoUrl, rules: [new RequiredRule()] },
      { code: "link", value: this.props.link, rules: [new UrlRule()] },
    ]);
  }
}
