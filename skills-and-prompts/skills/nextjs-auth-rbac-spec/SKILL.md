---
name: nextjs-auth-rbac-spec
description: Orquestra a criação da base de autenticação e RBAC do Planalto Futsal com NextAuth.js/Auth.js e as roles ADMIN, ATLETA e USER, incluindo agregado e entidade de Usuario, repositório, casos de uso, provider de criptografia, configuração do NextAuth, middleware de proteção de rotas e integração com Route Handlers/Server Actions, reaproveitando as skills especializadas do projeto.
---

# Nextjs Auth Rbac Spec

Esta skill e uma orquestradora. Ela existe para conduzir, de forma deterministica, a criacao ou evolucao da base de autenticacao e autorizacao (RBAC) do app Next.js unico do Planalto Futsal, sem reimplementar o trabalho detalhado das skills especializadas do catalogo.

O foco desta primeira versao e somente:

- dominio de `Usuario` (entidade, repositorio, casos de uso)
- persistencia com Mongoose
- autenticacao via NextAuth.js/Auth.js (Credentials Provider com e-mail/senha, no minimo)
- RBAC com as roles `ADMIN`, `ATLETA` e `USER` (torcedor/visitante)
- protecao de rotas (Route Handlers, Server Actions e paginas) por role

Nao incluir nesta primeira versao: recuperacao de senha, confirmacao por e-mail, providers OAuth externos (Google, etc.), a menos que o usuario peca explicitamente.

## Objetivo

Construir a base de autenticacao e autorizacao do Planalto Futsal de forma orientada por especificacao, coordenando uma sequencia previsivel de skills menores para entregar:

- agregado e entidade `Usuario` (com `role: "ADMIN" | "ATLETA" | "USER"`)
- contrato de repositorio de `Usuario` (com busca por e-mail para login)
- caso de uso de registro (`RegistrarUsuario`) e integracao de login via NextAuth.js
- persistencia Mongoose do repositorio de `Usuario`
- provider de criptografia de senha (`CryptoProvider` + implementacao concreta, ex.: bcrypt)
- configuracao do NextAuth.js (`src/infrastructure/security/auth.ts` ou `auth.config.ts`, conforme a versao do Auth.js usada) com Credentials Provider, callbacks de `jwt`/`session` carregando a `role`, e `middleware.ts` protegendo rotas privadas por role
- Route Handler e/ou Server Action de registro de usuario

## Natureza da skill

- Esta skill delega para skills especializadas.
- Esta skill nao deve duplicar os workflows detalhados das skills filhas.
- Esta skill deve verificar o resultado de cada etapa antes de avancar.
- Esta skill deve parar de forma explicita quando faltar uma skill critica do catalogo local.
- Esta skill deve respeitar a estrutura real do repositorio e evoluir implementacoes existentes antes de recriar do zero.

## Entradas obrigatorias

Antes de executar a orquestracao, confirme que estas entradas estao claras:

1. nome do agregado de usuario, quando nao for simplesmente `usuario`
2. especificacao minima dos atributos do `Usuario` (nome, email, senha, role — outros campos conforme o pedido)
3. confirmacao de que o fluxo inclui, no minimo:
   - cadastro (registro) de usuario
   - login via credenciais (e-mail/senha)
4. confirmacao das tres roles do projeto: `ADMIN`, `ATLETA`, `USER` (torcedor/visitante) — ver CLAUDE.md do projeto para a definicao de cada role

## Entradas opcionais

Se o usuario informar, incorporar tambem:

- nome dos casos de uso
- nome das rotas/Server Actions
- claims adicionais desejadas na sessao (alem de `id`, `email`, `role`)
- regras adicionais de autenticacao (ex.: bloquear login apos N tentativas)
- se deve haver providers OAuth (Google, etc.) alem de Credentials
- tempo de expiracao da sessao
- se cada role tem paginas/rotas especificas a proteger desde ja (ex.: `/admin`, `/atleta`, `/`)

## Escopo minimo obrigatorio

Esta skill so esta completa quando a cadeia final contem, no minimo:

1. Server Action ou Route Handler de registro de usuario
2. configuracao do NextAuth.js com Credentials Provider funcional (login)
3. persistencia do usuario via Mongoose
4. senha protegida por provider de criptografia (nunca armazenada em texto puro)
5. sessao contendo `role` do usuario (via callback `jwt`/`session` do NextAuth.js)
6. `middleware.ts` (ou protecao equivalente por layout de route group) bloqueando rotas privadas por role
7. acesso a sessao/usuario autenticado dentro de Route Handlers e Server Actions via `auth()`/`getServerSession()` (conforme a versao do NextAuth.js usada)
8. tratamento de erro respeitando a hierarquia `DomainError`/`ValidationException` de `src/infrastructure/errors`

