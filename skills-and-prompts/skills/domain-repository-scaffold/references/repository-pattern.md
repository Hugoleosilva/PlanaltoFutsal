# Repository Pattern

Padrao observado no projeto:

- O contrato do repositorio (porta de dominio) fica em `src/core/domain/<aggregate>/<aggregate>.repository.ts`
- O `index.ts` do agregado (`src/core/domain/<aggregate>/index.ts`) reexporta o contrato junto com a entidade
- O repositorio de dominio importa `CrudRepository` de `../repositories` (relativo, dentro de `src/core/domain`)
- A entidade do agregado vem de `./<aggregate>.entity` (mesma pasta)
- A fake para testes de caso de uso fica colocada ao lado do contrato, em `src/core/domain/<aggregate>/<aggregate>.repository.fake.ts`
- A fake importa entidade, tipos de pagina e o contrato via alias `@/core/domain/<aggregate>` quando estiver fora da pasta do agregado (ex.: dentro de um teste de caso de uso em `src/core/use-cases/<aggregate>/`)

Padrao CRUD minimo observado em `atleta`:

```ts
import { CrudRepository } from "../repositories";
import { Atleta } from "./atleta.entity";

export interface AtletaPageParams {
  page: number;
  perPage: number;
}

export interface AtletaRepository extends CrudRepository<
  Atleta,
  Atleta,
  Atleta,
  AtletaPageParams
> {}
```

Padrao da fake observado em `atleta`:

- usa `Map<string, Entity>` para storage
- aceita dados iniciais no construtor
- expoe leitura da colecao em memoria
- implementa `findPage` retornando `PageResult<TEntity>` (importado de `@/core/domain/repositories` ou `../repositories`, conforme a pasta do arquivo)
- falha no `update` quando o registro nao existe

Heuristicas seguras:

- Se a entidade ja representa o payload de criacao e atualizacao, reutilize a propria entidade como generic de `CrudRepository`.
- Se nao for seguro reutilizar a entidade, crie tipos auxiliares locais pequenos e explicitos no proprio arquivo do repositorio.
- Se o pedido mencionar somente parte das operacoes CRUD, prefira composicao com contratos granulares (`CreateRepository`, `UpdateRepository`, `DeleteRepository`, `FindByIdRepository`, `FindPageRepository`) em vez de `CrudRepository`.
- Em repositorios customizados, evite declarar manualmente um metodo que ja encaixa em contrato compartilhado.

## Sobre a implementacao real (Mongoose)

Esta skill cria apenas o **contrato** (porta) e a **fake em memoria**. A implementacao real com Mongoose (schema + classe concreta que implementa o contrato, usando `mongoose.Model` para acessar o MongoDB) fica em `src/infrastructure/database/<aggregate>/`, fora do escopo desta skill. Isso preserva a inversao de dependencia: o dominio (`src/core`) nunca importa Mongoose diretamente.
