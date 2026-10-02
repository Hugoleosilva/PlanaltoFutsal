import { Entity, EntityState } from "../entity";
import { MaxLengthRule, RequiredRule, Validator } from "@/shared/validation";

export interface MensagemChatState extends EntityState {
  autorUserId: string;
  autorNome: string;
  texto: string;
}

/**
 * Sala única de chat entre diretores — não é 1:1, todo ADMIN logado vê e
 * participa da mesma conversa.
 */
export class MensagemChat extends Entity<MensagemChatState> {
  private constructor(props: MensagemChatState) {
    super(props);
    this.validate();
  }

  static create(props: MensagemChatState): MensagemChat {
    return new MensagemChat(props);
  }

  get autorUserId(): string {
    return this.props.autorUserId;
  }

  get autorNome(): string {
    return this.props.autorNome;
  }

  get texto(): string {
    return this.props.texto;
  }

  public validate(): void {
    Validator.validate([
      { code: "autorUserId", value: this.props.autorUserId, rules: [new RequiredRule()] },
      { code: "autorNome", value: this.props.autorNome, rules: [new RequiredRule()] },
      {
        code: "texto",
        value: this.props.texto,
        rules: [new RequiredRule(), new MaxLengthRule(1000)],
      },
    ]);
  }
}
