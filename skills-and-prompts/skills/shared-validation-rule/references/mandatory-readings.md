# Leituras Obrigatorias

Leia estes arquivos do projeto antes de criar uma nova regra:

1. `src/shared/validation/validation-rule.interface.ts`
2. `src/shared/validation/validation-field.interface.ts`
3. `src/shared/validation/validator.ts`
4. `src/shared/validation/rule.utils.ts`
5. `src/shared/validation/index.ts`
6. `src/shared/validation/rules/index.ts`
7. `src/shared/validation/rules/required.rule.ts`
8. `src/shared/validation/rules/email.rule.ts`
9. `src/shared/validation/rules/min-length.rule.ts`
10. `src/shared/validation/rules/range-length.rule.ts`
11. `src/shared/validation/rules/strong-password.rule.ts`
12. `src/shared/validation/rules/person-name.rule.ts`
13. `src/shared/validation/rules/required.rule.test.ts`
14. `src/shared/validation/rules/email.rule.test.ts`
15. `src/shared/validation/rules/min-length.rule.test.ts`
16. `src/shared/validation/rules/range-length.rule.test.ts`
17. `src/shared/validation/rules/security-rules.test.ts`
18. `src/shared/validation/rules/string-rules.test.ts`

Objetivo de cada bloco:

- Interfaces e `Validator`: confirmar o contrato publico e o formato final do erro.
- `rule.utils.ts`: identificar helpers reaproveitaveis e evitar duplicacao.
- `rules/index.ts` e `validation/index.ts`: manter exports consistentes.
- Regras de referencia: replicar o estilo de construtor, validacao, erro e tratamento de vazio.
- Testes de referencia: replicar o estilo do projeto e fechar cobertura observavel.

Se a implementacao exigir novo helper em `rule.utils.ts`, leia e atualize tambem:

- `src/shared/validation/rule.utils.test.ts`

Se precisar comprovar a integracao com o montador de erros:

- `src/shared/validation/validator.test.ts`
- `src/shared/validation/index.ts` para confirmar a cadeia final de exports
- `src/infrastructure/errors/index.ts` para confirmar `ValidationException` e `ValidationError`, que o `Validator` consome via `@/infrastructure/errors`
