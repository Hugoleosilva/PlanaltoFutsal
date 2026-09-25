---
name: domain-use-case-scaffold
description: Cria casos de uso padronizados para agregados do Planalto Futsal (Atleta, Campeonato, Financeiro, Usuario/RBAC, etc.) dentro de src/core/use-cases, com contratos de entrada e saída consistentes, implementação inicial simples, testes unitários completos e estrutura pronta para evolução pelo time.
---

# Domain Use Case Scaffold

Use esta skill quando o pedido for criar ou atualizar um caso de uso dentro de um agregado existente em `src/core/use-cases/<aggregate>/`, preservando o padrao estrutural do projeto, criando os testes unitarios correspondentes e garantindo cobertura de 100% para o arquivo do caso de uso.

Esta skill nao cria Route Handler, Server Action, schema Mongoose ou qualquer integracao de infraestrutura. O foco aqui e somente:

- contrato de entrada e saida;
- orquestracao basica de dominio;
- dependencias explicitas do caso de uso (repositorios e providers tecnicos, recebidos por construtor);
- testes reais com fakes concretas;
- exports corretos;
- coverage de 100% para o caso de uso criado ou atualizado.

## Entradas obrigatorias

A skill so pode prosseguir quando estas informacoes estiverem claras:

1. `nome do agregado` (ex.: `atleta`, `campeonato`, `financeiro`, `usuario`).
2. `nome do caso de uso`.
3. `tipo de cenario`:
   - `crud`
   - `custom`
4. se o caso de uso `retorna saida` ou `nao retorna saida`.

## Entradas opcionais

- dependencias esperadas, como repositorios, providers tecnicos ou outros contratos;
- campos da entrada;
- campos da saida, quando houver retorno;
- regras explicitas de comportamento;
- path explicito do destino final, quando o usuario quiser fugir do modo por convencao.

## Se faltar informacao

Se qualquer uma destas informacoes estiver vaga, pare e peca objetivamente apenas o que falta:

- agregado;
- nome do caso de uso;
- `crud` ou `custom`;
- se o caso de uso retorna saida relevante ou usa `void`.

Nao invente esses dados. Nao prossiga sem eles.

## Leituras obrigatorias

Antes de gerar qualquer codigo, leia obrigatoriamente os arquivos listados em `references/mandatory-readings.md`, alem de:

- `src/core/use-cases/use-case.ts`
- `src/core/use-cases/<aggregate>/index.ts`, se existir
- `src/core/domain/<aggregate>/index.ts` (entidade e contrato de repositorio do agregado)

Os few-shots existem para reforcar o padrao de estrutura, nomes, dependencia por construtor e testes com fakes concretas.

## Resolucao do destino

Esta skill aceita dois modos de resolucao:

### 1. Modo por convencao

Quando o usuario informar o agregado por nome, use:

- caso de uso:
  - `src/core/use-cases/<aggregate>/<use-case>.usecase.ts`
- teste:
  - `src/core/use-cases/<aggregate>/<use-case>.usecase.test.ts` (colocado ao lado, mesma pasta)

### 2. Modo por path explicito

Quando o usuario informar um path, normalize para o destino real dentro de `src/core/use-cases/<aggregate>/`.

Se houver ambiguidade real entre dois destinos validos, pare e peca confirmacao objetiva.

## Convencoes obrigatorias

- Nome de arquivo sempre em `kebab-case`.
- Arquivo principal sempre com sufixo `.usecase.ts`.
- Arquivo de teste sempre com sufixo `.usecase.test.ts`.
- Nome da classe sempre em `PascalCase`.
- A classe nunca deve terminar com `UseCase`.
- Interface de entrada sempre com sufixo `In`.
- Interface de saida, quando existir, sempre com sufixo `Out`.

Exemplo:

- arquivo: `registrar-usuario.usecase.ts`
- classe: `RegistrarUsuario`
- entrada: `RegistrarUsuarioIn`
- saida: nao existe (void) neste exemplo especifico

## Fluxo deterministico

1. Validar que `src/core/domain/<aggregate>` e `src/core/use-cases/<aggregate>` existem (senao, rodar `domain-aggregate-scaffold` antes).
2. Confirmar que o agregado existe antes de seguir.
3. Ler o `index.ts` de `src/core/use-cases/<aggregate>/`, se existir.
4. Ler tambem o que for relevante para o caso concreto:
   - `src/core/domain/<aggregate>/index.ts` (entidade e repositorio);
   - contratos de provider tecnico usados pelo caso de uso (ex.: `CryptoProvider`, ver `infrastructure-provider-scaffold`);
   - fakes ja existentes (`*.repository.fake.ts`, `*.provider.fake.ts`).
5. Procurar primeiro por fakes concretas reutilizaveis no proprio agregado.
6. Criar ou atualizar o caso de uso.
7. Criar ou atualizar o teste.
8. Atualizar `src/core/use-cases/<aggregate>/index.ts` sem remover exports existentes.
9. Rodar os testes relevantes e verificar cobertura.
10. Se a cobertura do caso de uso nao for 100%, complementar os testes antes de encerrar.

## Estrutura obrigatoria do caso de uso

O arquivo deve seguir o padrao do projeto:

1. importar `UseCase` de `../../use-case` (relativo, dentro de `src/core/use-cases`);
2. declarar `export interface <CaseName>In`;
3. declarar `export interface <CaseName>Out` apenas quando houver retorno relevante;
4. declarar `export class <CaseName> implements UseCase<<CaseName>In, <OutOuVoid>>`;
5. receber dependencias pelo construtor;
6. expor `async execute(input: <CaseName>In): Promise<<OutOuVoid>>`.

