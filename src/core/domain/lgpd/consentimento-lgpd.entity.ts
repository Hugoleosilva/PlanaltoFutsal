import { Entity, EntityState } from "../entity";
import { RequiredRule, Validator } from "@/shared/validation";

export interface ConsentimentoLgpdState extends EntityState {
  userId: string;
  versaoTermos: string;
  termosAceitosEm: Date;
  consentimentoImagemAceitoEm?: Date | null;
  responsavelNome?: string;
  responsavelDocumento?: string;
}

/**
 * Registro imutável de consentimento LGPD. Necessário porque o app coleta
 * documentos e fotos de atletas, inclusive potencialmente menores de idade
 * em categorias de base — o consentimento do responsável fica registrado
 * separadamente do cadastro do atleta.
 */
export class ConsentimentoLgpd extends Entity<ConsentimentoLgpdState> {
  private constructor(props: ConsentimentoLgpdState) {
    super(props);
    this.validate();
  }

  static create(props: ConsentimentoLgpdState): ConsentimentoLgpd {
    return new ConsentimentoLgpd(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get versaoTermos(): string {
    return this.props.versaoTermos;
  }

  get termosAceitosEm(): Date {
    return this.props.termosAceitosEm;
  }

  get consentimentoImagemAceitoEm(): Date | null | undefined {
    return this.props.consentimentoImagemAceitoEm;
  }

  get exigeResponsavel(): boolean {
    return Boolean(this.props.responsavelNome);
  }

  public validate(): void {
    Validator.validate([
      { code: "userId", value: this.props.userId, rules: [new RequiredRule()] },
      { code: "versaoTermos", value: this.props.versaoTermos, rules: [new RequiredRule()] },
      { code: "termosAceitosEm", value: this.props.termosAceitosEm, rules: [new RequiredRule()] },
    ]);
  }
}