## Limites

- Nao tentar resolver recuperacao de senha, confirmacao por e-mail ou providers OAuth externos, salvo pedido explicito.
- O objetivo padrao e autenticacao e RBAC basicos, solidos e extensiveis.
- Se o usuario pedir extensoes, mante-las incrementais e simples.

## Validacao obrigatoria do catalogo

Antes de qualquer implementacao, verifique a existencia das skills necessarias dentro de `skills-and-prompts/skills` (ou `.agents/skills`, conforme onde o catalogo estiver instalado no projeto real).

Procure pelos arquivos:

- `shared-kernel-scaffold/SKILL.md`
- `domain-aggregate-scaffold/SKILL.md`
- `domain-entity-scaffold/SKILL.md`
- `domain-repository-scaffold/SKILL.md`
- `domain-use-case-scaffold/SKILL.md`
- `shared-validation-rule/SKILL.md`
- `infrastructure-provider-scaffold/SKILL.md`
- `nextjs-module-scaffold/SKILL.md`

### Regra de resolucao de dependencia por papel

Resolva as skills por papel, nesta ordem:

1. kernel compartilhado:
   - `shared-kernel-scaffold`
2. scaffold do agregado `usuario`:
   - `domain-aggregate-scaffold`
3. entidade `Usuario`:
   - `domain-entity-scaffold`
4. repositorio de dominio (`UsuarioRepository` + fake):
   - `domain-repository-scaffold`
5. casos de uso (`RegistrarUsuario`, etc.):
   - `domain-use-case-scaffold`
6. regras compartilhadas de validacao, quando necessario:
   - `shared-validation-rule`
7. provider de criptografia de senha:
   - `infrastructure-provider-scaffold`
8. Route Handler / Server Action de registro:
   - `nextjs-module-scaffold`

A implementacao Mongoose do repositorio (`UsuarioRepositoryMongoose`) e a configuracao do proprio NextAuth.js (`auth.ts`, `middleware.ts`) **nao tem skill dedicada no catalogo atual** — esta skill orquestradora as descreve diretamente nas etapas 8 e 11 abaixo, porque sao especificas demais do NextAuth.js para justificar uma skill separada.

### Comportamento em caso de ausencia

- Se faltar uma skill obrigatoria, parar imediatamente.
- Informar exatamente qual skill faltou e para qual papel ela era necessaria.
- Nao improvisar a implementacao detalhada de uma skill critica ausente.

## Leituras minimas de contexto antes da orquestracao

Antes de chamar as skills filhas, ler o contexto real do repositorio:

- `src/core/domain/usuario/` (se ja existir)
- `src/core/use-cases/usuario/` (se ja existir)
- `src/infrastructure/security/` (se ja existir)
- `src/infrastructure/errors/index.ts`
- `src/shared/validation/index.ts`
- `middleware.ts` na raiz do projeto, se existir
- arquivo de configuracao do NextAuth.js, se ja existir (`auth.ts`, `auth.config.ts` ou `src/app/api/auth/[...nextauth]/route.ts`, dependendo da versao)

Tambem procure no projeto por:

- `next-auth`
- `NextAuth`
- `getServerSession`
- `auth()`
- `role`
- `middleware`

O objetivo desta leitura e descobrir se a autenticacao ja existe parcialmente, para evoluir a estrutura encontrada em vez de recriar tudo.

## Regras de coerencia de nomes

Durante todo o fluxo:

- manter consistencia entre agregado `usuario`, entidade `Usuario`, repositorio `UsuarioRepository`, casos de uso, provider de criptografia e a configuracao do NextAuth.js
- preferir nomes simples e previsiveis
- reaproveitar o naming ja existente no repositorio quando houver implementacao parcial
- evitar criar uma arquitetura paralela ao padrao atual do projeto
- usar exatamente as tres roles do projeto: `ADMIN`, `ATLETA`, `USER` (nao inventar uma quarta role sem pedido explicito)

## Sequencia deterministica de orquestracao

Execute as etapas abaixo em ordem. Nao pule validacoes intermediarias.

### 1. Garantir o kernel compartilhado

- verificar se `src/core/domain/entity.ts`, `src/core/domain/repositories/`, `src/core/use-cases/use-case.ts`, `src/infrastructure/errors/` e `src/shared/validation/` ja existem
- se nao existirem, acionar `shared-kernel-scaffold`
- ao fim, validar a existencia desses arquivos

