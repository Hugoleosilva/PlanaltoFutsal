Crie uma skill chamada `nextjs-module-scaffold` dentro de `skills-and-prompts/skills/nextjs-module-scaffold` para criar de forma deterministica a superficie Next.js de um modulo de dominio do Planalto Futsal: um Route Handler, uma Server Action e uma pagina App Router, conectados aos casos de uso ja existentes em `src/core/use-cases/<modulo>`.

No `SKILL.md`, defina:

- `name`: `nextjs-module-scaffold`
- `description`: `Cria de forma deterministica a superficie Next.js de um modulo de dominio do Planalto Futsal — um Route Handler em src/app/api/<modulo>, uma Server Action e uma pagina App Router em src/app/(public|private)/<modulo> — conectando-os aos casos de uso ja existentes em src/core/use-cases/<modulo>.`

Contexto importante: este projeto e um unico app Next.js (App Router). Nao ha `apps/frontend`, `apps/backend`, NestJS, Turborepo ou workspaces npm. Nao existe "registro" de modulo em lugar nenhum — o App Router descobre rotas automaticamente pelo sistema de arquivos em `src/app/`. Portanto a skill NAO deve tentar editar um `app.module.ts`, criar `package.json` de workspace, nem rodar `npm install --workspace`.

Pre-requisito: o dominio do modulo (entidade, contrato de repositorio, casos de uso) deve existir antes desta skill, criado por `domain-aggregate-scaffold`/`domain-entity-scaffold`/`domain-repository-scaffold`/`domain-use-case-scaffold`. Esta skill so cria a camada de apresentacao/HTTP.

Use o script `scripts/create-module.js` em vez de recriar a estrutura manualmente.

Fluxo do script:

1. Receber `--module <nome>` (obrigatorio) e `--access public|private` (default `private`, decide o route group do App Router).
2. Criar `src/app/api/<modulo>/route.ts` a partir de `assets/route-handler-template/route.ts` — um `GET` de exemplo, paginado, chamando `Find<ModuloClassName>Page` do caso de uso e instanciando a implementacao Mongoose do repositorio (que precisa existir em `src/infrastructure/database/<modulo>/`).
3. Criar `src/app/(<access>)/<modulo>/actions.ts` a partir de `assets/server-action-template/actions.ts` — arquivo com `"use server";` no topo, exemplo de `create<ModuloClassName>Action` chamando `Create<ModuloClassName>` e revalidando o path com `revalidatePath`.
4. Criar a estrutura de pagina a partir de `assets/frontend-module-template/`:
   - `route-page.tsx` → `src/app/(<access>)/<modulo>/page.tsx` (wrapper fino).
   - `page.tsx` → `src/modules/<modulo>/pages/<modulo>.page.tsx`.
   - `component.tsx` → `src/modules/<modulo>/components/<modulo>.component.tsx`.
5. Recusar execucao quando `src/app` nao existir, ou quando qualquer arquivo de destino ja existir (nao sobrescrever silenciosamente).
6. Nao alterar `package.json`/`tsconfig.json`, nao rodar `npm install`/`npm run build` — nao ha dependencia nova nem workspace para atualizar.

Sobre RBAC: o parametro `--access` e apenas organizacional (route group). A protecao real (checar sessao do NextAuth.js e role `ADMIN`/`ATLETA`/`USER`) precisa ser aplicada explicitamente no Route Handler, na Server Action e/ou via layout do grupo de rota — deixar `TODO`s claros nos templates lembrando disso, e apontar que a integracao fina fica a cargo da skill `nextjs-auth-rbac-spec`.

Placeholders substituidos nos templates: `__MODULE_NAME__` (kebab-case), `__MODULE_CLASS_NAME__` (PascalCase) e `__MODULE_DISPLAY_NAME__` (Title Case).

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- Nao inferir `--access` quando ele nao vier no pedido e houver ambiguidade real.
- Nao criar `src/core/domain/<modulo>` ou `src/core/use-cases/<modulo>` — isso e responsabilidade de `domain-aggregate-scaffold`.
- Nao criar a implementacao Mongoose do repositorio — isso fica em `src/infrastructure/database/<modulo>/`, fora do escopo desta skill.
- Nunca usar `any` nos templates.
