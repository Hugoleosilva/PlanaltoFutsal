Crie uma skill chamada `nextjs-auth-rbac-spec` dentro de `skills-and-prompts/skills/nextjs-auth-rbac-spec` para orquestrar a criacao da estrutura basica de autenticacao e RBAC do Planalto Futsal com NextAuth.js/Auth.js, reaproveitando as skills do catalogo `skills-and-prompts/skills/`.

No `SKILL.md`, defina:

- `name`: `nextjs-auth-rbac-spec`
- `description`: `Orquestra a criação da base de autenticação e RBAC do Planalto Futsal com NextAuth.js/Auth.js e as roles ADMIN, ATLETA e USER, incluindo agregado e entidade de Usuario, repositório, casos de uso, provider de criptografia, configuração do NextAuth, middleware de proteção de rotas e integração com Route Handlers/Server Actions, reaproveitando as skills especializadas do projeto.`

Objetivo da skill:

- Construir a base de autenticacao e autorizacao (RBAC) do app Next.js unico do Planalto Futsal, de forma orientada por especificacao, orquestrando skills menores em sequencia previsivel.
- Cobrir: agregado/entidade `Usuario` (com `role: "ADMIN" | "ATLETA" | "USER"`), repositorio, caso de uso de registro, persistencia Mongoose, provider de criptografia, configuracao do NextAuth.js (Credentials Provider, sessao JWT com `role`), middleware de protecao de rotas por role, e Route Handler/Server Action de registro.
- Nao incluir nesta primeira versao: recuperacao de senha, confirmacao por e-mail, providers OAuth externos, salvo pedido explicito.

Natureza da skill:

- Esta e uma skill orquestradora: nao deve reimplementar internamente o trabalho detalhado das outras skills.
- Deve verificar a existencia das skills necessarias no catalogo (`shared-kernel-scaffold`, `domain-aggregate-scaffold`, `domain-entity-scaffold`, `domain-repository-scaffold`, `domain-use-case-scaffold`, `shared-validation-rule`, `infrastructure-provider-scaffold`, `nextjs-module-scaffold`) antes de comecar, e parar com uma mensagem clara se alguma faltar.
- A implementacao Mongoose do repositorio de `Usuario` e a configuracao do proprio NextAuth.js (`auth.ts`/`auth.config.ts`, `middleware.ts`) NAO tem skill dedicada no catalogo — a skill orquestradora deve descrever esses dois passos diretamente (sao especificos demais do NextAuth.js para virar skill separada), evoluindo o que ja existir em vez de recriar do zero.

Sequencia sugerida de orquestracao:

1. Garantir o kernel compartilhado (`shared-kernel-scaffold`).
2. Criar/preparar o agregado `usuario` (`domain-aggregate-scaffold --aggregate usuario --mode crud`).
3. Criar a entidade `Usuario` com validacoes adequadas (`domain-entity-scaffold`): `nome`, `email`, `senhaHash` (`BcryptHashRule`), `role`.
4. Criar o contrato de repositorio de `Usuario`, com busca por e-mail para login (`domain-repository-scaffold`).
5. Criar o caso de uso `RegistrarUsuario` (`domain-use-case-scaffold`, tipo `custom`), validando senha forte, hasheando via `CryptoProvider` e persistindo.
6. Criar/reutilizar regras compartilhadas necessarias (`shared-validation-rule`).
7. Implementar o provider de criptografia concreto (`infrastructure-provider-scaffold`, ex.: `BcryptCryptoProvider` em `src/infrastructure/security/`).
8. Criar a implementacao Mongoose do repositorio de `Usuario` diretamente (schema com indice unico em `email`, classe concreta em `src/infrastructure/database/usuario/`, conexao Mongoose cacheada/reaproveitada entre requests).
9. Configurar o NextAuth.js/Auth.js: Credentials Provider chamando o repositorio/caso de uso, `session: { strategy: "jwt" }`, callbacks `jwt`/`session` expondo `role`/`id`, extensao de tipos (`next-auth.d.ts`) para tipar `session.user.role` sem `any`.
10. Criar/evoluir `middleware.ts` protegendo o grupo de rotas privadas e checando `role` quando a rota exigir uma role especifica.
11. Criar a superficie de registro (`nextjs-module-scaffold`, modulo `usuario`, `--access public`), adaptando a Server Action/Route Handler para chamar `RegistrarUsuario`.
12. Validar a integracao final: login retorna sessao com `role`; registro persiste usuario com senha protegida; rotas privadas/por-role bloqueiam corretamente.

Regras de orquestracao:

- Delegar para a skill especializada em vez de repetir suas instrucoes detalhadas; passar o resultado concreto de cada etapa para a proxima.
- Verificar arquivos e testes gerados em cada etapa antes de avancar.
- Manter coerencia de nomes entre agregado `usuario`, entidade `Usuario`, repositorio, casos de uso, provider e configuracao do NextAuth.js.
- Usar exatamente as tres roles do projeto (`ADMIN`, `ATLETA`, `USER`), sem inventar uma quarta sem pedido explicito.

Regras de teste e validacao final: garantir que as skills filhas cumpram seus contratos de teste (cobertura de 100% quando exigido), validar build do projeto (`npm run build`) e cobertura minima de 80% no Core ao final.

Condicoes de parada obrigatoria: falta de skill obrigatoria; ambiguidade real sobre atributos do `Usuario`/roles/estrategia de sessao; conflito serio com a estrutura atual do repositorio; impossibilidade de montar o fluxo minimo sem improvisar arquitetura paralela; falha em testes obrigatorios ou build final.

Formato do relatorio final: skills utilizadas, arquivos principais criados/alterados, testes executados, o que foi validado com sucesso, pendencias (ex.: recuperacao de senha, OAuth, paginas especificas por role).

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- Esta skill e uma orquestradora: coordena outras skills em vez de duplica-las.
- Ela deve focar em autenticacao e RBAC basicos do app Next.js unico (sem NestJS, sem Prisma).
- Ela deve deixar o projeto preparado para evolucao futura (paginas privadas por role de outros modulos, via `nextjs-module-scaffold`).
