import { Entity, EntityState } from "../entity";
import { MaxLengthRule, PositiveRule, RequiredRule, Validator } from "@/shared/validation";

export interface ProdutoState extends EntityState {
  nome: string;
  descricao?: string;
  preco?: number | null;
  imagemUrl: string;
  linkWhatsapp: string;
  ativo: boolean;
}

export class Produto extends Entity<ProdutoState> {
  private constructor(props: ProdutoState) {
    super(props);
    this.validate();
  }

  static create(props: ProdutoState): Produto {
    return new Produto(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  get descricao(): string | undefined {
    return this.props.descricao;
  }

  get preco(): number | null | undefined {
    return this.props.preco;
  }

  get imagemUrl(): string {
    return this.props.imagemUrl;
  }

  get linkWhatsapp(): string {
    return this.props.linkWhatsapp;
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
      { code: "preco", value: this.props.preco, rules: [new PositiveRule()] },
      { code: "imagemUrl", value: this.props.imagemUrl, rules: [new RequiredRule()] },
      { code: "linkWhatsapp", value: this.props.linkWhatsapp, rules: [new RequiredRule()] },
    ]);
  }
}