### 2. Criar ou preparar o agregado `usuario`

- acionar `domain-aggregate-scaffold` com `--aggregate usuario --mode crud`
- ao fim, validar estrutura minima:
  - `src/core/domain/usuario/`
  - `src/core/use-cases/usuario/`

### 3. Criar a entidade `Usuario`

- acionar `domain-entity-scaffold` para a entidade `Usuario` dentro do agregado `usuario`
- atributos minimos: `nome`, `email`, `senhaHash`, `role: "ADMIN" | "ATLETA" | "USER"`
- incluir validacoes coerentes com:
  - `RequiredRule` + `PersonNameRule` para `nome`
  - `RequiredRule` + `EmailRule` para `email`
  - `BcryptHashRule` para `senhaHash` (a entidade armazena apenas o hash, nunca a senha em texto puro)
- ao fim, validar:
  - arquivo da entidade criado ou atualizado
  - teste da entidade criado ou atualizado com cobertura de 100%

### 4. Criar o contrato de repositorio de `Usuario`

- acionar `domain-repository-scaffold`
- garantir operacoes minimas para o fluxo:
  - criar usuario
  - buscar por e-mail (usado pelo Credentials Provider do NextAuth.js no login)
  - buscar por id (usado para popular a sessao)
- ao fim, validar:
  - contrato exportado em `src/core/domain/usuario/index.ts`
  - fake repository disponivel para testes dos casos de uso

### 5. Criar o caso de uso de registro

- acionar `domain-use-case-scaffold` para o caso de uso `RegistrarUsuario` (tipo `custom`)
- garantir orquestracao de validacao do usuario, protecao de senha (via `CryptoProvider`) e persistencia
- ao fim, validar:
  - contrato `In` coerente (`nome`, `email`, `senha`, `role`)
  - teste do caso de uso presente, cobrindo caminho feliz e falha de validacao
  - coverage de 100% exigida pela skill filha atendida

### 6. Criar ou reutilizar regras compartilhadas necessarias

- so acionar `shared-validation-rule` quando faltar uma regra realmente generica e reutilizavel
- preferir regras ja existentes em `src/shared/validation/rules`
- exemplos possiveis: regra de senha forte, regra de hash bcrypt
- ao fim, validar: nova regra exportada corretamente, testes da regra criados

### 7. Criar a implementacao concreta do provider de criptografia

- acionar `infrastructure-provider-scaffold` para o `CryptoProvider` (ex.: `BcryptCryptoProvider` em `src/infrastructure/security/`)
- ao fim, validar:
  - implementacao concreta criada em `src/infrastructure/security/`
  - dependencia externa (`bcrypt` ou equivalente) instalada somente se necessaria

### 8. Criar a implementacao Mongoose do repositorio de `Usuario`

Esta etapa nao tem skill dedicada; siga este roteiro diretamente:

- criar o schema Mongoose em `src/infrastructure/database/usuario/usuario.schema.ts`, com indice unico em `email`
- criar a classe concreta `UsuarioRepositoryMongoose` em `src/infrastructure/database/usuario/usuario.repository.mongoose.ts`, implementando `UsuarioRepository`
- mapear entre o documento Mongoose e a entidade `Usuario` (metodos privados de mapeamento no proprio arquivo, nunca expondo o documento Mongoose fora da camada de infraestrutura)
- garantir uma unica conexao Mongoose reaproveitada entre requests (padrao de "cached connection" recomendado para Next.js serverless), tipicamente em `src/infrastructure/database/connection.ts`
- ao fim, validar: schema criado, classe concreta implementando o contrato de dominio sem vazar tipos do Mongoose para `src/core`

### 9. Configurar o NextAuth.js/Auth.js

- criar ou evoluir a configuracao do NextAuth.js (local exato depende da versao instalada: `auth.ts` + `src/app/api/auth/[...nextauth]/route.ts` no App Router, ou `auth.config.ts` separado para o Edge Runtime do `middleware.ts`)
- configurar o `CredentialsProvider`, chamando o caso de uso ou o repositorio de `Usuario` para validar e-mail/senha via `CryptoProvider.compare(...)`
- configurar `session: { strategy: "jwt" }` (recomendado para Credentials Provider)
- configurar o callback `jwt` para incluir `role` (e `id`) no token
- configurar o callback `session` para expor `role` (e `id`) em `session.user`
- se o projeto usar TypeScript estrito (obrigatorio aqui), estender os tipos do NextAuth (`next-auth.d.ts`) para tipar `session.user.role` sem `any`
- ao fim, validar: login funcional via Credentials Provider, sessao contendo `role`

