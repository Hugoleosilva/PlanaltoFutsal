import { randomUUID } from "node:crypto";
import { DateRule, RequiredRule, Validator } from "@/shared/validation";

export interface EntityState {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export abstract class Entity<TState extends EntityState> {
  protected readonly props: Readonly<TState>;

  protected constructor(props: TState) {
    const createdAt = props.createdAt ?? new Date();
    const updatedAt = props.updatedAt ?? cloneDate(createdAt);
    const deletedAt = props.deletedAt ?? null;

    this.props = Object.freeze({
      ...props,
      id: props.id ?? randomUUID(),
      createdAt: cloneDate(createdAt),
      updatedAt: cloneDate(updatedAt),
      deletedAt: deletedAt === null ? null : cloneDate(deletedAt),
    }) as Readonly<TState>;

    this.validateTimestamps();
  }

  get id(): string {
    return this.props.id!;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null && this.props.deletedAt !== undefined;
  }

  equals(entity?: Entity<TState> | null): boolean {
    return entity !== null && entity !== undefined && this.id === entity.id;
  }

  clone(data: Partial<TState>): this {
    const EntityClass = this.constructor as new (props: TState) => this;

    return new EntityClass({
      ...(this.props as TState),
      ...data,
      updatedAt: data.updatedAt ?? new Date(),
    });
  }

  public abstract validate(): void;

  private validateTimestamps(): void {
    Validator.validate([
      {
        code: "createdAt",
        value: this.createdAt,
        rules: [new RequiredRule(), new DateRule()],
      },
      {
        code: "updatedAt",
        value: this.updatedAt,
        rules: [new RequiredRule(), new DateRule()],
      },
      {
        code: "deletedAt",
        value: this.deletedAt,
        rules: [new DateRule()],
      },
    ]);
  }
}

function cloneDate(value: Date): Date {
  return new Date(value.getTime());
}
