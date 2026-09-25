---
name: domain-entity-scaffold
description: Cria entidades de domínio padronizadas para os agregados do Planalto Futsal (Atleta, Campeonato, Financeiro, Foto, Carona, etc.) dentro de src/core/domain, com estado tipado, herança da entidade base, validação explícita orientada por regras reutilizáveis do projeto e testes unitários completos para garantir segurança de evolução.
---

# Domain Entity Scaffold

Use esta skill quando o pedido for criar ou completar uma entidade de dominio dentro de um agregado existente em `src/core/domain/<aggregate>/`, junto com o teste unitario da entidade e a verificacao de coverage.

Esta skill nao cria Route Handler, Server Action, schema Mongoose, seed ou adaptacoes de infraestrutura. O foco aqui e somente:

- entidade de dominio
- validacao explicita e lazy
- reaproveitamento de regras compartilhadas
- testes unitarios fortes
- coverage de 100% para a entidade criada ou alterada (o projeto exige minimo de 80% no Core como um todo; a meta por entidade e 100%)

## Entradas obrigatorias

1. `nome do agregado` (ex.: `atleta`, `campeonato`, `financeiro`)
2. `nome da entidade` (na maioria dos casos, igual ao agregado principal; pode ser uma entidade filha, ex.: `mensalidade` dentro do agregado `financeiro`)
3. `lista de atributos com tipos`

Entrada opcional:

4. `regras explicitas por campo`, quando o usuario quiser forcar alguma validacao

## Referencias obrigatorias

Antes de gerar qualquer codigo, ler obrigatoriamente:

1. `src/core/domain/entity.ts`
2. `src/shared/validation/rules/`
3. `src/shared/validation/index.ts`
4. `src/shared/validation/validator.ts`
5. `src/infrastructure/errors/index.ts` (para `ValidationException`)

Tambem leia as referencias internas desta skill para acelerar a reproducao estrutural:

- `references/atleta-entity-pattern.md` (entidade de referencia do projeto)
- `references/validation-inference-guide.md`

## Validacoes iniciais

1. Validar que `src/core/domain/<aggregate>` existe (se nao existir, rodar `domain-aggregate-scaffold` antes).
2. Resolver o agregado a partir do nome informado.
3. Se o agregado nao existir, parar e pedir para rodar `domain-aggregate-scaffold` primeiro ou informar o agregado correto.
4. Nao inferir multiplos destinos. Se houver ambiguidade real entre dois caminhos validos, parar e pedir confirmacao.

## Destinos obrigatorios

- Entidade:
  - `src/core/domain/<aggregate>/<entity>.entity.ts`
- Teste:
  - `src/core/domain/<aggregate>/<entity>.entity.test.ts`

Convencoes obrigatorias:

- Nome do arquivo em `kebab-case`
- Interface de estado em `PascalCase` com sufixo `State`
- Classe em `PascalCase`

Exemplo:

- arquivo: `atleta.entity.ts`
- interface: `AtletaState`
- classe: `Atleta`

## Estrutura obrigatoria da entidade

Seguir exatamente o padrao do projeto:

1. `export interface <EntityName>State extends EntityState`
2. `export class <EntityName> extends Entity<<EntityName>State>`
3. Construtor apenas repassa `props` para `super(props)`
4. Getters explicitos para todos os campos informados
5. `validate()` com `Validator.validate([...])`

Formato esperado:

```ts
import { Entity, EntityState } from "../entity";
import { RequiredRule, Validator } from "@/shared/validation";

export interface AtletaState extends EntityState {
  nome: string;
}

export class Atleta extends Entity<AtletaState> {
  constructor(props: AtletaState) {
    super(props);
  }

  get nome(): string {
    return this.props.nome;
  }

  public validate(): void {
    Validator.validate([
      {
        code: "atleta.nome",
        value: this.nome,
        rules: [new RequiredRule()],
      },
    ]);
  }
}
```

Observacao de import: dentro de `src/core/domain/<aggregate>/`, a entidade base fica em `../entity` (relativo). As regras de validacao ficam em outra pasta de topo (`src/shared/validation`), entao use o alias `@/shared/validation`.

## Regra central de validacao

