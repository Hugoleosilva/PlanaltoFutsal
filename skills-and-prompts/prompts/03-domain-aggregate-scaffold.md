Crie uma skill chamada `domain-aggregate-scaffold` dentro de `skills-and-prompts/skills/domain-aggregate-scaffold` para criar de forma deterministica a estrutura base de um agregado de dominio do Planalto Futsal (Atleta, Campeonato, Financeiro, Foto, Carona, Usuario, etc.) dentro de `src/core`.

No `SKILL.md`, defina:

- `name`: `domain-aggregate-scaffold`
- `description`: `Cria a estrutura padronizada de um agregado de dominio do Planalto Futsal dentro de src/core, organizando pastas, arquivos-base e nomenclaturas de entidade, contrato de repositorio e casos de uso para acelerar a evolucao consistente do projeto.`

Contexto importante: este projeto NAO tem `modules/<modulo>` nem workspaces separados (nao ha Turborepo). Todo agregado de dominio vive em duas pastas irmãs de `src/core`:

- `src/core/domain/<aggregate>/` — entidade e contrato de repositorio (porta).
- `src/core/use-cases/<aggregate>/` — casos de uso puros que dependem do contrato de repositorio.

Objetivo da skill:

- Criar a estrutura inicial de arquivos de um agregado nessas duas pastas.
- Padronizar nomes e organizacao.
- Nao implementar regras de negocio reais nem inventar atributos especificos do agregado.
- Focar em estrutura, convencoes e placeholders minimos para o time continuar a implementacao depois (com `domain-entity-scaffold`, `domain-repository-scaffold`, `domain-use-case-scaffold`).

Entradas obrigatorias da skill:

1. O nome do agregado (ex.: `atleta`, `campeonato`, `financeiro`).

Entrada opcional, mas recomendada:

2. O tipo de estrutura inicial dos casos de uso: `crud` (base padronizada de create/update/delete/find-by-id/find-page) ou `example` (um unico caso de uso de exemplo). Se essa informacao nao vier no pedido, a skill deve perguntar de forma objetiva antes de seguir.

Regras da implementacao:

1. A skill deve validar que o kernel compartilhado ja existe (`src/core/domain/entity.ts`, `src/core/domain/repositories/`, `src/core/use-cases/use-case.ts`) — senao, orientar a rodar `shared-kernel-scaffold` primeiro.
2. Criar `src/core/domain/<aggregate>/<aggregate>.entity.ts` (entidade base minima, herdando de `Entity` via import relativo `../entity`), `src/core/domain/<aggregate>/<aggregate>.repository.ts` (contrato minimo herdando `CrudRepository` via `../repositories`) e `src/core/domain/<aggregate>/index.ts`.
3. Criar `src/core/use-cases/<aggregate>/` com os casos de uso do modo escolhido (`crud` ou `example`), importando `UseCase` de `../../use-case` e entidade/repositorio de `../../domain/<aggregate>`, mais `src/core/use-cases/<aggregate>/index.ts`.
4. O conteudo gerado deve ser minimo, util e didatico, com placeholders simples, sem implementar logica real de negocio nem assumir atributos especificos.
5. A skill nao deve criar Route Handler, Server Action, schema Mongoose ou qualquer detalhe de infraestrutura — isso pertence a `nextjs-module-scaffold` e a implementacoes diretas em `src/infrastructure/database`.
6. A skill deve ser deterministica: os templates e arquivos-base necessarios devem ficar dentro da propria pasta da skill, em `assets/common/domain/`, `assets/common/use-cases/`, `assets/usecase/crud/` e `assets/usecase/example/`, materializados por um script `scripts/create-aggregate.js` com `--aggregate <nome> --mode <crud|example>`.
7. Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- A skill e sobre estrutura, nao sobre implementacao do dominio.
- A skill deve deixar o projeto pronto para o desenvolvedor continuar a implementacao manualmente ou com as demais skills `domain-*`.
- Tudo que a skill precisa para funcionar deve estar contido dentro de `skills-and-prompts/skills/domain-aggregate-scaffold/`.
