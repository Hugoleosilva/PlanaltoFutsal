Crie uma skill chamada `domain-use-case-scaffold` dentro de `skills-and-prompts/skills/domain-use-case-scaffold` para criar casos de uso em agregados dentro de `src/core/use-cases/`, seguindo o padrao estrutural ja adotado no projeto, e gerando tambem os testes unitarios necessarios para garantir cobertura de 100% do caso de uso criado.

No `SKILL.md`, defina:

- `name`: `domain-use-case-scaffold`
- `description`: `Cria casos de uso padronizados para agregados do Planalto Futsal (Atleta, Campeonato, Financeiro, Usuario/RBAC, etc.) dentro de src/core/use-cases, com contratos de entrada e saída consistentes, implementação inicial simples, testes unitários completos e estrutura pronta para evolução pelo time.`

Objetivo da skill:

- Criar a estrutura base de um caso de uso em `src/core/use-cases/<aggregate>/<use-case>.usecase.ts`.
- Produzir implementacoes simples, legiveis e faceis de evoluir, sem inventar fluxos complexos sem necessidade.
- Criar tambem os testes unitarios do caso de uso, com cobertura de 100%.
- Reaproveitar implementacoes fake/in-memory ja existentes (`*.repository.fake.ts`, `*.provider.fake.ts`) para apoiar os testes.

Entradas obrigatorias da skill:

1. O nome do agregado (ex.: `atleta`, `usuario`).
2. O nome do caso de uso.
3. O tipo de cenario: `crud` (criar, atualizar, excluir, buscar por id, buscar pagina) ou `custom` (qualquer outro).
4. Se o caso de uso devolve saida ou nao.

Regras da implementacao do caso de uso:

1. Nome de arquivo em `kebab-case`, sufixo `.usecase.ts`. Nome da classe em PascalCase, **sem** sufixo `UseCase` (ex.: arquivo `registrar-usuario.usecase.ts`, classe `RegistrarUsuario`).
2. Interface de entrada com sufixo `In` (ex.: `RegistrarUsuarioIn`). Interface de saida, quando existir, com sufixo `Out`. Quando nao houver saida relevante, usar `void` e omitir `Out`.
3. A classe implementa `UseCase<In, Out>` (import de `../../use-case`, relativo dentro de `src/core/use-cases`).
4. Dependencias (repositorios, providers tecnicos) recebidas pelo construtor. Entidade e repositorio do proprio agregado importados de `../../domain/<aggregate>` (alias equivalente a subir dois niveis ate `src/core/domain/<aggregate>`).
5. Nao acoplar o caso de uso a Route Handler, Server Action, Mongoose ou HTTP.
6. Nunca usar `any`.

Regras dos testes unitarios:

1. Teste em `src/core/use-cases/<aggregate>/<use-case>.usecase.test.ts` (mesma pasta do caso de uso).
2. Cobertura minima: caminho feliz, falhas de validacao, dependencias chamadas/nao chamadas conforme o fluxo, branches, retorno esperado, comportamento de erro propagado, ausencia de efeitos colaterais em falha antecipada.
3. Usar fakes concretas reais (nao mocks de framework como estrategia principal); reaproveitar fakes existentes do agregado antes de criar novas; se precisar criar uma fake nova, coloca-la ao lado do contrato correspondente e exporta-la no `index.ts` do agregado.
4. Cobertura esperada: 100% para o caso de uso criado ou alterado.

Atualizar `src/core/use-cases/<aggregate>/index.ts` preservando exports existentes.

A skill deve incluir referencias internas em `references/`:

- `mandatory-readings.md`, com a lista de leituras obrigatorias (um caso de uso `custom` de referencia, o `index.ts` do agregado, `use-case.ts`, fakes existentes).
- `few-shots/custom-registrar-usuario.usecase.example.ts` e seu teste — caso de uso `custom` com um provider tecnico (`CryptoProvider`) e persistencia, usando o agregado `Usuario` (nome, email, senha, role `ADMIN`/`ATLETA`/`USER`).
- `few-shots/crud-delete-atleta.usecase.example.ts` e seu teste — caso de uso `crud` sem retorno.
- `few-shots/crud-find-atleta-by-id.usecase.example.ts` e seu teste — caso de uso `crud` com retorno opcional (`| null`).

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- A skill nao cria Route Handler, Server Action, schema ou repositorio Mongoose.
- O nome da classe do caso de uso nao deve terminar com `UseCase`.
- A entrada usa sufixo `In`; a saida, quando existir, usa sufixo `Out`.
- A cobertura esperada para o caso de uso criado ou alterado deve ser 100%.
