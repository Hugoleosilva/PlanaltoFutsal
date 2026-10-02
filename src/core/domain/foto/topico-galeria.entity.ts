import { Entity, EntityState } from "../entity";
import { InRule, MaxLengthRule, RequiredRule, Validator } from "@/shared/validation";
import { CategoriaFoto } from "./foto.entity";

export interface TopicoGaleriaState extends EntityState {
  nome: string;
  categoria: CategoriaFoto;
}

/**
 * Um "álbum" dentro da galeria — agrupa fotos por assunto (ex: "Torneio da
 * Vila das Lavadeiras 2010") dentro de uma categoria (Atuais / Das Antigas).
 */
export class TopicoGaleria extends Entity<TopicoGaleriaState> {
  private constructor(props: TopicoGaleriaState) {
    super(props);
    this.validate();
  }

  static create(props: TopicoGaleriaState): TopicoGaleria {
    return new TopicoGaleria(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  get categoria(): CategoriaFoto {
    return this.props.categoria;
  }

  public validate(): void {
    Validator.validate([
      { code: "nome", value: this.props.nome, rules: [new RequiredRule(), new MaxLengthRule(150)] },
      {
        code: "categoria",
        value: this.props.categoria,
        rules: [new RequiredRule(), new InRule(["ANTIGA", "ATUAL"] as const)],
      },
    ]);
  }
}
