Crie uma skill chamada `infrastructure-provider-scaffold` dentro de `skills-and-prompts/skills/infrastructure-provider-scaffold` para implementar, em `src/infrastructure/`, interfaces de provider tecnico definidas no dominio dentro de `src/core/domain/<aggregate>/*.provider.ts`, criando classes concretas simples em TypeScript puro e instalando dependencias externas quando necessario.

No `SKILL.md`, defina:

- `name`: `infrastructure-provider-scaffold`
- `description`: `Implementa em src/infrastructure os providers técnicos definidos como contratos no domínio do Planalto Futsal (criptografia de senha, JWT/sessão, e-mail, geração de id, relógio, etc.), criando classes concretas simples em TypeScript puro, sem container de DI, prontas para serem injetadas manualmente em Route Handlers, Server Actions ou casos de uso.`

Contexto importante: este projeto e um unico app Next.js e **nao usa NestJS** nem nenhum container de DI equivalente. Nao criar `@Injectable()`, tokens, symbols ou modulos de registro de provider. A "injecao" acontece por composicao manual: quem monta o caso de uso (uma factory simples, um Route Handler ou uma Server Action) instancia a classe concreta e a passa pelo construtor.

Objetivo da skill:

- Criar a implementacao concreta, em `src/infrastructure/<categoria>/` (`security/` para criptografia/JWT/sessao, `audit/` para auditoria, ou outra categoria tecnica coerente), de uma interface de provider definida no dominio.
- Manter a interface original do dominio intacta.
- Permitir implementacao simples, direta e facil de manter, sem camadas extras artificiais.
- Instalar dependencias externas quando a implementacao exigir bibliotecas especificas.

Entradas obrigatorias da skill:

1. A interface de provider que deve ser implementada (path explicito ou nome inequivoco quando houver apenas um alvo claro).
2. A categoria de infraestrutura, quando nao puder ser inferida com seguranca pelo tipo do provider.

Trava obrigatoria:

1. So executar quando a interface de provider alvo estiver claramente identificada; se houver ambiguidade, parar e pedir o provider exato.
2. Nao modificar, reescrever ou expandir a interface original do dominio — trata-la como contrato imutavel.

Regras da implementacao:

1. Implementacao em `src/infrastructure/<categoria>/<nome-tecnico>.provider.ts`, nome de classe explicito e orientado a implementacao concreta (ex.: `BcryptCryptoProvider`).
2. Classe TypeScript simples, sem decorators de framework, cumprindo exatamente o contrato da interface original.
3. Preferir bibliotecas ja instaladas; ao escolher biblioteca nova, considerar se o provider roda em Edge Runtime ou Node.js Runtime (evitar bibliotecas Node-only como `bcrypt` em rotas Edge).
4. Conectar ao ponto de uso via instanciacao direta ou via uma factory simples de composicao (ex.: `makeRegistrarUsuario()`), quando o mesmo caso de uso for montado em mais de um lugar.
5. Ler configuracao sensivel de `process.env` (variaveis de ambiente do Next.js), sem reinventar infraestrutura de configuracao.
6. Nunca usar `any`.

Providers tipicos a suportar: criptografia de senha (complementando NextAuth.js quando necessario), e-mail (ex.: notificacao de mensalidade em atraso), geracao de id/uuid, relogio/data, storage de arquivos (ex.: upload de fotos de jogos).

A skill deve incluir referencias internas em `references/`:

- `mandatory-readings.md`, com a lista de leituras obrigatorias antes de implementar.
- `provider-implementation-checklist.md`, cobrindo naming, estrategia de biblioteca, como conectar sem container de DI, regras de teste e o que evitar (nunca criar tokens/containers de DI, nunca reimplementar sessao/JWT quando o NextAuth.js ja cobre o caso).
- `few-shots/bcrypt-crypto.provider.example.ts` (implementacao concreta sem NestJS), `few-shots/uuid.provider.example.ts` (provider simples baseado no runtime do Node) e `few-shots/usuario-usecase-factory.example.ts` (exemplo de composicao manual de um caso de uso com a implementacao concreta, para uso em um Route Handler).

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- A interface original do provider nao deve ser modificada em hipotese nenhuma.
- A implementacao concreta deve ficar em `src/infrastructure/<categoria>/`.
- Nao criar tokens, symbols ou containers de DI — nao ha NestJS neste projeto.
- Nunca usar `any`.
