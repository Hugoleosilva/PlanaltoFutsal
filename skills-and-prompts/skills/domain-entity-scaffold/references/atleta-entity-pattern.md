# Atleta Entity Pattern

Esta referencia resume o padrao estrutural que toda entidade de dominio do Planalto Futsal deve seguir, usando `Atleta` como exemplo canonico (equivalente ao antigo exemplo `User` de projetos anteriores, adaptado para o dominio de futsal).

## Estrutura da entidade

```ts
import { Entity, EntityState } from "../entity";
import {
  EmailRule,
  IntegerRule,
  MaxLengthRule,
  MinLengthRule,
  PastDateRule,
  PersonNameRule,
  PositiveRule,
  RequiredRule,
  Validator,
} from "@/shared/validation";

export interface AtletaState extends EntityState {
  nome: string;
  email: string;
  dataNascimento: Date;
  numeroCamisa: number;
}

export class Atleta extends Entity<AtletaState> {
  constructor(props: AtletaState) {
    super(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  get email(): string {
    return this.props.email;
  }

  get dataNascimento(): Date {
    return this.props.dataNascimento;
  }

  get numeroCamisa(): number {
    return this.props.numeroCamisa;
  }

  public validate(): void {
    Validator.validate([
      {
        code: "atleta.nome",
        value: this.nome,
        rules: [
          new RequiredRule(),
          new MinLengthRule(3),
          new MaxLengthRule(80),
          new PersonNameRule(),
        ],
      },
      {
        code: "atleta.email",
        value: this.email,
        rules: [new RequiredRule(), new EmailRule()],
      },
      {
        code: "atleta.dataNascimento",
        value: this.dataNascimento,
        rules: [new RequiredRule(), new PastDateRule()],
      },
      {
        code: "atleta.numeroCamisa",
        value: this.numeroCamisa,
        rules: [new RequiredRule(), new IntegerRule(), new PositiveRule()],
      },
    ]);
  }
}
```

## Padroes a preservar

- `State` estende `EntityState`
- construtor apenas chama `super(props)`
- getters explicitos
- `validate()` manual e linear com `Validator.validate([...])`
- codigos de erro previsiveis via prefixo por campo (`atleta.<campo>`)
- `Entity` e importada com caminho relativo (`../entity`, dentro de `src/core/domain`); as regras de validacao vem do alias `@/shared/validation`

## Padrao dos testes

Cobrir pelo menos:

- criacao de entidade valida
- getters
- timestamps herdados da classe base
- `clone()` preservando `id` e `createdAt` e atualizando `updatedAt`
- lazy validation
- sucesso e falha de `validate()`
- mensagens de erro esperadas
- cenarios limite de tamanho e formato

Helper observado no projeto:

```ts
function getValidationMessages(callback: () => void): string[] {
  try {
    callback();
    return [];
  } catch (error) {
    return (error as ValidationException).errors.map((item) => item.message);
  }
}
```
