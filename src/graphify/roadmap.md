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

### Portal Público ✅
Inspirado na estrutura do site do Palmeiras: uma página-porta simples antes do conteúdo, e **cada
seção do portal é sua própria página** (não uma âncora numa página gigante — decisão explícita do
usuário em 2026-09-26 pra evitar uma "página-tudo" difícil de manter). `PublicNav` (menu +
Entrar/Criar conta, ou painel + Sair quando logado — nunca trava acesso por falta de cadastro) e
`PublicFooter` são compartilhados por todas as páginas do portal.

| Rota | Conteúdo |
| --- | --- |
| `/` | Página-porta: fundo, patrocinadores, botão "Entrar no Site" → `/inicio`. Sem menu, sem login. |
| `/inicio` | Visão geral: ticker do próximo jogo, mural de avisos, enquete + espaço de rádio (placeholder), patrocinadores. |
| `/historia` | História do clube. |
| `/elenco` | Elenco ativo + campeonatos em andamento/inscritos. |
| `/agenda` | Próximos jogos (`AGENDADO`). |
| `/jogos` | Resultados (`REALIZADO`) com filtro por mês/ano, fotos e apoiadores. |
| `/galeria` | Galeria de fotos aprovadas + formulário de envio pelo torcedor (máx. 5). |
| `/carona` | Caronas solidárias (listar + oferecer). |
| `/servicos` | Classificados da comunidade: quem tem conta divulga um trabalho/serviço (foto/arte, descrição, valores, formas de pagamento, contato) — nasce PENDENTE_APROVACAO, só aparece depois que a diretoria aprova em `/admin/servicos`. Sem login, mostra convite pra criar conta em vez do formulário. |
| `/apoie` | Pix (QR Code + copia-e-cola gerados localmente, sem API externa). |
| `/loja` | Loja virtual em carrossel, link direto pro WhatsApp. |

O menu do admin (`AdminSidebar`) tem uma seção "Ir Para" (2026-09-26, antes "Ver no site" e
separada por uma borda no rodapé — juntada ao menu principal, logo após "Conteúdo do Site", a
pedido do usuário) com links diretos pra `/elenco` e `/inicio` (abrem em nova aba, pra não perder
o contexto do painel).

### Sócio / apoiador — "Planalto Meu Amor!" (2026-09-26)
`User` ganhou `socio`, `socioDesde`, `socioTipoPlano` (`MENSAL`|`UNICO`), `socioValorPlano`,
`socioDiaVencimento`. Fluxo completo em `/apoie` (`SocioCta`): qualquer usuário logado (inclusive
diretores — a diretoria combinou que todo diretor também é sócio contribuinte mensal) escolhe
plano mensal (R$5/10/15/outro valor + dia de vencimento) ou aporte único, com "Saiba mais"
mostrando as vantagens (ilustrativas por enquanto: acesso a jogos, descontos, sorteios —
implementação real das vantagens fica pra depois). Ao confirmar, `TornarSocioUseCase` já gera a
primeira `ContribuicaoSocio` (PENDENTE) e mostra o Pix com o valor certo na hora
(`PixValorFixo`, reaproveita `gerarPixCopiaCola` com `valor` fixo).

**Sem gateway de pagamento** (Pix aqui é só chave/QR estático) → nenhuma cobrança é automática.
`/admin/socios` lista todo sócio com o plano e a contribuição do período atual; pra sócios
mensais, a página materializa sob demanda a parcela do mês corrente caso ainda não exista
(sem cron, só na carga da página). Diretor confere se o Pix caiu e clica "Marcar como recebido"
(`MarcarContribuicaoRecebidaUseCase`) — isso já lança a receita no Financeiro automaticamente
(origem: Apoiadores), fechando o ciclo com os gráficos.

A Visão Geral do admin (`/admin`) mostra "Cadastros no site" e "Apoiadores (sócios)"
(`UserRepository.countAll()`/`countSocios()`/`findSocios()`).

### Financeiro: gráficos (2026-09-26)
`FinanceiroAnalytics` (usa `recharts`, instalado nesta sessão) tem 3 quadros colapsáveis, todos
com filtro de período no topo (Este Mês → granularidade diária, Este Ano → mensal):
1. Receita (bar verde) + despesa (bar vermelho, valores negativos) + saldo acumulado (linha azul)
   — tudo no MESMO eixo Y (R$), não é dual-axis de verdade porque as três séries são a mesma
   unidade monetária.
2. Donut de origem da receita: Colaboração Interna / Apoiadores / Patrocinadores (campo novo
   `origemReceita` em `MovimentacaoFinanceira`, só usado quando `tipo === "RECEITA"`) — mostra
   valor e percentual.
3. Barra horizontal de despesas por `categoria` (texto livre existente), maior pro menor, com
   valor e percentual.
Cores seguem a paleta validada do skill `dataviz` (`references/palette.md`), variante dark (site
não tem modo claro). O form "Nova movimentação" e o quadro de gráficos agora também têm
mostrar/ocultar, igual o quadro de movimentações recentes. O seletor de período não fica preso
só no mês atual — a partir dos meses que já têm movimentação, um grupo "Meses anteriores" aparece
no `<select>` (ex: quando outubro chegar, "Setembro/2026" passa a ser selecionável).

### Presença e chat entre diretores (2026-09-26)
`AdminPresenceChat` (widget flutuante em todas as páginas de `/admin`) — sem WebSocket/serviço
externo, é 100% polling em cima do MongoDB (pragmático pro tamanho do projeto e hospedagem
serverless na Vercel):
- Heartbeat a cada 20s (`PresencaAdminModel`, upsert por `userId` + `lastSeenAt`) — "online" =
  visto nos últimos 40s.
- Chat é uma sala única entre todos os ADMIN logados (não é 1:1) — `MensagemChat`
  (entidade+repo+`EnviarMensagemChatUseCase`), lida via polling a cada 5s. Cada mensagem mostra um
  avatar com iniciais (colorido por hash do id) + nome + hora.
- Sem consumo de nenhuma lib nova; se o número de diretores crescer muito ou precisar de latência
  menor, dá pra trocar o polling por algo como Pusher/Ably sem mexer no domínio (só a camada de
  infra/actions muda).

Cada Server Action que muda dado público (`revalidatePath`) já foi ajustada pra invalidar a
página específica onde aquele dado aparece (ex: aprovar foto invalida `/galeria`, não mais
`/inicio`) — ao criar uma nova seção/ação, lembrar de revalidar a página certa.

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

- **Área de "resenha" entre torcida e atletas**: pedida pelo usuário (2026-09-26) como área de
  interação/comentários entre torcedores e atletas, tipo um mural social. Explicitamente descrita
  como algo a planejar depois ("vamos colocar"), não construir agora — nenhuma entidade/schema
  criado ainda.
- **Vantagens para quem se cadastra**: o usuário mencionou que o cadastro vai desbloquear
  vantagens no futuro, mas ainda não definiu quais ("pensaremos futuramente"). Não implementar
  nada até isso ser definido.
- **Parceria de rádio online**: ainda sendo fechada; o placeholder "Em breve" no espaço de
  Engajamento já está pronto para receber o embed/player assim que a parceria for confirmada.
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
