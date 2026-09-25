# Mandatory Readings

Leia estes arquivos do projeto antes de criar ou atualizar qualquer caso de uso com esta skill:

1. Um caso de uso `custom` ja existente no projeto (ex.: `src/core/use-cases/usuario/registrar-usuario.usecase.ts`, se ja tiver sido criado)
2. `src/core/use-cases/<aggregate>/index.ts` do agregado alvo, se existir
3. O teste correspondente, quando existir
4. As fakes do agregado em `src/core/domain/<aggregate>/<aggregate>.repository.fake.ts` e eventuais `*.provider.fake.ts`
5. `src/core/use-cases/use-case.ts`
6. `src/core/use-cases/index.ts`

Objetivo de cada bloco:

- caso de uso de referencia: estrutura, contratos e orquestracao.
- `index.ts` do agregado: padrao de export.
- teste de referencia: estilo de teste e observacao de efeitos colaterais.
- fakes: estilo das implementacoes concretas usadas em teste.
- `use-case.ts`: contrato base `UseCase<In, Out>`.

Depois das leituras acima, consulte os few-shots locais desta skill para acelerar a materializacao dos casos mais comuns sem fugir do padrao do projeto:

- `references/few-shots/custom-registrar-usuario.usecase.example.ts` e seu teste — caso de uso `custom` com provider tecnico e persistencia
- `references/few-shots/crud-delete-atleta.usecase.example.ts` e seu teste — caso de uso `crud` sem retorno
- `references/few-shots/crud-find-atleta-by-id.usecase.example.ts` e seu teste — caso de uso `crud` com retorno opcional
