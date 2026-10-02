import { Entity, EntityState } from "../entity";
import {
  EmailRule,
  RequiredRule,
  Validator,
  InRule,
  MinLengthRule,
  PhoneBrRule,
  PositiveRule,
} from "@/shared/validation";
import { Role, ROLES } from "@/shared/types/role";

export const USER_STATUSES = ["PENDENTE_VERIFICACAO", "ATIVO", "INATIVO"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const TIPOS_PLANO_SOCIO = ["MENSAL", "UNICO"] as const;
export type TipoPlanoSocio = (typeof TIPOS_PLANO_SOCIO)[number];

export interface UserState extends EntityState {
  name: string;
  email: string;
  whatsapp?: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  atletaId?: string | null;
  emailVerificadoEm?: Date | null;
  termsAcceptedAt?: Date | null;
  imageConsentAcceptedAt?: Date | null;
  socio?: boolean;
  socioDesde?: Date | null;
  socioTipoPlano?: TipoPlanoSocio | null;
  socioValorPlano?: number | null;
  socioDiaVencimento?: number | null;
}

export class User extends Entity<UserState> {
  private constructor(props: UserState) {
    super(props);
    this.validate();
  }

  static create(props: UserState): User {
    return new User(props);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get whatsapp(): string | undefined {
    return this.props.whatsapp;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): Role {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get atletaId(): string | null | undefined {
    return this.props.atletaId;
  }

  get emailVerificadoEm(): Date | null | undefined {
    return this.props.emailVerificadoEm;
  }

  get isEmailVerificado(): boolean {
    return this.props.emailVerificadoEm !== null && this.props.emailVerificadoEm !== undefined;
  }

  get hasAcceptedTerms(): boolean {
    return this.props.termsAcceptedAt !== null && this.props.termsAcceptedAt !== undefined;
  }

  get hasAcceptedImageConsent(): boolean {
    return (
      this.props.imageConsentAcceptedAt !== null &&
      this.props.imageConsentAcceptedAt !== undefined
    );
  }

  get isSocio(): boolean {
    return this.props.socio === true;
  }

  get socioDesde(): Date | null | undefined {
    return this.props.socioDesde;
  }

  get socioTipoPlano(): TipoPlanoSocio | null | undefined {
    return this.props.socioTipoPlano;
  }

  get socioValorPlano(): number | null | undefined {
    return this.props.socioValorPlano;
  }

  get socioDiaVencimento(): number | null | undefined {
    return this.props.socioDiaVencimento;
  }

  isAdmin(): boolean {
    return this.props.role === "ADMIN";
  }

  isAtleta(): boolean {
    return this.props.role === "ATLETA";
  }

  deactivate(): User {
    return this.clone({ status: "INATIVO" });
  }

  confirmarEmail(): User {
    return this.clone({ emailVerificadoEm: new Date(), status: "ATIVO" });
  }

  promoverParaAtleta(atletaId: string): User {
    return this.clone({ role: "ATLETA", atletaId });
  }

  tornarSocio(plano: {
    tipo: TipoPlanoSocio;
    valor: number;
    diaVencimento?: number | null;
  }): User {
    return this.clone({
      socio: true,
      socioDesde: this.isSocio ? this.props.socioDesde : new Date(),
      socioTipoPlano: plano.tipo,
      socioValorPlano: plano.valor,
      socioDiaVencimento: plano.tipo === "MENSAL" ? (plano.diaVencimento ?? null) : null,
    });
  }

  public validate(): void {
    Validator.validate([
      { code: "name", value: this.props.name, rules: [new RequiredRule(), new MinLengthRule(2)] },
      { code: "email", value: this.props.email, rules: [new RequiredRule(), new EmailRule()] },
      { code: "whatsapp", value: this.props.whatsapp, rules: [new PhoneBrRule()] },
      { code: "passwordHash", value: this.props.passwordHash, rules: [new RequiredRule()] },
      { code: "role", value: this.props.role, rules: [new RequiredRule(), new InRule(ROLES)] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(USER_STATUSES)],
      },
      {
        code: "socioTipoPlano",
        value: this.props.socioTipoPlano,
        rules: [new InRule(TIPOS_PLANO_SOCIO)],
      },
      { code: "socioValorPlano", value: this.props.socioValorPlano, rules: [new PositiveRule()] },
    ]);
  }
}
