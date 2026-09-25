import { Entity, EntityState } from "../entity";
import { InRule, MaxLengthRule, RequiredRule, Validator } from "@/shared/validation";

export type TipoComunicado = "AVISO" | "NOTICIA";

export interface ComunicadoState extends EntityState {
  titulo: string;
  corpo: string;
  tipo: TipoComunicado;
  fixado: boolean;
  autorUserId: string;
  publicadoEm: Date;
}

export class Comunicado extends Entity<ComunicadoState> {
  private constructor(props: ComunicadoState) {
    super(props);
    this.validate();
  }

  static create(props: ComunicadoState): Comunicado {
    return new Comunicado(props);
  }

  get titulo(): string {
    return this.props.titulo;
  }

  get corpo(): string {
    return this.props.corpo;
  }

  get tipo(): TipoComunicado {
    return this.props.tipo;
  }

  get fixado(): boolean {
    return this.props.fixado;
  }

  get autorUserId(): string {
    return this.props.autorUserId;
  }

  get publicadoEm(): Date {
    return this.props.publicadoEm;
  }

  public validate(): void {
    Validator.validate([
      {
        code: "titulo",
        value: this.props.titulo,
        rules: [new RequiredRule(), new MaxLengthRule(200)],
      },
      { code: "corpo", value: this.props.corpo, rules: [new RequiredRule()] },
      {
        code: "tipo",
        value: this.props.tipo,
        rules: [new RequiredRule(), new InRule(["AVISO", "NOTICIA"] as const)],
      },
      { code: "autorUserId", value: this.props.autorUserId, rules: [new RequiredRule()] },
    ]);
  }
}
