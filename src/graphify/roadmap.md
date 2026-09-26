# Roadmap — Planalto Futsal

## Status (2026-09-25/26)

As 3 telas principais (Diretoria → Atleta → Público Geral) têm um MVP funcional, com build de
produção, typecheck e suite de testes (52 testes) passando limpo.

### Diretoria (`/admin`) ✅
Visão Geral, Financeiro (CRUD movimentações), Elenco (CRUD atleta + criar acesso + promover
usuário existente para atleta), Campeonatos (CRUD + vínculo de atleta via accordion), Jogos
(agendar/cancelar), Moderação de Fotos (aprovar/rejeitar), Conteúdo do Site (mural, enquete,
patrocinador, produto).

### Atleta (`/atleta`) ✅
Perfil próprio (editar bio/posição/estilo/preferências), foto principal + galeria (máx. 4,
upload direto), campeonatos em disputa.

### Portal Público (`/`) ✅
Hero, história, elenco + campeonatos ativos, agenda de jogos, mural de avisos, galeria de fotos
aprovadas, envio de fotos pelo torcedor (máx. 5), carona solidária (listar + oferecer), enquete
(votar, com trava simples via localStorage) + espaço de rádio (placeholder), Pix (QR Code +
copia-e-cola gerados localmente, sem API externa), patrocinadores, loja virtual.

### Autenticação / RBAC ✅
- Cadastro público (`/cadastro`) → conta `USER` pendente de verificação por e-mail.
- Verificação de e-mail (`/api/auth/verificar?token=`) → ativa a conta e, se o e-mail/WhatsApp
  bater com um Atleta cadastrado pela diretoria sem login ainda, promove automaticamente para
  `ATLETA` (caso "Fulano").
- Diretoria pode promover um `USER` existente para `ATLETA` vinculando a um atleta sem acesso
  (caso "Cicrano") — efeito só aparece no próximo login (JWT), conforme esperado pelo usuário.
- Diretoria também pode emitir credenciais diretamente para um atleta (sem passar pelo
  cadastro/verificação), via "Criar acesso" no Elenco.
- E-mail transacional via Resend (`RESEND_API_KEY` configurada); cai para log no console se a
  chave não estiver definida.

## Pendências conhecidas (não bloqueiam o MVP, mas valem retomar)

- **LGPD**: `ConsentimentoLgpd` (entidade+schema) existe mas **não está plugado** no formulário de
  `/cadastro` — falta o checkbox de termos de uso e consentimento de imagem, e o fluxo de
  responsável para menores de idade. Como o app coleta documento/foto de atleta, isso é o item
  de compliance mais importante em aberto.
- **Súmula digital** (gols/assistências/cartões via `EventoJogo`), **confirmação de presença**
  (`ConfirmacaoPresenca`) e **votação de craque do jogo** (`VotoCraque`): entidades e schemas
  prontos, mas sem repositório Mongo nem use-cases/UI ainda.
- **Mensalidades** (`Mensalidade`): mesma situação — schema pronto, sem fluxo de cobrança/UI.
- **Install prompt customizado do PWA** ("Baixar o App"): não implementado; o service worker do
  `next-pwa` já funciona, falta o banner de convite.
- **Ícones do manifest**: ainda usam a arte enviada em tamanho único (ver nota em
  `architecture.md`); faltam PNGs 192/512/maskable de verdade.
- **Rate limiting**: `/api/arquivos` (upload) e o cadastro (`/cadastro`) não têm nenhuma
  limitação de taxa — para um site pequeno de comunidade o risco é baixo, mas vale lembrar antes
  de divulgar o link amplamente.
- **Enquete**: sem trava real de "1 voto por pessoa" no backend (só um lembrete via
  `localStorage` no navegador, fácil de contornar). Aceitável para o caráter informal da
  enquete; `VotoCraque` (não implementado ainda) já nasceu com `identificadorVotante` único caso
  seja necessário mais rigor lá.

## Deploy (planejado)

- Domínio já registrado: **planaltofutsal.com.br**.
- Deploy será na **Vercel**. Quando chegar essa fase: `AUTH_URL`/`NEXTAUTH_URL` de produção =
  `https://planaltofutsal.com.br`, variáveis de ambiente (Mongo URI, AUTH_SECRET,
  RESEND_API_KEY) configuradas nas env vars do projeto na Vercel (nunca commitadas), verificar o
  domínio no Resend para o `RESEND_FROM_EMAIL` funcionar para qualquer destinatário (hoje usa
  `onboarding@resend.dev`, que só entrega pro próprio dono da conta Resend), e validar que o
  service worker do `@ducanh2912/next-pwa` funciona no ambiente serverless da Vercel.

## Decisões tomadas sem confirmação explícita (revisar se necessário)

- PWA: `@ducanh2912/next-pwa` (o nome citado no brief, `@ducanh273/next-pwa`, não existe —
  assumido erro de digitação).
- Auth: Auth.js v5 (next-auth@5 beta). Config dividida em `auth.config.ts` (edge-safe, sem
  providers) + `auth.ts` (Node, com o Credentials provider) + `auth.edge.ts` (usado só pelo
  middleware) — necessário porque middleware roda em Edge Runtime e não pode carregar Mongoose.
- Hash de senha: bcryptjs (puro JS) em vez de bcrypt nativo.
- Upload de imagens: guardado como binário direto no MongoDB (sem GridFS, dado o volume
  pequeno — elenco de até ~30 atletas), com compressão no navegador antes do envio
  (`src/shared/utils/compress-image.ts`) e limite de 2MB por arquivo já comprimido.
- Porta de dev: 3001 (3000 já ocupada por outro projeto local do usuário).
