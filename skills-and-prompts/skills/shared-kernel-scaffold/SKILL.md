---
name: shared-kernel-scaffold
description: Materializa o kernel compartilhado da aplicacao Planalto Futsal (Next.js + Mongoose), concentrando a classe base de entidade, o contrato de caso de uso, a hierarquia de erros de dominio e o motor de validacao reutilizavel consumidos por todos os modulos do dominio (Atleta, Campeonato, Financeiro, Foto, Carona, etc.).
---

# Shared Kernel Scaffold

Use o script `scripts/scaffold-kernel.js` para materializar de forma deterministica o kernel compartilhado dentro do app Next.js unico deste projeto, em vez de recriar esses arquivos manualmente.

Este projeto **nao** e um monorepo Turborepo com `packages/shared`. E um unico app Next.js (App Router) com Clean Architecture organizada em `/src`. O kernel compartilhado desta skill e distribuido em tres pastas de `/src`, conforme a convencao do projeto:

- `src/core/domain/` — classe base `Entity<TState>` e os contratos (ports) de repositorio.
- `src/core/use-cases/` — contrato base `UseCase<IN, OUT>`.
- `src/infrastructure/errors/` — hierarquia `DomainError` (`NotFoundError`, `UnauthorizedError`, `ValidationError`, `ValidationException`).
- `src/shared/validation/` — `Validator`, utilitarios de regra (`rule.utils.ts`) e o catalogo de ~60 regras de validacao reutilizaveis (`email`, `cpf`, `cep`, `phone-br`, `strong-password`, etc.).

## Fluxo

1. Executar a partir da raiz do projeto Next.js:

```bash
node .agents/skills/shared-kernel-scaffold/scripts/scaffold-kernel.js --dry-run
node .agents/skills/shared-kernel-scaffold/scripts/scaffold-kernel.js --apply
```

2. O script deve:
   - copiar `assets/kernel-template/core` para `src/core` (mesclando com o que ja existir, sem sobrescrever arquivos de dominio ja customizados sem `--force`);
   - copiar `assets/kernel-template/infrastructure/errors` para `src/infrastructure/errors`;
   - copiar `assets/kernel-template/shared/validation` para `src/shared/validation`;
   - garantir que `tsconfig.json` do projeto define o alias `"@/*": ["./src/*"]`, necessario porque o kernel usa imports absolutos (`@/shared/validation`, `@/infrastructure/errors`) entre as tres pastas;
   - reportar os arquivos criados, atualizados e os que foram preservados por ja existirem.

## Base canonica

Toda a base deterministica fica dentro desta skill, em `assets/kernel-template/`, espelhando exatamente o destino final em `src/`:

```text
assets/kernel-template/
  core/
    domain/
      entity.ts
      entity.test.ts
      index.ts
      repositories/
        create.repository.ts
        update.repository.ts
        delete.repository.ts
        find-by-id.repository.ts
        find-page.repository.ts
        crud.repository.ts
        page-result.ts
        index.ts
    use-cases/
      use-case.ts
      use-case.test.ts
      index.ts
  infrastructure/
    errors/
      domain.error.ts
      not-found.error.ts
      unauthorized.error.ts
      validation.error.ts
      validation.exception.ts
      index.ts
  shared/
    validation/
      validator.ts
      validator.test.ts
      rule.utils.ts
      rule.utils.test.ts
      validation-field.interface.ts
      validation-rule.interface.ts
      index.ts
      rules/
        *.rule.ts (required, email, cpf, cnpj, cep, rg, phone, phone-br, strong-password, no-common-password, ...)
        *.test.ts (agrupados por tema: string-rules, numeric-rules, brazil-rules, security-rules, etc.)
```

Nao depender de templates, scripts ou pastas externas para reconstruir o kernel.

## Conteudo (o que cada pasta resolve)

- `core/domain/entity.ts`: classe abstrata `Entity<TState extends EntityState>` — gera `id` (uuid v4) quando ausente, congela `props`, valida `id`/`createdAt`/`updatedAt`/`deletedAt` automaticamente na construcao, expoe `equals`, `clone` e o metodo abstrato `validate()` que cada entidade de dominio (Atleta, Campeonato, Financeiro...) implementa.
- `core/domain/repositories/*`: contratos de persistencia (`CreateRepository`, `UpdateRepository`, `DeleteRepository`, `FindByIdRepository`, `FindPageRepository`, `CrudRepository`, `PageResult<T>`). Sao **portas de dominio**: a implementacao concreta com Mongoose fica em `src/infrastructure/database/`, nunca aqui.
- `core/use-cases/use-case.ts`: `interface UseCase<IN, OUT> { execute(input: IN): Promise<OUT>; }` — contrato que toda regra de negocio pura implementa.
- `infrastructure/errors/*`: `DomainError` (base, com `statusCode`), `NotFoundError`, `UnauthorizedError`, `ValidationError`, `ValidationException` — a hierarquia de `AppError` exigida pelo projeto, pronta para ser traduzida por um handler central de erros em `src/infrastructure/errors/handler.ts` (a criar fora desta skill, no Route Handler / Server Action).
- `shared/validation/*`: motor de validacao lazy e explicito (`Validator.validate([...])`) e o catalogo de regras reutilizaveis entre todas as entidades do dominio.

## Restricoes

- Nao copiar `dist`, `coverage`, `.next`, `node_modules` ou qualquer artefato gerado.
- Nao embutir nome de cliente, empresa ou scope de pacote npm nos arquivos-base da skill (este projeto nao publica pacotes npm internos).
- Nao reintroduzir a nocao de "package shared" separado do app — o destino e sempre dentro de `src/` do proprio app Next.js.
- Nao usar `file:`, workspaces ou links locais — nao ha monorepo aqui.
- Nao recriar os arquivos do kernel em tempo de execucao por geracao ad hoc; sempre copiar a base fiel de `assets/kernel-template/`.
- Nao sobrescrever entidades, casos de uso, erros ou regras de validacao ja customizadas por um modulo real do dominio sem confirmacao explicita (`--force`).

## Convencao de import

Como o kernel agora vive em tres pastas de topo diferentes (`core/domain`, `core/use-cases`, `infrastructure/errors`, `shared/validation`) em vez de um unico pacote, os cruzamentos entre elas usam o alias `@/`:

- `core/domain/entity.ts` importa regras de `@/shared/validation`.
- `shared/validation/validator.ts` importa `ValidationException`/`ValidationError` de `@/infrastructure/errors`.

Dentro de uma mesma pasta (por exemplo, entre as regras em `shared/validation/rules/`), continue usando imports relativos (`./rule.utils`, `../validator`).

## Manutencao

Quando o kernel real em `src/` mudar de forma que deva virar novo padrao do projeto, atualizar primeiro os arquivos de `assets/kernel-template/`, mantendo os imports `@/...` para as pastas irmãs.
