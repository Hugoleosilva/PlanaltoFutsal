# Roadmap — Planalto Futsal

Ordem definida pelo usuário:

1. **Kickoff** ✅ — stack definida, prompt mestre recebido.
2. **Modelos de Dados (Schemas) + Estrutura de Pastas** ✅ — feito nesta sessão (2026-09-25):
   - Clean Architecture completa (`core/domain`, `core/use-cases`, `infrastructure/*`, `shared/*`).
   - Todos os agregados do domínio modelados como Entities + schemas Mongoose (ver `entities.json`).
   - `skills-and-prompts/` reorganizado a partir de `planalto_skills/` + `planalto_prompts/` (auditoria feita por subagent em paralelo — conferir resumo dele).
3. **Módulos tela por tela** — Autenticação/RBAC ✅ (parcial) → Diretoria → Atletas → Portal Público:
   - Autenticação: Auth.js v5 + Credentials provider + middleware RBAC ✅. Falta: tela de cadastro de ADMIN inicial (seed), recuperação de senha.
   - Diretoria (`/admin`): layout protegido criado, dashboard é placeholder. Falta: UI de financeiro, CRUD de atletas, gestão de campeonatos (accordion), fila de moderação de fotos.
   - Atletas (`/atleta`): layout protegido criado, dashboard é placeholder. Falta: UI de perfil, galeria, campeonatos em disputa, confirmação de presença.
   - Portal Público (`/`): landing estática com escudo/capa. Falta: elenco, agenda, galeria aprovada, formulário de envio de fotos, Pix, carona solidária, rádio/enquetes, loja, patrocinadores, mural.

## Decisões tomadas sem confirmação explícita (revisar se necessário)

- PWA: `@ducanh2912/next-pwa` (o nome citado no brief, `@ducanh273/next-pwa`, não existe — assumido erro de digitação).
- Auth: Auth.js v5 (next-auth@5 beta) em vez de v4, por ser a versão recomendada para App Router com RBAC via middleware.
- Hash de senha: bcryptjs (puro JS) em vez de bcrypt nativo, para evitar build nativo no Windows.
- Upload de imagens: `next.config.mjs` já libera `res.cloudinary.com` como `remotePattern`, mas nenhum provider de upload foi implementado ainda — decisão pendente de confirmação com o usuário.
- Porta de dev: 3001 (3000 já ocupada por outro projeto local do usuário).
- MongoDB Atlas: string de conexão fornecida pelo usuário está em `.env.local` (gitignored). `.env.example` tem placeholder.
- Campos de referência (`*Id`) nos schemas Mongoose são tipados como `mongoose.Types.ObjectId` (não `string`) nas interfaces `*Document`; os repositórios convertem para `string` via `.toString()` ao mapear para a Entidade de domínio (que usa `string` para ids, ver `entity.ts`).

## Deploy (planejado)

- Domínio já registrado: **planaltofutsal.com.br**.
- Deploy será na **Vercel**. Quando chegar essa fase: `AUTH_URL`/`NEXTAUTH_URL` de produção = `https://planaltofutsal.com.br`, variáveis de ambiente (Mongo URI, AUTH_SECRET) configuradas nas env vars do projeto na Vercel (nunca commitadas), e validar que o service worker do `@ducanh2912/next-pwa` funciona no ambiente serverless da Vercel.

## Verificação feita nesta sessão

`npm install`, `npx tsc --noEmit`, `npx vitest run` (17/17 testes) e `npm run build` (build de produção completo, incluindo o service worker do PWA) rodaram sem erro em 2026-09-25. Qualquer sessão futura pode confiar que o estado commitado (quando commitado) compila.