### 10. Criar o middleware de protecao de rotas por role

- criar ou evoluir `middleware.ts` na raiz do projeto
- proteger o grupo de rotas privadas (`src/app/(private)/...`) exigindo sessao valida
- quando a rota exigir uma role especifica (ex.: paineis administrativos exigindo `ADMIN`), checar `session.user.role` e redirecionar/retornar 403 quando a role nao bater
- documentar no proprio middleware quais paths exigem quais roles, para servir de referencia as proximas skills `nextjs-module-scaffold` que criarem paginas privadas
- ao fim, validar: rota privada sem sessao redireciona para login; rota restrita por role bloqueia roles incompativeis

### 11. Criar a superficie de registro (Route Handler/Server Action)

- acionar `nextjs-module-scaffold` para o modulo `usuario` (ou nome equivalente escolhido), com `--access public` para o registro (o cadastro em si e publico; o login e feito pelo NextAuth.js)
- adaptar a Server Action/Route Handler gerada para chamar `RegistrarUsuario`
- ao fim, validar: endpoint/Server Action de registro criado e integrado ao caso de uso real

### 12. Validar a integracao final

- confirmar que o app esta pronto para proteger paginas, Route Handlers e Server Actions com usuario autenticado e role
- confirmar que ha um caminho claro para obter o usuario autenticado (`auth()`/`getServerSession()`) dentro de Route Handlers e Server Actions
- validar que o login retorna sessao com `role` correta
- validar que o registro persiste o usuario corretamente, com senha protegida

## Regras de orquestracao

- delegar para a skill especializada em vez de repetir suas instrucoes detalhadas
- sempre passar para a skill filha o resultado concreto da etapa anterior
- verificar arquivos e testes gerados em cada etapa antes de seguir
- preferir estruturas simples e faceis de manter
- manter o fluxo incremental e reversivel
- respeitar o padrao atual do projeto e o contexto real do repositorio

## Regras especificas para autenticacao e RBAC

Na ausencia de instrucao mais forte do usuario, adote defaults simples:

- login por e-mail
- senha armazenada apenas em formato protegido por `CryptoProvider` (bcrypt ou equivalente)
- sessao JWT com `id`, `email` e `role`
- expiracao simples e configuravel da sessao (padrao do NextAuth.js, ajustavel via `maxAge`)
- sem OAuth externo, sem recuperacao de senha nesta primeira versao

Se o usuario informar outro identificador principal (ex.: CPF em vez de e-mail), adapte todas as etapas para manter coerencia entre entidade, repositorio, caso de uso, NextAuth.js e middleware.

## Regras de teste e validacao final

Esta skill deve garantir que as skills filhas cumpram seus proprios contratos de teste.

Ao final, validar no minimo:

1. testes relevantes da entidade `Usuario`
2. testes relevantes do repositorio de dominio e de sua fake
3. testes relevantes dos casos de uso
4. testes relevantes do provider de criptografia, quando houver logica observavel
5. build do projeto (`npm run build`)
6. cobertura minima de 80% no Core (`src/core`), conforme exigido pelo projeto

Se alguma skill filha exigir coverage de 100% para seu escopo, respeite essa exigencia.

## Condicoes de parada obrigatoria

Pare e reporte com clareza quando ocorrer qualquer um destes casos:

- falta de skill obrigatoria do catalogo
- ambiguidade real sobre atributos do `Usuario`, roles adicionais ou estrategia de sessao
- conflito serio entre a especificacao do usuario e a estrutura atual do repositorio
- impossibilidade de montar o fluxo minimo de autenticacao sem improvisar arquitetura paralela (ex.: sem NextAuth.js instalado e o usuario nao autorizar a instalacao)
- falha em testes obrigatorios ou build final

## Formato do relatorio final

Ao concluir a execucao desta skill, entregar um resumo objetivo com:

1. skills utilizadas
2. arquivos principais criados ou alterados
3. testes executados
4. o que foi validado com sucesso
5. pendencias, limitacoes ou proximos passos (ex.: recuperacao de senha, OAuth, paginas especificas por role)

## Saida esperada

1. dominio de `Usuario` criado ou atualizado (entidade, repositorio, casos de uso)
2. persistencia integrada ao Mongoose
3. provider de criptografia implementado
4. NextAuth.js configurado com Credentials Provider e sessao contendo `role`
5. `middleware.ts` protegendo rotas privadas por sessao e por role
6. Route Handler/Server Action de registro criados
7. base pronta para proteger paginas, Route Handlers e Server Actions de outros modulos com `ADMIN`, `ATLETA` ou `USER`
