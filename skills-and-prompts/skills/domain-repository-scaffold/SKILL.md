---
name: domain-repository-scaffold
description: Cria contratos de repositório (portas de domínio) padronizados para agregados do Planalto Futsal dentro de src/core/domain, reaproveitando interfaces compartilhadas de persistência e gerando também uma implementação em memória para apoiar testes dos casos de uso.
---

# Domain Repository Scaffold

Use esta skill quando o pedido for criar ou completar o contrato de repositorio de um agregado dentro de `src/core/domain/<aggregate>/`, junto com uma implementacao fake/in-memory reutilizavel para testes de casos de uso.

Esta skill cobre somente:

- interface de repositorio no dominio (porta)
- tipos auxiliares minimos do contrato
- exports do `index.ts` do agregado
- implementacao fake/in-memory simples e funcional

Esta skill nao cria:

- schema ou repositorio Mongoose
- Route Handler ou Server Action
- seed
- qualquer adaptador de infraestrutura real (isso vive em `src/infrastructure/database/<aggregate>/`, fora do escopo desta skill)

## Entradas obrigatorias

1. `agregado` (ex.: `atleta`, `campeonato`, `financeiro`)
2. `tipo de repositorio`
   - `crud`
   - `custom`
3. `entidade principal` manipulada pelo repositorio

## Entradas obrigatorias quando `tipo=custom`

4. lista de metodos desejados
5. assinatura esperada ou intencao de cada metodo quando houver ambiguidade relevante

Sem essas entradas, interrompa e peca somente os dados faltantes.

Perguntas objetivas permitidas:

- `Informe o agregado (a pasta em src/core/domain/<agregado>).`
- `Deseja um repositorio "crud" ou "custom"?`
- `Qual entidade principal esse repositorio manipula?`
- `Liste os metodos customizados e a assinatura esperada de cada um.`

## Leituras obrigatorias

Antes de gerar qualquer arquivo, leia obrigatoriamente:

1. `src/core/domain/repositories/create.repository.ts`
2. `src/core/domain/repositories/update.repository.ts`
3. `src/core/domain/repositories/delete.repository.ts`
4. `src/core/domain/repositories/find-by-id.repository.ts`
5. `src/core/domain/repositories/find-page.repository.ts`
6. `src/core/domain/repositories/crud.repository.ts`
7. `src/core/domain/repositories/index.ts`
8. `src/core/domain/<aggregate>/<aggregate>.entity.ts`

Depois disso, consulte tambem os materiais internos desta skill:

- `references/mandatory-readings.md`
- `references/repository-pattern.md`
- `references/few-shots/atleta.repository.example.ts`
- `references/few-shots/fake-atleta.repository.example.ts`

## Resolucao de destino

Aceite exatamente dois modos:

1. Por convencao:
   - `src/core/domain/<aggregate>/<aggregate>.repository.ts`
2. Por path explicito informado pelo usuario

Regras:

- Validar que `src/core/domain/<aggregate>` existe (se nao existir, rodar `domain-aggregate-scaffold` antes).
- Se o destino for por convencao, o nome do arquivo deve ser sempre `<aggregate>.repository.ts` em `kebab-case`.
- O repositorio deve ficar dentro de `src/core/domain/<aggregate>/`, junto da entidade.
- Preserve convencoes locais ja existentes quando houver um path explicito valido.

## Arquivos que a skill deve criar ou atualizar

- `src/core/domain/<aggregate>/<aggregate>.repository.ts`
- `src/core/domain/<aggregate>/<aggregate>.repository.fake.ts`
- `src/core/domain/<aggregate>/index.ts` quando necessario para expor o contrato e a fake

Preserve exports existentes. Nunca apague export valido para simplificar.

## Workflow

1. Validar entradas obrigatorias.
2. Resolver `aggregate` e o path final do repositorio.
3. Confirmar que o agregado existe.
4. Ler as referencias obrigatorias do projeto e as referencias internas desta skill.
5. Ler os arquivos atuais do agregado:
   - `src/core/domain/<aggregate>/<aggregate>.entity.ts`
   - `src/core/domain/<aggregate>/index.ts`, se existir
6. Descobrir os nomes reais ja usados para entidade, tipos auxiliares e exports.
7. Gerar a interface do repositorio seguindo as regras abaixo.
8. Gerar a fake/in-memory implementando o contrato recem-criado.
9. Atualizar `index.ts` necessario sem perder exports existentes.
10. Reportar o que foi criado ou ajustado e qualquer placeholder introduzido.

## Regras da interface

- O contrato deve seguir o padrao `export interface <EntityName>Repository`.
- Reaproveite contratos de `src/core/domain/repositories` sempre que houver encaixe claro.
- Evite reescrever assinaturas que ja existem em `CreateRepository`, `UpdateRepository`, `DeleteRepository`, `FindByIdRepository`, `FindPageRepository` ou `CrudRepository`.
- Use os tipos reais da entidade e dos parametros relacionados ao agregado quando existirem.
- Se tipos auxiliares ainda nao existirem e nao der para inferir com seguranca, crie placeholders tipados, pequenos e didaticos no proprio arquivo do repositorio.
- Nao invente regras de negocio nem campos detalhados de dominio.
- O arquivo deve ser estrutural: contrato e tipos minimos, sem infraestrutura real.
- Nunca usar `any`.

