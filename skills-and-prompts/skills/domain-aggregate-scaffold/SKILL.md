---
name: domain-aggregate-scaffold
description: Cria a estrutura padronizada de um agregado de dominio do Planalto Futsal (ex Atleta, Campeonato, Financeiro, Foto, Carona) dentro de src/core, organizando pastas, arquivos-base e nomenclaturas de entidade, contrato de repositorio e casos de uso para acelerar a evolucao consistente do projeto.
---

# Domain Aggregate Scaffold

Use o script `scripts/create-aggregate.js` para criar de forma deterministica a estrutura base de um agregado de dominio dentro do app Next.js unico deste projeto.

Este projeto nao tem `modules/<modulo>` nem workspaces separados. Todo agregado de dominio vive em duas pastas irmãs de `src/core`:

- `src/core/domain/<aggregate>/` — entidade e contrato de repositorio (porta).
- `src/core/use-cases/<aggregate>/` — casos de uso puros que dependem do contrato de repositorio.

A implementacao concreta de persistencia (schema Mongoose + repositorio) e a exposicao HTTP (Route Handler / Server Action) **nao** fazem parte desta skill — ver `nextjs-module-scaffold` e a implementacao de infraestrutura em `src/infrastructure/database`.

## Pre-requisito

Esta skill depende do kernel compartilhado (`Entity`, `CrudRepository`, `UseCase`) ja materializado por `shared-kernel-scaffold` em `src/core/domain/entity.ts`, `src/core/domain/repositories/` e `src/core/use-cases/use-case.ts`. O script falha com uma mensagem clara se esses arquivos nao existirem.

## Entradas obrigatorias

1. `nome do agregado` (ex.: `atleta`, `campeonato`, `financeiro`, `foto`, `carona`).

## Entrada opcional, mas recomendada

2. `tipo de estrutura inicial dos casos de uso`:
   - `crud`
   - `example`

Se o pedido nao informar essa segunda entrada, interrompa e pergunte de forma objetiva:

`Deseja criar a base de usecases em "crud" ou "example"?`

Sem essa resposta, nao executar a skill.

## Fluxo

1. Validar que o pedido informa explicitamente o nome do agregado.
2. Normalizar o nome do agregado para `kebab-case` em pastas e arquivos.
3. Se `mode` nao vier no pedido, fazer a pergunta objetiva acima e aguardar.
4. Executar a partir da raiz do projeto Next.js:

```bash
node .agents/skills/domain-aggregate-scaffold/scripts/create-aggregate.js --aggregate atleta --mode crud
```

5. Verificar ao final:
   - `src/core/domain/<aggregate>/<aggregate>.entity.ts`
   - `src/core/domain/<aggregate>/<aggregate>.repository.ts`
   - `src/core/domain/<aggregate>/index.ts`
   - `src/core/use-cases/<aggregate>/index.ts`
   - os casos de uso do modo escolhido em `src/core/use-cases/<aggregate>/`

## O que a skill cria

- Estrutura do agregado em `src/core/domain/<aggregate>/` e `src/core/use-cases/<aggregate>/`.
- Entidade base com `Entity` e `EntityState` (importados de `../entity`, relativo dentro de `src/core/domain`).
- Contrato inicial de repositorio com `CrudRepository` (importado de `../repositories`).
- Arquivos `index.ts` necessarios para exportar o agregado.
- Casos de uso minimos conforme o modo solicitado, importando `UseCase` de `../../use-case` e a entidade/repositorio de `../../domain/<aggregate>`.

## Modos de usecase

### `crud`

Cria a base padronizada em `src/core/use-cases/<aggregate>/`:

- `create-<aggregate>.usecase.ts`
- `update-<aggregate>.usecase.ts`
- `delete-<aggregate>.usecase.ts`
- `find-<aggregate>-by-id.usecase.ts`
- `find-<aggregate>-page.usecase.ts`

### `example`

Cria apenas um caso de uso minimo e generico para demonstrar a estrutura:

- `create-<aggregate>.usecase.ts`

## Convencoes obrigatorias

- Nao implementar regras reais de negocio.
- Nao inventar atributos especificos do agregado (o time preenche depois com `domain-entity-scaffold`).
- Nao assumir uma abordagem opinativa de DDD alem da organizacao ja usada no projeto (entidade + porta de repositorio em `domain`, casos de uso em `use-cases`).
- Nao criar Route Handler, Server Action, schema Mongoose ou qualquer infraestrutura adicional — isso pertence a `nextjs-module-scaffold` e a implementacoes de `src/infrastructure/database`.
- Preservar exports existentes em `index.ts` de outros agregados.
- Usar apenas recursos contidos nesta skill em `.agents/skills/domain-aggregate-scaffold`.

## Recursos internos

- `scripts/create-aggregate.js`: materializa a estrutura do agregado.
- `assets/common/domain/`: templates base da entidade, do contrato de repositorio e do `index.ts` do agregado.
- `assets/common/use-cases/`: template do `index.ts` dos casos de uso.
- `assets/usecase/crud/`: templates dos casos de uso CRUD.
- `assets/usecase/example/`: template do caso de uso minimo de exemplo.

## Guardrails

- Nao executar quando `src/core/domain/entity.ts` ou `src/core/use-cases/use-case.ts` nao existirem (rodar `shared-kernel-scaffold` primeiro).
- Nao executar quando o agregado ja existir.
- Nao inferir o modo `crud` ou `example` quando ele nao vier no pedido.
- Nao editar arquivos fora de `src/core/domain/<aggregate>/` e `src/core/use-cases/<aggregate>/`, exceto a propria skill.
- Nao adicionar documentacao extra fora dos arquivos da skill.
