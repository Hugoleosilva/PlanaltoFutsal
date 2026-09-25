Crie uma skill chamada `domain-repository-scaffold` dentro de `skills-and-prompts/skills/domain-repository-scaffold` para criar contratos de repositorio (portas de dominio) em agregados dentro de `src/core/domain/`, reaproveitando os contratos genericos ja existentes em `src/core/domain/repositories` e gerando tambem uma implementacao em memoria para uso em testes futuros de casos de uso.

No `SKILL.md`, defina:

- `name`: `domain-repository-scaffold`
- `description`: `Cria contratos de repositório (portas de domínio) padronizados para agregados do Planalto Futsal dentro de src/core/domain, reaproveitando interfaces compartilhadas de persistência e gerando também uma implementação em memória para apoiar testes dos casos de uso.`

Objetivo da skill:

- Criar a interface de repositorio de um agregado em `src/core/domain/<aggregate>/<aggregate>.repository.ts`.
- Reaproveitar os contratos genericos ja existentes em `src/core/domain/repositories` (`CreateRepository`, `UpdateRepository`, `DeleteRepository`, `FindByIdRepository`, `FindPageRepository`, `CrudRepository`, `PageResult`).
- Permitir tanto um repositorio completo (`crud`) quanto um repositorio com metodos especificos (`custom`).
- Criar tambem uma implementacao simples em memoria (`<aggregate>.repository.fake.ts`, colocada ao lado do contrato) para uso em testes.
- Nao implementar infraestrutura real: nao criar schema/repositorio Mongoose, Route Handler ou Server Action (isso fica em `src/infrastructure/database/<aggregate>/`, fora do escopo desta skill).

Referencias obrigatorias que a skill deve ler antes de gerar o repositorio:

1. `src/core/domain/repositories/create.repository.ts`
2. `src/core/domain/repositories/update.repository.ts`
3. `src/core/domain/repositories/delete.repository.ts`
4. `src/core/domain/repositories/find-by-id.repository.ts`
5. `src/core/domain/repositories/find-page.repository.ts`
6. `src/core/domain/repositories/crud.repository.ts`
7. `src/core/domain/repositories/index.ts`
8. Um exemplo real ja implementado no projeto (se houver)

Entradas obrigatorias da skill:

1. O agregado (a pasta `src/core/domain/<aggregate>`).
2. O tipo de repositorio: `crud` ou `custom`.
3. A entidade principal que o repositorio ira manipular.

Entradas obrigatorias quando `tipo=custom`: a lista de metodos desejados e, quando houver ambiguidade, a assinatura esperada de cada um.

Regras da implementacao da interface:

1. Validar que o agregado existe (senao, orientar `domain-aggregate-scaffold` antes).
2. A interface segue `export interface <EntityName>Repository ...`, dentro de `src/core/domain/<aggregate>/<aggregate>.repository.ts`.
3. Importar `CrudRepository` (e demais contratos granulares) de `../repositories` (relativo, dentro de `src/core/domain`); importar a entidade de `./<aggregate>.entity` (mesma pasta).
4. Quando `tipo=crud`, preferir herdar de `CrudRepository<...>`. Quando `tipo=custom`, montar a interface com base nos metodos solicitados, compondo com contratos granulares quando houver encaixe claro (ex.: `findByEmail` e customizado, mas `create`/`update`/`delete` continuam vindo de `CrudRepository`).
5. Nao duplicar contratos que ja existem em `src/core/domain/repositories`. Nao inventar regras de negocio.

Regras da implementacao em memoria para testes:

1. Classe simples, concreta e funcional (`Map`/`Array` para armazenamento), sem framework de mock.
2. Destino: `src/core/domain/<aggregate>/<aggregate>.repository.fake.ts`, ao lado do contrato.
3. Aceita dados iniciais no construtor; expoe leitura da colecao em memoria; implementa `findPage` retornando `PageResult<TEntity>`; falha em `update` quando o registro nao existe.
4. Atualizar `src/core/domain/<aggregate>/index.ts` com os exports do contrato e da fake.

A skill deve incluir referencias internas em `references/`:

- `mandatory-readings.md`, com a lista de leituras obrigatorias e o que extrair de cada uma.
- `repository-pattern.md`, documentando o padrao observado (import de `../repositories`, import de `./<aggregate>.entity`, fake colocada ao lado do contrato, e uma nota explicando que a implementacao Mongoose real fica em `src/infrastructure/database/<aggregate>/`, fora do escopo desta skill, preservando a inversao de dependencia).
- `few-shots/atleta.repository.example.ts` e `few-shots/fake-atleta.repository.example.ts`, com um exemplo completo usando o agregado `Atleta`.

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- A skill nao implementa persistencia real, nao cria Mongoose, Route Handler ou Server Action.
- A skill nao deve assumir que todo repositorio sera CRUD.
- A fake em memoria faz parte da entrega da skill, porque sera usada pelos testes dos casos de uso.
- Nunca usar `any`.
