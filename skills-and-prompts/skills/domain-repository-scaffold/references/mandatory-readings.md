# Mandatory Readings

Leia estes arquivos exatamente nesta ordem antes de gerar o repositorio:

1. `src/core/domain/repositories/create.repository.ts`
2. `src/core/domain/repositories/update.repository.ts`
3. `src/core/domain/repositories/delete.repository.ts`
4. `src/core/domain/repositories/find-by-id.repository.ts`
5. `src/core/domain/repositories/find-page.repository.ts`
6. `src/core/domain/repositories/crud.repository.ts`
7. `src/core/domain/repositories/index.ts`
8. Um exemplo real ja implementado no projeto, ex.: `src/core/domain/atleta/atleta.repository.ts`
9. A entidade correspondente, ex.: `src/core/domain/atleta/atleta.entity.ts`
10. A fake correspondente, ex.: `src/core/domain/atleta/atleta.repository.fake.ts`

Extraia dessas leituras:

- quais contratos genericos ja existem em `src/core/domain/repositories`
- como o projeto importa esses contratos (`../repositories`, relativo dentro de `src/core/domain`)
- como o agregado expoe entidade e repositorio via `index.ts`
- como a fake usa `Map`, `PageResult` e imports do proprio agregado (relativo quando esta na mesma pasta, `@/core/domain/<aggregate>` quando esta em outra pasta como `src/core/use-cases/<aggregate>/`)
- qual convencao de nome o projeto usa para `PageParams`, `Repository` e `Fake...Repository` / `<Aggregate>Repository.fake.ts`

Antes de editar arquivos do agregado alvo, confira tambem:

- `src/core/domain/<aggregate>/index.ts`, se existir
- outras entidades ou repositorios ja presentes no mesmo agregado

Se qualquer leitura obrigatoria falhar, pare e relate claramente o bloqueio.
