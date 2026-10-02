import { Entity, EntityState } from "../entity";
import { MaxLengthRule, RequiredRule, UrlRule, Validator } from "@/shared/validation";

export interface PatrocinadorState extends EntityState {
  nome: string;
  logoUrl: string;
  depoimento?: string;
  link?: string;
  ativo: boolean;
  ordem?: number;
  escala?: number;
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

  get ordem(): number {
    return this.props.ordem ?? 0;
  }

  get escala(): number {
    return this.props.escala ?? 100;
  }

  editar(props: {
    nome: string;
    logoUrl: string;
    depoimento?: string;
    link?: string;
    ordem?: number;
    escala?: number;
  }): Patrocinador {
    return this.clone(props);
  }

  desativar(): Patrocinador {
    return this.clone({ ativo: false });
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
