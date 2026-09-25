---
name: shared-validation-rule
description: Cria regras de validação reutilizáveis no motor de validação compartilhado do app Planalto Futsal (src/shared/validation), seguindo o padrão existente de contratos, utilitários, códigos de erro, exports e testes unitários completos.
---

# Shared Validation Rule

Use esta skill quando o pedido for criar ou atualizar uma regra reutilizavel em `src/shared/validation/rules`.

## Objetivo

- Criar novas regras de validacao reutilizaveis dentro de `src/shared/validation`.
- Seguir exatamente o padrao estrutural, semantico e de testes ja adotado no projeto (ver `shared-kernel-scaffold`).
- Reaproveitar `src/shared/validation/rule.utils.ts` sempre que fizer sentido.
- Criar testes unitarios robustos e curtos, focados no contrato observavel da regra.
- Garantir integracao correta com os exports de `src/shared/validation`.
- Entregar uma regra simples, previsivel, reutilizavel e facil de manter, util tanto para entidades genericas quanto para campos especificos do dominio de futsal (ex.: numero de camisa do Atleta, categoria de idade, CPF/RG do associado).

## Entradas obrigatorias

So execute a implementacao quando estas entradas estiverem claras no pedido ou puderem ser inferidas com baixo risco:

1. Nome da regra a ser criada.
2. Objetivo da validacao.
3. Tipo principal do valor validado: `string`, `number`, `date`, `array` ou `mixed`.
4. Codigo de erro esperado quando a regra falhar.

## Entradas opcionais

- Parametros da regra, quando houver: minimo, maximo, lista de valores, regex, configuracoes de comportamento.
- Exemplos de valores validos e invalidos.
- Se a regra deve ignorar valores vazios ou trata-los como invalidos.

## Leitura obrigatoria

Antes de criar a regra, leia obrigatoriamente os arquivos abaixo, nesta ordem:

1. `src/shared/validation/validation-rule.interface.ts`
2. `src/shared/validation/validation-field.interface.ts`
3. `src/shared/validation/validator.ts`
4. `src/shared/validation/rule.utils.ts`
5. `src/shared/validation/index.ts`
6. `src/shared/validation/rules/index.ts`
7. Regras de referencia:
   - `src/shared/validation/rules/required.rule.ts`
   - `src/shared/validation/rules/email.rule.ts`
   - `src/shared/validation/rules/min-length.rule.ts`
   - `src/shared/validation/rules/range-length.rule.ts`
   - `src/shared/validation/rules/strong-password.rule.ts`
   - `src/shared/validation/rules/person-name.rule.ts`
8. Testes de referencia:
   - `src/shared/validation/rules/required.rule.test.ts`
   - `src/shared/validation/rules/email.rule.test.ts`
   - `src/shared/validation/rules/min-length.rule.test.ts`
   - `src/shared/validation/rules/range-length.rule.test.ts`
   - `src/shared/validation/rules/security-rules.test.ts`
   - `src/shared/validation/rules/string-rules.test.ts`

Se a nova regra exigir utilitario novo ou alterar comportamento utilitario, leia e atualize tambem:

- `src/shared/validation/rule.utils.test.ts`
- `src/shared/validation/validator.test.ts` quando a integracao com `Validator.validate(...)` precisar de cobertura adicional
- `src/shared/validation/index.ts` quando houver duvida sobre a cadeia final de exports

Consulte tambem `references/mandatory-readings.md` e os few-shots locais desta skill antes de escrever codigo novo.

## Few-shots internos

Os few-shots desta skill ficam em `references/few-shots/` e devem ser usados como referencia pratica imediata:

- `required.rule.example.ts`
- `required.rule.test.example.ts`
- `email.rule.example.ts`
- `email.rule.test.example.ts`
- `min-length.rule.example.ts`
- `min-length.rule.test.example.ts`
- `range-length.rule.example.ts`
- `range-length.rule.test.example.ts`
- `strong-password.rule.example.ts`
- `strong-password.rule.test.example.ts`

Eles existem para mostrar o padrao real de implementacao e teste sem depender de arquivos externos para o papel didatico. Os testes de exemplo importam do barrel `@/shared/validation` (alias do Next.js apontando para `src/shared/validation`).

## Fluxo deterministico

1. Normalizar o nome da regra em `kebab-case` para o arquivo e em PascalCase com sufixo `Rule` para a classe.
2. Ler todas as referencias obrigatorias do projeto.
3. Ler os few-shots internos mais proximos do caso.
4. Definir o contrato da regra:
   - implementar `ValidationRule`;
   - expor `validate(value: unknown): string | null`;
   - retornar `null` quando valido;
   - retornar apenas o sufixo do erro quando invalido;
   - nunca montar `<field.code>.<errorCode>` dentro da regra;
   - nunca lancar excecao diretamente;
   - nunca criar efeitos colaterais.
