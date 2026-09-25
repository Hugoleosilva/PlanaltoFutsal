Crie uma skill chamada `domain-entity-scaffold` dentro de `skills-and-prompts/skills/domain-entity-scaffold` para criar ou completar entidades de dominio dentro de agregados existentes em `src/core/domain/<aggregate>/`, seguindo o padrao estrutural ja adotado no kernel compartilhado, e para gerar tambem os testes unitarios dessa entidade com meta explicita de cobertura de 100%.

No `SKILL.md`, defina:

- `name`: `domain-entity-scaffold`
- `description`: `Cria entidades de domínio padronizadas para os agregados do Planalto Futsal (Atleta, Campeonato, Financeiro, Foto, Carona, etc.) dentro de src/core/domain, com estado tipado, herança da entidade base, validação explícita orientada por regras reutilizáveis do projeto e testes unitários completos para garantir segurança de evolução.`

Objetivo da skill:

- Criar uma entidade de dominio com estrutura consistente em `src/core/domain/<aggregate>/<entity>.entity.ts`.
- Implementar validacao explicita e lazy (nunca eager no construtor).
- Inferir o melhor conjunto possivel de regras de validacao com base nos campos informados, priorizando regras ja existentes em `src/shared/validation/rules` antes de propor novas (via `shared-validation-rule`).
- Gerar testes unitarios robustos com cobertura de 100% para a entidade criada ou atualizada.

Referencias obrigatorias que a skill deve ler antes de gerar a entidade:

1. `src/core/domain/entity.ts`
2. `src/shared/validation/rules/`
3. `src/shared/validation/index.ts`
4. `src/shared/validation/validator.ts`
5. `src/infrastructure/errors/index.ts` (para `ValidationException`)

Entradas obrigatorias da skill:

1. O nome do agregado.
2. O nome da entidade (na maioria dos casos, igual ao agregado; pode ser uma entidade filha, ex.: `Mensalidade` dentro do agregado `financeiro`).
3. A lista de atributos da entidade com seus tipos.

Entrada opcional: regras explicitas informadas pelo usuario para campos especificos.

Regras da implementacao:

1. Validar que `src/core/domain/<aggregate>` existe (senao, orientar a rodar `domain-aggregate-scaffold` antes).
2. Criar ou atualizar `src/core/domain/<aggregate>/<entity>.entity.ts`, nome de arquivo em `kebab-case`.
3. Interface de estado `<EntityName>State extends EntityState`; classe `<EntityName> extends Entity<<EntityName>State>`.
4. O construtor apenas repassa `props` para `super(props)`. Nunca chamar `validate()` no construtor — a entidade pode existir temporariamente invalida (ex.: formulario de cadastro de Atleta ainda incompleto no client).
5. Getters explicitos para todos os campos. `validate()` concentra as regras via `Validator.validate([...])`.
6. Import da classe base de entidade e sempre relativo (`../entity`, dentro de `src/core/domain`); import de regras de validacao usa o alias `@/shared/validation` (pasta de topo diferente).
7. Inferir regras por nome/tipo do campo (nomes pessoais, email, CPF/RG, telefone BR, CEP, datas passadas/futuras, numeros inteiros/positivos, arrays, etc.), sempre priorizando regras ja existentes.
8. Se faltar uma regra generica e reutilizavel, usar a skill `shared-validation-rule` para cria-la antes de usar na entidade.
9. Codigos de erro seguem o padrao `<aggregate>.<campo>` para o agregado principal, ou `<entity>.<campo>` para entidades filhas.
10. Atualizar `src/core/domain/<aggregate>/index.ts` para exportar a nova entidade, preservando exports existentes.

Regras para os testes unitarios:

1. Teste em `src/core/domain/<aggregate>/<entity>.entity.test.ts`.
2. Cobertura minima obrigatoria: criacao valida, getters, comportamento lazy, sucesso/falha de `validate()`, mensagens de erro, cenarios limite, comportamento herdado relevante (`clone`, `deletedAt`, timestamps), branches internos de `validate()`.
3. Cobertura esperada: 100% para a entidade criada ou alterada.

A skill deve incluir referencias internas em `references/`:

- `atleta-entity-pattern.md`, com um exemplo completo de entidade `Atleta` (nome, email, dataNascimento, numeroCamisa) seguindo exatamente o padrao acima, servindo de referencia canonica do projeto.
- `validation-inference-guide.md`, mapeando nomes de campo comuns do dominio do Planalto Futsal (nome, email, senha, CPF/RG, telefone, datas, valores monetarios, arrays de convocados/fotos) para as regras de `src/shared/validation/rules` apropriadas.

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- A skill nao cria Route Handler, Server Action, schema Mongoose ou adaptacao de infraestrutura.
- O metodo `validate()` e explicito e manual; a entidade pode existir em estado invalido ate que `validate()` seja chamado.
- Nunca usar `any`.
- A cobertura esperada para a entidade criada ou alterada deve ser 100%.