- Nao fazer validacao eager no construtor.
- Nao chamar `validate()` dentro do construtor.
- A entidade pode existir temporariamente invalida (por exemplo, um formulario de cadastro de Atleta ainda incompleto no client).
- Isso e intencional e obrigatorio.
- A unica validacao automatica aceita e a da classe base `Entity`, que valida `id` e timestamps.
- Toda regra de negocio da propria entidade deve ficar dentro de `validate()`.

## Heuristica de inferencia de validacao

A skill deve inferir o melhor conjunto possivel de regras com base em:

- nome do campo
- tipo do campo
- padrao observado nas regras existentes
- exemplo real da entidade de referencia do projeto
- regras explicitas fornecidas pelo usuario

Prioridades:

1. Regra explicita do usuario
2. Regra compartilhada ja existente em `src/shared/validation/rules`
3. Nova regra compartilhada, somente se ela for claramente generica e reutilizavel (usar a skill `shared-validation-rule` para isso)

Nunca:

- deixar campo relevante sem protecao por omissao
- criar regra local dentro da entidade quando ja existir regra compartilhada adequada
- criar regra compartilhada para comportamento hiper especifico de uma unica entidade

### Regras sugeridas por tipo e semantica

Use as regras compartilhadas existentes sempre que fizer sentido:

- `string` obrigatoria:
  - `RequiredRule`
- nomes pessoais (ex.: `nome` do Atleta, do responsavel):
  - `RequiredRule`
  - `MinLengthRule`
  - `MaxLengthRule`
  - `PersonNameRule`
- email:
  - `RequiredRule`
  - `EmailRule`
- CPF / RG do associado ou atleta:
  - `RequiredRule`
  - `CpfRule` / `RgRule`
- telefone/whatsapp de contato:
  - `RequiredRule`
  - `PhoneBrRule`
- CEP de endereco:
  - `RequiredRule`
  - `CepRule`
- slug (ex.: slug de uma noticia ou album de fotos):
  - `RequiredRule`
  - `SlugRule`
- url (ex.: link externo de uma foto ou video):
  - `RequiredRule`
  - `UrlRule`
- senha em hash (ex.: credencial de usuario do app):
  - `BcryptHashRule`
- senha em texto puro (antes do hash):
  - `RequiredRule`
  - `StrongPasswordRule`
  - `NoCommonPasswordRule`
- UUID em campo de referencia (ex.: `atletaId` em uma entidade `Mensalidade`):
  - `RequiredRule`
  - `UuidRule`
- numero inteiro (ex.: numero da camisa do Atleta):
  - `RequiredRule`
  - `IntegerRule`
- numero positivo (ex.: valor de uma mensalidade ou taxa):
  - `PositiveRule`
- numero negativo:
  - `NegativeRule`
- limite numerico (ex.: idade minima/maxima de uma categoria de Campeonato):
  - `MinValueRule`
  - `MaxValueRule`
  - `RangeValueRule`
- `Date` (ex.: data de nascimento do Atleta, data de um jogo do Campeonato):
  - `RequiredRule`
  - `DateRule`
- data passada ou futura (ex.: data de nascimento no passado, data de um jogo agendado no futuro):
  - `PastDateRule`
  - `FutureDateRule`
- arrays (ex.: lista de jogadores convocados, lista de fotos de um album):
  - `RequiredRule` quando o campo nao puder faltar
  - `MinItemsRule`
  - `MaxItemsRule`
  - `UniqueItemsRule`
- strings sem espacos ou com formato especial:
  - `NoWhitespaceRule`
  - `RegexRule`
  - `AlphaRule`
  - `AlphaNumericRule`
  - `StartsWithRule`
  - `EndsWithRule`
  - `ContainsRule`

### Convencao de codigos de erro

- Usar prefixo semanticamente estavel em minusculo.
- Seguir o padrao observado na entidade de referencia do projeto.
- Preferir `<aggregate>.<campo>` quando a entidade representar o agregado principal (ex.: `atleta.nome`, `campeonato.dataInicio`).
- Para entidades filhas, usar um prefixo claro e consistente, por exemplo `<entity>.<campo>` (ex.: `mensalidade.valor` dentro do agregado `financeiro`).
- Manter o mesmo prefixo em todos os campos da entidade.

## Criacao de nova regra compartilhada

Se nao existir regra compartilhada suficiente para um caso recorrente e generico:

