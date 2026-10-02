import { Entity, EntityState } from "../entity";
import { MaxItemsRule, MaxLengthRule, MinItemsRule, PositiveRule, RequiredRule, Validator } from "@/shared/validation";

const MAX_IMAGENS = 4;

export interface ProdutoState extends EntityState {
  nome: string;
  descricao?: string;
  preco?: number | null;
  imagensUrls: string[];
  linkWhatsapp?: string;
  destaque: boolean;
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

  get imagensUrls(): readonly string[] {
    return this.props.imagensUrls;
  }

  get linkWhatsapp(): string | undefined {
    return this.props.linkWhatsapp;
  }

  get destaque(): boolean {
    return this.props.destaque;
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
      {
        code: "imagensUrls",
        value: this.props.imagensUrls,
        rules: [new RequiredRule(), new MinItemsRule(1), new MaxItemsRule(MAX_IMAGENS)],
      },
    ]);
  }
}
