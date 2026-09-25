Crie uma skill chamada `shared-validation-rule` dentro de `skills-and-prompts/skills/shared-validation-rule` para criar regras de validacao reutilizaveis dentro de `src/shared/validation/rules`, seguindo exatamente o padrao estrutural, semantico e de testes ja adotado pelo kernel compartilhado (`shared-kernel-scaffold`).

No `SKILL.md`, defina:

- `name`: `shared-validation-rule`
- `description`: `Cria regras de validação reutilizáveis no motor de validação compartilhado do app Planalto Futsal (src/shared/validation), seguindo o padrão existente de contratos, utilitários, códigos de erro, exports e testes unitários completos.`

Objetivo da skill:

- Criar novas regras de validacao reutilizaveis dentro de `src/shared/validation`.
- Reaproveitar `src/shared/validation/rule.utils.ts` sempre que fizer sentido.
- Criar testes unitarios robustos para a nova regra, com cobertura de 100%.
- Garantir integracao correta com os exports de `src/shared/validation`.
- Produzir uma regra simples, previsivel, reutilizavel e facil de manter, util tanto para campos genericos quanto para campos especificos do dominio de futsal (numero de camisa, CPF/RG de associado, categoria de idade, etc.).

Referencias obrigatorias que a skill deve ler antes de criar a nova regra:

1. `src/shared/validation/validation-rule.interface.ts`
2. `src/shared/validation/validation-field.interface.ts`
3. `src/shared/validation/validator.ts`
4. `src/shared/validation/rule.utils.ts`
5. `src/shared/validation/index.ts`
6. `src/shared/validation/rules/index.ts`
7. Regras de referencia, no minimo: `required.rule.ts`, `email.rule.ts`, `min-length.rule.ts`, `range-length.rule.ts`, `strong-password.rule.ts`, `person-name.rule.ts`
8. Testes de referencia, no minimo: `required.rule.test.ts`, `email.rule.test.ts`, `min-length.rule.test.ts`, `range-length.rule.test.ts`, `security-rules.test.ts`, `string-rules.test.ts`

Entradas obrigatorias da skill:

1. O nome da regra que deve ser criada.
2. O objetivo da validacao.
3. O tipo principal de valor que a regra deve validar: `string`, `number`, `date`, `array` ou `mixed`.
4. O codigo de erro esperado que a regra deve retornar quando falhar.

Entradas opcionais: parametros da regra (minimo, maximo, lista de valores, regex, configuracao de comportamento), exemplos de valores validos/invalidos, e se a regra deve ignorar valores vazios ou trata-los como invalidos.

Regras da implementacao:

1. A regra fica em `src/shared/validation/rules/<rule-name>.rule.ts`, nome em `kebab-case`.
2. O nome da classe deve ser PascalCase com sufixo `Rule` (ex.: `EmailRule`, `NumeroCamisaRule`).
3. Toda regra implementa `ValidationRule`: `validate(value: unknown): string | null`.
4. O retorno e `null` quando valido, ou apenas o sufixo do erro quando invalido (o `Validator` monta `<field.code>.<errorCode>` — a regra nunca monta isso sozinha).
5. Nao lancar excecao diretamente dentro da regra. Nao criar efeitos colaterais.
6. Priorizar reaproveitamento de `validateStringValues`, `validateNumberValues`, `validateDateValues`, `validateEachValue`, `isEmptyValue`, `getValueLength`, `toValidDate`, `testPattern`.
7. So criar nova funcao em `rule.utils.ts` quando ela for claramente generica e reutilizavel por outras regras.
8. Regras opcionais ignoram valores vazios por padrao e retornam `null`; obrigatoriedade fica sempre a cargo de `RequiredRule`.
9. Parametros da regra entram por construtor, no mesmo estilo das regras existentes.

Regras de integracao:

1. Atualizar `src/shared/validation/rules/index.ts`.
2. Garantir que a regra continue acessivel por `src/shared/validation/index.ts`.
3. Preservar exports existentes.

Regras para os testes:

1. Teste em `src/shared/validation/rules/<rule-name>.rule.test.ts`, importando do barrel `@/shared/validation` (alias do Next.js) ou de `../index` quando estiver dentro da propria pasta `rules/`.
2. Cobertura minima: cenario valido, cenario invalido, valores vazios (quando aplicavel), tipos invalidos (quando aplicavel), parametros (quando existirem), cenarios limite.
3. Cobertura esperada da nova regra: 100%.

Few-shots obrigatorios dentro da propria skill, em `references/few-shots/`, mostrando: uma regra sem parametros (`RequiredRule`), uma regra de string (`EmailRule`), uma regra com parametro simples (`MinLengthRule`), uma regra com dois parametros (`RangeLengthRule`) e uma regra parametrizada que reutiliza helper generico (`StrongPasswordRule`). Os testes de exemplo devem importar de `@/shared/validation`, nunca de um caminho de pacote npm (`@escopo/shared`), ja que este projeto nao publica pacotes internos.

Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- A skill nao cria entidades, casos de uso ou Route Handlers/Server Actions.
- A skill existe apenas para criar regras reutilizaveis no motor de validacao compartilhado.
- A cobertura esperada para a nova regra deve ser 100%.
