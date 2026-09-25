import { Entity, EntityState } from "../entity";
import { EmailRule, RequiredRule, Validator, InRule, MinLengthRule } from "@/shared/validation";
import { Role, ROLES } from "@/shared/types/role";

export type UserStatus = "ATIVO" | "INATIVO";

export interface UserState extends EntityState {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  atletaId?: string | null;
  termsAcceptedAt?: Date | null;
  imageConsentAcceptedAt?: Date | null;
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

  get hasAcceptedTerms(): boolean {
    return this.props.termsAcceptedAt !== null && this.props.termsAcceptedAt !== undefined;
  }

  get hasAcceptedImageConsent(): boolean {
    return (
      this.props.imageConsentAcceptedAt !== null &&
      this.props.imageConsentAcceptedAt !== undefined
    );
  }

  isAdmin(): boolean {
    return this.props.role === "ADMIN";
  }

  isAtleta(): boolean {
    return this.props.role === "ATLETA";
  }

  deactivate(): User {
    return this.clone({ status: "INATIVO" } as Partial<UserState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "name", value: this.props.name, rules: [new RequiredRule(), new MinLengthRule(2)] },
      { code: "email", value: this.props.email, rules: [new RequiredRule(), new EmailRule()] },
      { code: "passwordHash", value: this.props.passwordHash, rules: [new RequiredRule()] },
      { code: "role", value: this.props.role, rules: [new RequiredRule(), new InRule(ROLES)] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(["ATIVO", "INATIVO"] as const)],
      },
    ]);
  }
}
