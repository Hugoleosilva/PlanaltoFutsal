import { Entity, EntityState } from "../entity";
import { InRule, RequiredRule, Validator } from "@/shared/validation";

export const AUDIT_ACTIONS = [
  "FOTO_APROVADA",
  "FOTO_REJEITADA",
  "ATLETA_CRIADO",
  "ATLETA_EDITADO",
  "ATLETA_DESATIVADO",
  "MOVIMENTACAO_FINANCEIRA_CRIADA",
  "MOVIMENTACAO_FINANCEIRA_EDITADA",
  "MOVIMENTACAO_FINANCEIRA_EXCLUIDA",
  "MENSALIDADE_MARCADA_PAGA",
  "CAMPEONATO_CRIADO",
  "CAMPEONATO_EDITADO",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLogState extends EntityState {
  action: AuditAction;
  actorUserId: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Trilha de auditoria para ações críticas (aprovação de fotos, exclusão de
 * atletas, movimentações financeiras). Nunca é editada ou removida após a
 * criação — apenas anexada.
 */
export class AuditLog extends Entity<AuditLogState> {
  private constructor(props: AuditLogState) {
    super(props);
    this.validate();
  }

  static create(props: AuditLogState): AuditLog {
    return new AuditLog(props);
  }

  get action(): AuditAction {
    return this.props.action;
  }

  get actorUserId(): string {
    return this.props.actorUserId;
  }

  get entityType(): string {
    return this.props.entityType;
  }

  get entityId(): string {
    return this.props.entityId;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  public validate(): void {
    Validator.validate([
      { code: "action", value: this.props.action, rules: [new RequiredRule(), new InRule(AUDIT_ACTIONS)] },
      { code: "actorUserId", value: this.props.actorUserId, rules: [new RequiredRule()] },
      { code: "entityType", value: this.props.entityType, rules: [new RequiredRule()] },
      { code: "entityId", value: this.props.entityId, rules: [new RequiredRule()] },
    ]);
  }
}
