## Contexto

Este catalogo de skills e prompts foi adaptado para o Planalto Futsal: um unico app Next.js (App Router, Server Actions + Route Handlers), TypeScript estrito sem `any`, MongoDB com Mongoose, Clean Architecture + DDD (`/src/core/domain`, `/src/core/use-cases`, `/src/infrastructure/*`, `/src/shared`), autenticacao via NextAuth.js/Auth.js com RBAC (`ADMIN`, `ATLETA`, `USER`), Tailwind + shadcn/ui e PWA. Nao ha Turborepo, NestJS nem Prisma neste projeto — as skills antigas que dependiam dessas tecnologias foram descartadas; as que descreviam padroes agnosticos de stack (entidade, caso de uso, validacao, erros de dominio) foram mantidas e adaptadas.

## Ordem Sugerida

1. `shared-kernel-scaffold`
   Materializa o kernel compartilhado do app (`Entity`, `UseCase`, hierarquia de erros de dominio e motor de validacao com regras reutilizaveis) em `src/core`, `src/infrastructure/errors` e `src/shared/validation`. E o unico pre-requisito de todas as skills de dominio abaixo.

2. `shared-validation-rule`
   Cria novas regras reutilizaveis de validacao em `src/shared/validation/rules`, com testes e exports corretos, sempre que uma entidade precisar de uma regra que ainda nao existe (ex.: validacao de numero de camisa, categoria de idade).

3. `domain-aggregate-scaffold`
   Cria a estrutura padronizada de um agregado de dominio (Atleta, Campeonato, Financeiro, Foto, Carona, Usuario, etc.) em `src/core/domain/<agregado>` e `src/core/use-cases/<agregado>`.

4. `domain-entity-scaffold`
   Cria a entidade do agregado com validacao lazy, estado tipado e testes unitarios com cobertura de 100%.

5. `domain-repository-scaffold`
   Cria o contrato do repositorio (porta de dominio) do agregado e tambem uma implementacao fake/in-memory para uso em testes de casos de uso.

6. `domain-use-case-scaffold`
   Cria os casos de uso do agregado, com contratos `In`/`Out`, testes unitarios e reaproveitamento das fakes ja existentes.

7. `infrastructure-provider-scaffold`
   Implementa em `src/infrastructure` os providers tecnicos definidos como contratos no dominio (criptografia de senha, JWT/sessao, e-mail, uuid, etc.), como classes TypeScript simples — sem container de DI, ja que este projeto nao usa NestJS.

8. `nextjs-module-scaffold`
   Cria a superficie Next.js de um modulo (Route Handler em `src/app/api/<modulo>`, Server Action e pagina App Router em `src/app/(public|private)/<modulo>`), conectando aos casos de uso ja criados.

9. `nextjs-auth-rbac-spec`
   Skill de mais alto nivel, usada por ultimo, para orquestrar varias das skills anteriores e montar a base completa de autenticacao (NextAuth.js) e RBAC (`ADMIN`/`ATLETA`/`USER`) do app.

## Resumo de Uso Para o Dev

A sequencia natural e:

1. materializar o kernel compartilhado (uma vez, no inicio do projeto)
2. criar o agregado de dominio de um modulo (ex.: Atleta)
3. criar a entidade, regras de validacao especificas, repositorio (com fake) e casos de uso desse agregado
4. implementar a versao Mongoose do repositorio em `src/infrastructure/database/<agregado>/` (implementacao manual, sem skill dedicada — ver nota abaixo)
5. criar a superficie Next.js (Route Handler / Server Action / pagina) que expõe os casos de uso
6. repetir os passos 2-5 para cada agregado do dominio do Planalto Futsal (Atleta, Campeonato, Financeiro, Foto, Carona, Noticia, ...)
7. por fim, usar `nextjs-auth-rbac-spec` para acelerar a montagem do fluxo completo de autenticacao e RBAC (que por sua vez reaproveita os passos 2-5 para o agregado `Usuario`)

**Nota sobre a implementacao Mongoose**: por decisao explicita do projeto ("Prisma nao é a persistência, Mongoose é"), a implementacao concreta do repositorio com Mongoose (`src/infrastructure/database/<agregado>/<agregado>.repository.mongoose.ts` + schema) nao tem skill dedicada neste catalogo — ela e simples o suficiente para ser escrita diretamente a partir do contrato criado por `domain-repository-scaffold`, seguindo o padrao de mapeamento documentado em `domain-repository-scaffold/references/repository-pattern.md`.

## Regra Pratica

- `shared-*`: kernel e utilitarios reutilizaveis por todo o app.
- `domain-*`: constroem o dominio (entidade, repositorio, caso de uso) dentro de `src/core`.
- `infrastructure-*`: conectam dominio a tecnologia concreta (criptografia, JWT, e-mail) em `src/infrastructure`.
- `nextjs-*`: conectam dominio a HTTP/UI (Route Handlers, Server Actions, paginas App Router) em `src/app`.
- `*-spec`: orquestram tudo para um cenario maior (ex.: autenticacao e RBAC completos).

## O que foi descartado deste catalogo (e por que)

As skills abaixo existiam em um projeto anterior com stack diferente (Turborepo + NestJS + Prisma) e foram removidas porque nao se aplicam a este projeto (Next.js unico + Mongoose):

- `backend-nest-config`, `backend-nest-controller` — infraestrutura compartilhada e controllers do NestJS; este projeto usa Route Handlers/Server Actions do Next.js.
- `backend-prisma-repository`, `backend-prisma-sync-module` — implementacao Prisma e sincronizacao de schema/migrations; este projeto usa Mongoose (schemas, nao migrations SQL).
- `config-prisma` — setup de infraestrutura Prisma/Postgres; nao se aplica a MongoDB/Mongoose.
- `config-project-fullstack` — bootstrap de um monorepo Turborepo com `apps/frontend` + `apps/backend`; este projeto e um unico app Next.js, ja inicializado por outro processo.