5. Decidir o comportamento para valores vazios:
   - por padrao, regras opcionais ignoram vazio e retornam `null`;
   - deixe obrigatoriedade para `RequiredRule`;
   - so trate vazio como invalido quando isso vier explicitamente do pedido e for coerente com o padrao existente.
6. Reaproveitar utilitarios existentes antes de criar logica propria:
   - `validateStringValues`
   - `validateNumberValues`
   - `validateDateValues`
   - `validateEachValue`
   - `isEmptyValue`
   - `getValueLength`
   - `toValidDate`
   - `testPattern`
7. So criar nova funcao em `rule.utils.ts` quando ela for claramente generica e reutilizavel por outras regras.
8. Implementar a regra em `src/shared/validation/rules/<rule-name>.rule.ts`.
9. Atualizar `src/shared/validation/rules/index.ts`.
10. Verificar se os exports agregados continuam acessiveis por `src/shared/validation/index.ts`, preservando exports existentes e adicionando apenas o necessario.
11. Criar ou atualizar `src/shared/validation/rules/<rule-name>.rule.test.ts`.
12. Se houver utilitario novo, criar ou atualizar os testes dele em `src/shared/validation/rule.utils.test.ts`.
13. Rodar os testes relevantes (Vitest/Jest) e complementar cobertura ate a nova regra atingir 100%, coerente com o minimo de 80% de cobertura do Core exigido pelo projeto.

## Regras de implementacao

- O arquivo da regra deve ser sempre `src/shared/validation/rules/<rule-name>.rule.ts`.
- O nome do arquivo deve ser sempre em `kebab-case`.
- O nome da classe deve ser em PascalCase com sufixo `Rule`.
- Toda regra deve implementar `ValidationRule`.
- O metodo deve seguir exatamente `validate(value: unknown): string | null`.
- A regra deve retornar apenas o sufixo do erro, por exemplo:
  - `required`
  - `invalid.email`
  - `min.length`
  - `range.length`
  - `strong.password`
  - `person.name`
- O `Validator` e quem monta o erro completo no formato `<field.code>.<errorCode>`.
- Nao duplicar logica ja existente em `rule.utils.ts`.
- Manter a implementacao curta, previsivel e legivel, sem `any`.
- Quando a regra aceitar parametros, recebe-los por construtor, no mesmo estilo das regras existentes.
- Quando a regra validar colecoes ou multiplos valores, seguir o estilo das regras atuais baseadas em `validateEachValue` e derivados.

## Regras para os testes

- O teste da regra deve viver em `src/shared/validation/rules/<rule-name>.rule.test.ts`.
- Seguir o estilo do projeto:
  - imports a partir do barrel `@/shared/validation` (ou relativo `../index` dentro da propria pasta `rules/`);
  - `describe("<ClassName>Rule", ...)`;
  - testes curtos, claros e orientados ao contrato;
  - evitar indirecao desnecessaria.
- Cobrir, no minimo:
  - cenario valido;
  - cenario invalido;
  - comportamento com valores vazios, quando aplicavel;
  - comportamento com tipos invalidos, quando aplicavel;
  - comportamento dos parametros, quando existirem;
  - cenarios limite relevantes.
- Se a regra reutilizar utilitario com branches relevantes, testar o comportamento observavel da regra sem duplicar teste do utilitario alem do necessario.
- Se houver nova funcao utilitaria, criar testes diretos para ela em `src/shared/validation/rule.utils.test.ts`.
- Se o usuario fornecer exemplos de valores validos e invalidos, reproduzir esses exemplos nos testes sempre que fizer sentido.
- A cobertura esperada para a nova regra e 100%.

## Saida esperada

Ao concluir uma implementacao baseada nesta skill, o resultado minimo deve incluir:

- `src/shared/validation/rules/<rule-name>.rule.ts`
- atualizacao de `src/shared/validation/rules/index.ts`
- teste em `src/shared/validation/rules/<rule-name>.rule.test.ts`
- atualizacoes adicionais em exports agregados apenas se realmente necessarias

## Restricoes

- Esta skill nao cria entidades, casos de uso ou route handlers.
- Esta skill existe apenas para criar regras reutilizaveis no motor de validacao compartilhado.
- Nao inventar um padrao novo se o projeto ja possui um (ver `shared-kernel-scaffold`).
- Nao criar documentacao extra fora desta pasta de skill.
- Nao pular a leitura das referencias obrigatorias.
- Nao alterar regras, exports ou testes nao relacionados alem do necessario para integrar a nova regra.