1. Usar a skill `shared-validation-rule` para criar a nova regra em `src/shared/validation/rules/<rule>.rule.ts`
2. Confirmar exports em `src/shared/validation/rules/index.ts` e `src/shared/validation/index.ts`
3. Confirmar que o teste da nova regra foi criado
4. Usar a regra nova na entidade

Essa regra nova so deve existir quando o comportamento for claramente reaproveitavel por outros agregados.

## Atualizacao de barrels

Para reduzir ajuste manual posterior, manter os exports coerentes com o padrao local:

1. `src/core/domain/<aggregate>/index.ts` deve exportar a nova entidade.
2. Preservar exports existentes de outras entidades do mesmo agregado.

Nao inventar reorganizacao estrutural.

## Regras dos testes unitarios

O teste da entidade deve buscar cobertura de 100% para o arquivo da entidade.

Cobertura minima obrigatoria:

1. criacao de entidade valida
2. leitura correta de todos os getters
3. comportamento lazy, garantindo que a entidade possa existir invalida antes do `validate()`
4. sucesso de `validate()` para dados validos
5. falha de `validate()` para dados invalidos
6. mensagens ou codigos de erro esperados quando fizer sentido
7. cenarios limite das regras aplicadas
8. comportamento herdado relevante da classe base, quando fizer parte da superficie observavel
9. branches internos de `validate()`
10. fluxos de `clone`, `deletedAt`, `createdAt` e `updatedAt`, quando a entidade os expuser de forma observavel

Regras de qualidade do teste:

- seguir o estilo de `references/atleta-entity-pattern.md`
- criar helper para extrair mensagens de `ValidationException` quando isso simplificar assercoes
- evitar teste superficial que apenas instancia a classe sem verificar comportamento
- testar especialmente as combinacoes que podem deixar branch sem cobertura
- se a entidade tiver apenas getters e um `validate()` linear, ainda assim cobrir sucesso, falha e limites de cada regra importante

## Workflow recomendado

1. Validar agregado e destino.
2. Ler as referencias obrigatorias.
3. Identificar regras compartilhadas ja existentes para cada campo.
4. Decidir o prefixo dos codigos de validacao.
5. Criar ou atualizar a entidade.
6. Criar ou atualizar o teste da entidade.
7. Atualizar `src/core/domain/<aggregate>/index.ts` quando necessario.
8. Se houver nova regra compartilhada, criar a regra e o teste dela antes de validar a entidade (via `shared-validation-rule`).
9. Rodar testes com coverage mirando a entidade (Vitest/Jest, conforme o projeto).
10. Se coverage da entidade ficar abaixo de 100%, ajustar os testes e rodar novamente.

## Comandos de verificacao

Preferir executar a partir da raiz do projeto:

```bash
npm run test -- --coverage --collectCoverageFrom=src/core/domain/<aggregate>/<entity>.entity.ts src/core/domain/<aggregate>/<entity>.entity.test.ts
```

Se a implementacao criar nova regra compartilhada:

```bash
npm run test -- src/shared/validation/rules/<rule>.rule.test.ts
```

Objetivo obrigatorio:

- cobertura de 100% para a entidade criada ou alterada
- quando houver nova regra compartilhada, cobertura de 100% tambem para essa regra

## Guardrails

- Nao criar Route Handler, Server Action, schema Mongoose, seed ou adaptacoes de infraestrutura.
- Nao mudar o padrao da entidade base do projeto (`src/core/domain/entity.ts`).
- Nao colocar logica de negocio fora de `validate()` sem necessidade estrutural real.
- Nao disparar `validate()` no construtor.
- Nao ignorar `clone`, timestamps ou `deletedAt` quando eles forem relevantes para a superficie observavel.
- Nao usar regra ad hoc local se existe regra compartilhada equivalente.
- Nao parar cedo com coverage parcial; ajustar os testes ate cobrir completamente a entidade.
- Nunca usar `any`; tipar explicitamente todos os campos e generics.

## Saida esperada

- entidade criada ou atualizada em `src/core/domain/<aggregate>/<entity>.entity.ts`
- teste criado ou atualizado em `src/core/domain/<aggregate>/<entity>.entity.test.ts`
- `src/core/domain/<aggregate>/index.ts` ajustado quando necessario
- nova regra compartilhada criada apenas se realmente generica
- validacao final executada com coverage

## Few-shot

Para reproduzir o padrao estrutural rapidamente:

- ver `references/atleta-entity-pattern.md`
- ver `references/validation-inference-guide.md`
