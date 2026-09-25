# Validation Inference Guide

Use este guia junto com as regras reais em `src/shared/validation/rules/`.

## Processo de escolha

1. Identifique a semantica do campo pelo nome.
2. Cruze com o tipo TypeScript.
3. Procure primeiro uma regra compartilhada existente.
4. Combine regras simples em vez de criar regra nova cedo demais.
5. So crie uma nova regra compartilhada (via skill `shared-validation-rule`) quando a necessidade for generica e recorrente.

## Mapeamentos comuns

- `nome`, `nomeCompleto`, `nomeResponsavel`
  - `RequiredRule`
  - `MinLengthRule`
  - `MaxLengthRule`
  - `PersonNameRule`
- `email`
  - `RequiredRule`
  - `EmailRule`
- `senhaHash`, `passwordHash`
  - `BcryptHashRule`
- `senha`, `password`
  - `RequiredRule`
  - `StrongPasswordRule`
  - `NoCommonPasswordRule`
- `slug` (ex.: slug de noticia ou album de fotos)
  - `RequiredRule`
  - `SlugRule`
- `url`, `linkExterno` (ex.: video de um lance, link de uma foto)
  - `RequiredRule`
  - `UrlRule`
- `telefone`, `whatsapp`
  - `RequiredRule`
  - `PhoneBrRule`
- `cpf`, `rg`, `cep`
  - usar a regra especifica existente (`CpfRule`, `RgRule`, `CepRule`)
- `id`, `atletaId`, `campeonatoId`, `usuarioId`
  - `RequiredRule`
  - `UuidRule`
- `numeroCamisa`, `quantidadeJogos`, `parcelas`
  - `RequiredRule`
  - `IntegerRule`
  - `PositiveRule`
- `valorMensalidade`, `valorTaxa`, `valorTotal`
  - `RequiredRule`
  - `PositiveRule`
  - `PrecisionRule` quando houver escala monetaria definida
- `dataNascimento`
  - `RequiredRule`
  - `DateRule`
  - `PastDateRule`
- `dataJogo`, `dataInscricaoAte`, `expiresAt`
  - `RequiredRule`
  - `DateRule`
  - `FutureDateRule` quando o evento precisar estar no futuro no momento do cadastro
- arrays como `jogadoresConvocados`, `fotos`, `tags`
  - `RequiredRule` se nao puder faltar
  - `MinItemsRule`
  - `MaxItemsRule`
  - `UniqueItemsRule`

## Sinais de que vale criar regra compartilhada nova

- a validacao nao depende da entidade atual
- o nome da regra faz sentido em qualquer agregado do projeto
- a regra pode ser testada isoladamente em `src/shared/validation`
- a regra representa formato, faixa, combinacao ou politica generica

## Sinais de que nao vale criar regra compartilhada nova

- a regra menciona contexto exclusivo de um agregado (ex.: "numero de camisa unico dentro do time" e uma regra de negocio do caso de uso/repositorio, nao uma `ValidationRule` generica)
- o erro faria sentido apenas para uma entidade
- a necessidade pode ser atendida combinando regras existentes
