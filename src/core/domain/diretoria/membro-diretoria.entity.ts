import { Entity, EntityState } from "../entity";
import { EmailRule, InRule, MaxLengthRule, PhoneBrRule, RequiredRule, Validator } from "@/shared/validation";

export const STATUS_MEMBRO_DIRETORIA = ["ATIVO", "INATIVO"] as const;
export type StatusMembroDiretoria = (typeof STATUS_MEMBRO_DIRETORIA)[number];

export interface MembroDiretoriaState extends EntityState {
  nome: string;
  funcao: string;
  fotoUrl?: string | null;
  bio?: string;
  ordem?: number;
  contato?: string;
  contatoEmail?: string;
  /**
   * Conta de login (User) vinculada a este diretor — associada
   * automaticamente quando alguém confirma o cadastro com o mesmo e-mail
   * ou WhatsApp informado aqui, dando acesso ADMIN sem precisar fazer nada
   * manualmente (ver VerificarEmailUseCase).
   */
  userId?: string | null;
  status: StatusMembroDiretoria;
}

/**
 * Perfil público de um membro da diretoria — foto, função e uma bio curta,
 * pra torcida conhecer quem toca o clube. `userId` é a única ponte com a
 * conta de login (User/ADMIN); o resto é só o "cartão de visita" público
 * dessa pessoa.
 */
export class MembroDiretoria extends Entity<MembroDiretoriaState> {
  private constructor(props: MembroDiretoriaState) {
    super(props);
    this.validate();
  }

  static create(props: MembroDiretoriaState): MembroDiretoria {
    return new MembroDiretoria(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  get funcao(): string {
    return this.props.funcao;
  }

  get fotoUrl(): string | null | undefined {
    return this.props.fotoUrl;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get ordem(): number {
    return this.props.ordem ?? 0;
  }

  get contato(): string | undefined {
    return this.props.contato;
  }

  get contatoEmail(): string | undefined {
    return this.props.contatoEmail;
  }

  get userId(): string | null | undefined {
    return this.props.userId;
  }

  get status(): StatusMembroDiretoria {
    return this.props.status;
  }

  desativar(): MembroDiretoria {
    return this.clone({ status: "INATIVO" } as Partial<MembroDiretoriaState>);
  }

  public validate(): void {
    Validator.validate([
      { code: "nome", value: this.props.nome, rules: [new RequiredRule(), new MaxLengthRule(150)] },
      { code: "funcao", value: this.props.funcao, rules: [new RequiredRule(), new MaxLengthRule(100)] },
      { code: "bio", value: this.props.bio, rules: [new MaxLengthRule(330)] },
      { code: "contato", value: this.props.contato, rules: [new PhoneBrRule()] },
      { code: "contatoEmail", value: this.props.contatoEmail, rules: [new EmailRule()] },
      {
        code: "status",
        value: this.props.status,
        rules: [new RequiredRule(), new InRule(STATUS_MEMBRO_DIRETORIA)],
      },
    ]);
  }
}