Regras:

- quando nao houver saida relevante, use `void` e omita a interface `Out`;
- quando houver saida relevante, crie a interface `Out` local e retorne esse contrato;
- mantenha a implementacao simples, legivel e facil de evoluir;
- nao invente regra de negocio nao pedida;
- nao acople o caso de uso a Route Handler, Server Action, Mongoose ou HTTP;
- foque no contrato e na orquestracao basica de dominio;
- nunca usar `any`.

## Regras por tipo de cenario

### `crud`

Para `crud`, siga uma implementacao minima e previsivel, compativel com casos como:

- criar;
- atualizar;
- excluir;
- buscar por id;
- buscar pagina.

Nesses cenarios:

- prefira dependencias simples, normalmente repositorios;
- reutilize tipos e contratos ja existentes do agregado (importados de `../../domain/<aggregate>`);
- mantenha fluxo direto, sem condicoes extras desnecessarias;
- so adicione validacao extra quando o pedido trouxer essa necessidade explicitamente ou quando o padrao do agregado ja exigir.

### `custom`

Para `custom`:

- monte o caso de uso com base no que o usuario descreveu;
- continue com implementacao inicial simples e pouco opinativa;
- quando houver lacunas, prefira contratos minimos e placeholders uteis em vez de inventar comportamento detalhado;
- trate dependencias externas (repositorios, providers tecnicos) como contratos injetados pelo construtor;
- exemplos tipicos no dominio do Planalto Futsal: `RegistrarUsuario` (com `CryptoProvider`), `MatricularAtletaNoCampeonato`, `RegistrarPagamentoMensalidade`, `PublicarFotoNoAlbum`.

## Regras para dependencias

- Procure primeiro contratos e tipos ja existentes no agregado (`src/core/domain/<aggregate>/index.ts`).
- Reutilize repositorios, providers e entidades ja exportados.
- Nao introduza dependencia nova sem necessidade.
- Se o pedido citar dependencias esperadas, respeite isso.
- Se o caso de uso so orquestra uma chamada simples, nao crie camadas extras.

## Regras dos testes unitarios

O teste do caso de uso e obrigatorio.

Destino: `src/core/use-cases/<aggregate>/<use-case>.usecase.test.ts` (mesma pasta do caso de uso).

Cobertura minima obrigatoria do teste:

1. caminho feliz;
2. falhas de validacao, quando existirem;
3. dependencias chamadas ou nao chamadas conforme o fluxo;
4. todos os branches e condicionais existentes;
5. retorno esperado, quando houver saida;
6. comportamento quando erro e propagado ou tratado;
7. ausencia de efeitos colaterais quando o fluxo falhar antes do ponto critico.

Regras de qualidade:

- use implementacoes fake reais e concretas, nao mocks de framework como estrategia principal;
- priorize fakes existentes do agregado antes de criar novas;
- se existir fake adequada, reutilize-a e nao duplique;
- se nao existir fake adequada para uma dependencia essencial, crie uma fake simples e reutilizavel ao lado do contrato correspondente (`*.repository.fake.ts` em `src/core/domain/<aggregate>/`, ou `*.provider.fake.ts` junto do provider);
- use spies apenas como apoio pontual sobre classes concretas ou prototipos, como no exemplo de `Usuario.prototype.validate`;
- escreva testes reais e uteis, nao superficiais.

## Reuso de fakes

Antes de criar uma fake nova, procure por:

- `src/core/domain/<aggregate>/<aggregate>.repository.fake.ts`
- outras fakes de provider no mesmo agregado
- exports existentes em `src/core/domain/<aggregate>/index.ts`

Se uma fake cobrir a dependencia, reutilize a classe existente e adapte o teste ao contrato dela, evitando duplicacao com outro nome.

Se uma fake nao existir e for essencial, crie uma classe concreta simples, com armazenamento em memoria ou comportamento previsivel, evitando `jest.fn()`/`vi.fn()` como estrutura principal da fake.

## Exports e integracao

Ao concluir, garanta pelo menos:

- criacao ou atualizacao de `src/core/use-cases/<aggregate>/<use-case>.usecase.ts`
- criacao ou atualizacao de `src/core/use-cases/<aggregate>/index.ts`

Preserve todos os exports existentes.

## Verificacao obrigatoria

Rode a verificacao a partir da raiz do projeto:

```bash
npm run test -- --runTestsByPath "src/core/use-cases/<aggregate>/<use-case>.usecase.test.ts"
npm run test -- --coverage --collectCoverageFrom="src/core/use-cases/<aggregate>/<use-case>.usecase.ts" --runTestsByPath "src/core/use-cases/<aggregate>/<use-case>.usecase.test.ts"
```

Nao encerre a tarefa enquanto:

- o caso de uso nao compilar;
- o teste nao existir;
- os exports nao estiverem corretos;
- a cobertura observavel do caso de uso nao atingir 100%.

## Entrega minima esperada

- o arquivo do caso de uso;
- o teste unitario correspondente;
- o `index.ts` de `src/core/use-cases/<aggregate>/` atualizado;
- fake nova criada e exportada, se necessario;
- validacao real dos testes e da cobertura.

## Restricoes

- Nao criar Route Handler ou Server Action.
- Nao criar schema ou repositorio Mongoose.
- Nao adicionar complexidade desnecessaria.
- Nao inventar regras de negocio nao pedidas.
- Nao pular a leitura obrigatoria.
- Nao alterar arquivos fora do agregado alvo e da propria skill alem do estritamente necessario para integrar o caso de uso.
- Nunca usar `any`.