### Quando `tipo=crud`

Prefira:

```ts
import { CrudRepository } from "../repositories";
import { <EntityName> } from "./<aggregate>.entity";

export interface <EntityName>Repository extends CrudRepository<
  <CreateInput>,
  <UpdateInput>,
  <EntityName>,
  <PageParams>,
  <IdType>
> {}
```

Regras:

- Peca ou infira com seguranca:
  - entidade principal
  - tipo de entrada de criacao
  - tipo de entrada de atualizacao
  - tipo de parametros de paginacao, quando houver `findPage`
- Se nao for possivel inferir com seguranca, crie placeholders como:
  - `<EntityName>CreateInput`
  - `<EntityName>UpdateInput`
  - `<EntityName>PageParams`
- Prefira um contrato enxuto e facil de evoluir.
- Se o repositorio nao precisar de `findPage`, nao force `CrudRepository`; componha interfaces granulares quando isso deixar o contrato mais fiel ao pedido.

### Quando `tipo=custom`

Regras:

- Exija a lista de metodos desejados.
- Crie cada metodo com nome, parametros e retorno coerentes com a intencao informada.
- Se houver ambiguidade relevante sobre parametros ou retorno, interrompa e peca esclarecimento antes de inventar uma assinatura.
- Se um metodo descrito pelo usuario corresponder claramente a `create`, `update`, `delete`, `findById` ou `findPage`, prefira compor a interface com os contratos compartilhados em vez de duplicar assinatura manual.
- Quando fizer sentido, combine contratos compartilhados com metodos adicionais no mesmo `interface`.
- Metodos com semantica especifica de futsal sao esperados aqui (ex.: `findByNumeroCamisa`, `findAtletasAtivosNoCampeonato`, `findMensalidadesEmAberto`) — a interface e o lugar certo para expressar essas consultas de dominio.

## Regras da fake/in-memory

- Sempre gere tambem uma fake/in-memory.
- A fake nao usa framework de mock.
- A fake deve ser uma classe simples, concreta e funcional.
- O objetivo e suportar testes reais de casos de uso sem MongoDB.
- O destino e `src/core/domain/<aggregate>/<aggregate>.repository.fake.ts`, ao lado do contrato.
- A classe fake deve implementar a interface do repositorio recem-criada.
- Priorize `Map`, `Array` ou combinacao simples das duas para armazenamento.
- Priorize clareza e previsibilidade, nao realismo de infraestrutura.

### Fake para `crud`

- Implemente comportamento funcional para os metodos do contrato.
- Para `create`, persista em memoria e retorne a entidade salva.
- Para `update`, substitua o item existente e falhe de forma simples quando o registro nao existir.
- Para `delete`, remova o item em memoria.
- Para `findById`, retorne a entidade ou `null`.
- Para `findPage`, monte um `PageResult<TEntity>` simples, coerente com o padrao do projeto.
- Use `entity.id` como chave, seguindo o padrao atual do projeto.

### Fake para `custom`

- Implemente versoes simples e coerentes dos metodos definidos.
- Se o metodo representar busca, filtre os dados em memoria.
- Se o metodo representar comando, atualize o armazenamento e retorne o minimo necessario para testes.
- Nao simule integracoes externas nem dependencias de framework.

## Convencoes de import e export

- No repositorio de dominio, importe `CrudRepository` (e demais contratos granulares) de `../repositories`.
- No repositorio de dominio, importe a entidade a partir de `./<aggregate>.entity` (mesma pasta).
- Na fake, quando estiver na mesma pasta do agregado, use imports relativos (`./<aggregate>.entity`, `./<aggregate>.repository`, `../repositories`); quando for consumida de fora (por exemplo, em `src/core/use-cases/<aggregate>/*.usecase.test.ts`), use o alias `@/core/domain/<aggregate>`.
- Atualize `src/core/domain/<aggregate>/index.ts` com `export * from "./<aggregate>.repository";` e, se fizer sentido, `export * from "./<aggregate>.repository.fake";`.

## Guardrails

- Nao prosseguir sem agregado e tipo claramente definidos.
- Nao assumir que todo repositorio e CRUD.
- Nao criar implementacao Mongoose, Route Handler ou qualquer persistencia real.
- Nao editar arquivos fora do agregado alvo, exceto a propria skill quando estiver sendo criada ou atualizada.
- Nao duplicar contratos que ja existem em `src/core/domain/repositories`.
- Nao criar assinaturas arbitrarias quando houver ambiguidade relevante.
- Nao remover exports existentes.
- Nao introduzir dependencias de framework na fake.
- Nunca usar `any`.

## Saida esperada

- Interface de repositorio coerente com o agregado
- Tipos auxiliares minimos quando necessarios
- Fake/in-memory funcional para testes futuros
- Exports do agregado atualizados

Consulte `references/mandatory-readings.md` para o checklist de leitura e `references/repository-pattern.md` para o padrao observado no projeto.
