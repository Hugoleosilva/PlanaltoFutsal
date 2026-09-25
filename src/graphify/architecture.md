# Arquitetura — Planalto Futsal

Next.js 15 (App Router) + MongoDB (Mongoose) + Clean Architecture/DDD. App único (sem monorepo, sem NestJS).

## Camadas

- `src/core/domain` — Entidades (imutáveis, `Entity<TState>` base em `entity.ts`), value objects, contratos de repositório (`*.repository.ts`, interfaces apenas).
- `src/core/use-cases` — Casos de uso (`UseCase<IN, OUT>`), um arquivo por ação de negócio. Autorização via `_shared/authorize.ts` (`assertRole`).
- `src/infrastructure/database` — Conexão Mongoose (`mongoose.ts`), schemas (`schemas/*.schema.ts`), implementações de repositório (`repositories/*.repository.mongo.ts`) que convertem `Document` ↔ Entidade.
- `src/infrastructure/security` — Auth.js v5, dividido em 3 arquivos por causa do Edge Runtime do middleware:
  - `auth.config.ts` — config base (session strategy, pages, callbacks jwt/session), **sem providers**. Edge-safe.
  - `auth.ts` — config completa (Node.js apenas): `authConfig` + Credentials provider com `MongoUserRepository`/Mongoose. Usado por `app/api/auth/[...nextauth]/route.ts` e por Server Components/Actions/Route Handlers.
  - `auth.edge.ts` — `NextAuth(authConfig)` sem providers, usado **apenas** por `src/middleware.ts`. Nunca importar `auth.ts` (nem nada que puxe Mongoose) a partir do middleware — webpack falha o build (`node:crypto`/`Dynamic Code Evaluation` no Edge Runtime) porque o middleware roda em Edge, não em Node.
  - hashing de senha: `password-hasher.ts`, bcryptjs.
- `src/infrastructure/audit` — `audit-logger.ts`, ponto único para logar ações críticas quando o use-case não injeta `AuditLogRepository` diretamente.
- `src/infrastructure/errors` — `AppError` e subclasses (`NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ValidationException`), `handleRouteError`/`toActionError` para Route Handlers e Server Actions.
- `src/shared/validation` — `Validator` + `ValidationRule` + regras reutilizáveis (`rules/*.rule.ts`). Usado pelas entidades para validar invariantes no construtor.
- `src/shared/types/role.ts` — `Role = "ADMIN" | "ATLETA" | "USER"`.
- `src/middleware.ts` — RBAC por prefixo de rota (`/admin/*` → ADMIN, `/atleta/*` → ADMIN|ATLETA).

## Padrão de um caso de uso

```
Route Handler / Server Action
  → auth() para obter actor (id, role)
  → instancia UseCase com repositórios Mongo
  → useCase.execute({ actor, ...input })
  → handleRouteError(error) em caso de exceção
```

Exemplo completo: `src/app/api/fotos/[id]/aprovar/route.ts` (protegido, ADMIN) e
`src/app/api/fotos/enviar/route.ts` (público, torcedor).

## Ações auditadas (grava em `AuditLog`)

Aprovação/rejeição de foto, criação/desativação de atleta, criação/exclusão de movimentação financeira.
Ver `src/core/domain/audit/audit-log.entity.ts` (`AUDIT_ACTIONS`).

## Pendências conhecidas

- Ícones do manifest.json usam a arte enviada em tamanho único; faltam PNGs 192/512/maskable gerados.
- Repositórios Mongo implementados apenas para User, Atleta, Foto, MovimentacaoFinanceira, AuditLog — os demais agregados (Campeonato, Jogo, Carona, Enquete, Comunicado, Patrocinador, Produto, Mensalidade, ConsentimentoLgpd) têm schema + entidade + contrato de repositório, mas ainda não têm implementação Mongo nem use-cases.
- Telas (Diretoria, Atleta, Portal Público) ainda são placeholders — Passo 3 do roadmap do usuário.
- `@ducanh2912/next-pwa` usado no lugar do nome `@ducanh273/next-pwa` citado no brief original (typo — o pacote real é `@ducanh2912/next-pwa`).
