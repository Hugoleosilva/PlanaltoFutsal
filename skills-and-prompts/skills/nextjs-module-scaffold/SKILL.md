---
name: nextjs-module-scaffold
description: Cria de forma deterministica a superficie Next.js de um modulo de dominio do Planalto Futsal (Atleta, Campeonato, Financeiro, Galeria de Fotos, Carona, etc.) — um Route Handler em src/app/api/<modulo>, uma Server Action e uma pagina App Router em src/app/(public|private)/<modulo> — conectando-os aos casos de uso ja existentes em src/core/use-cases/<modulo>.
---

# Nextjs Module Scaffold

Usar o script `scripts/create-module.js` em vez de recriar a estrutura manualmente.

Este projeto e um **unico app Next.js** (App Router). Nao ha `apps/frontend`, `apps/backend`, NestJS, Turborepo ou workspaces npm. Nao ha "registro" de modulo em lugar nenhum: o App Router descobre rotas automaticamente pelo sistema de arquivos em `src/app/`.

## Pre-requisito

O dominio do modulo (entidade, contrato de repositorio, casos de uso) deve existir antes desta skill, criado por `domain-aggregate-scaffold`, `domain-entity-scaffold`, `domain-repository-scaffold` e `domain-use-case-scaffold` em `src/core/domain/<modulo>` e `src/core/use-cases/<modulo>`. Esta skill so cria a camada de apresentacao/HTTP que consome esses casos de uso.

## Fluxo

1. Confirmar que o pedido informa explicitamente o `nome do modulo`.
2. Confirmar se o modulo e publico (visivel para torcedor/visitante, role `USER`) ou privado (exige sessao, roles `ADMIN`/`ATLETA`). Se nao vier no pedido, perguntar objetivamente: `Este modulo deve ficar no grupo de rota "public" ou "private"?`
3. Executar a partir da raiz do projeto Next.js:

```bash
node .agents/skills/nextjs-module-scaffold/scripts/create-module.js --module atleta --access private
```

4. Verificar ao final:
   - `src/app/api/<modulo>/route.ts` criado.
   - `src/app/(<access>)/<modulo>/actions.ts` criado.
   - `src/app/(<access>)/<modulo>/page.tsx` criado (wrapper fino da rota).
   - `src/modules/<modulo>/pages/<modulo>.page.tsx` criado.
   - `src/modules/<modulo>/components/<modulo>.component.tsx` criado.

## Comportamento

- Recusar execucao quando `src/app` nao existir (o script espera um app Next.js ja inicializado).
- Recusar execucao quando qualquer arquivo de destino ja existir (nao sobrescrever silenciosamente).
- Copiar `assets/route-handler-template/route.ts` para `src/app/api/<modulo>/route.ts`, substituindo `__MODULE_NAME__` e `__MODULE_CLASS_NAME__`.
- Copiar `assets/server-action-template/actions.ts` para `src/app/(<access>)/<modulo>/actions.ts`.
- Copiar os arquivos de `assets/frontend-module-template/` para `src/`, substituindo `__MODULE_NAME__`, `__MODULE_CLASS_NAME__` (PascalCase) e `__MODULE_DISPLAY_NAME__` (Title Case).
- Nao alterar `package.json`, `tsconfig.json` nem rodar `npm install`/`npm run build` — nao ha dependencia nova nem workspace para atualizar.
- Preservar arquivos nao relacionados.

## Templates

O Route Handler base fica em `assets/route-handler-template/route.ts`:

- exemplo de `GET` paginado, chamando `Find<ModuleClassName>Page` do use-case criado por `domain-use-case-scaffold`, instanciando a implementacao Mongoose do repositorio (que precisa existir em `src/infrastructure/database/<modulo>/`).

A Server Action base fica em `assets/server-action-template/actions.ts`:

- arquivo com `"use server";` no topo, exemplo de `create<ModuleClassName>Action`, chamando `Create<ModuleClassName>` do use-case e revalidando o path com `revalidatePath`.

Os arquivos-base do frontend ficam em `assets/frontend-module-template/`:

- `route-page.tsx` → copiado como `app/(<access>)/<modulo>/page.tsx` (wrapper fino que so importa e renderiza a pagina real).
- `page.tsx` → copiado como `modules/<modulo>/pages/<modulo>.page.tsx` (composicao da tela).
- `component.tsx` → copiado como `modules/<modulo>/components/<modulo>.component.tsx` (UI de exemplo, a evoluir).

Placeholders substituidos: `__MODULE_NAME__` (kebab-case), `__MODULE_CLASS_NAME__` (PascalCase) e `__MODULE_DISPLAY_NAME__` (Title Case).

Editar esses arquivos antes do script somente quando o template padrao precisar mudar.

## Sobre RBAC e o grupo de rota

O parametro `--access` decide o *route group* do App Router (`(public)` ou `(private)`). Isso e apenas organizacional — a protecao real de acesso (checar a sessao do NextAuth.js e a role `ADMIN`/`ATLETA`/`USER`) precisa ser aplicada explicitamente:

- no Route Handler, checando a sessao no inicio da funcao (ou via middleware centralizado, se o projeto ja tiver um);
- na Server Action, checando a sessao antes de qualquer efeito colateral;
- na pagina, via um layout de grupo de rota que redireciona usuarios sem sessao/role adequada.

Essa integracao fina com o NextAuth.js e as roles fica a cargo da skill `nextjs-auth-rbac-spec` e da implementacao real do time; esta skill apenas deixa `TODO`s marcados nos templates para lembrar isso.

## Restricoes

- Nao inferir `--access` quando ele nao vier no pedido e houver ambiguidade real.
- Nao criar `src/core/domain/<modulo>` ou `src/core/use-cases/<modulo>` — isso e responsabilidade de `domain-aggregate-scaffold`.
- Nao criar a implementacao Mongoose do repositorio — isso fica em `src/infrastructure/database/<modulo>/`, fora do escopo desta skill.
- Nao criar documentacao extra fora dos recursos da propria skill.
- Nunca usar `any` nos templates.
