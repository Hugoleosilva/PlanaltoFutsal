# Provider Implementation Checklist

## Nome e destino

- inferir a categoria de infraestrutura pelo tipo de provider (criptografia/JWT/sessao -> `src/infrastructure/security/`; auditoria -> `src/infrastructure/audit/`; outras integracoes tecnicas -> `src/infrastructure/<categoria>/`)
- escolher nome de arquivo coerente com a responsabilidade tecnica
- escolher nome de classe concreto e explicito

Exemplos de naming:

- `bcrypt-crypto.provider.ts` -> `BcryptCryptoProvider`
- `jwt-token.provider.ts` -> `JwtTokenProvider`
- `system-clock.provider.ts` -> `SystemClockProvider`
- `node-uuid.provider.ts` -> `NodeUuidProvider`

## Estrategia de biblioteca

Ordem de preferencia:

1. biblioteca ja instalada que encaixa bem no contrato
2. runtime do Node quando ele resolver o contrato com seguranca
3. biblioteca madura, simples e estavel

Sugestoes por intencao:

- senha e hash: `bcrypt` quando o contrato for de criptografia de senha
- JWT/sessao: preferir o proprio NextAuth.js/Auth.js (`next-auth`) quando o provider for parte do fluxo de autenticacao; usar `jsonwebtoken` apenas para necessidades pontuais fora do fluxo de sessao do NextAuth
- e-mail: `nodemailer` para envio SMTP simples
- uuid: `randomUUID` de `node:crypto` antes de adicionar dependencia
- clock: `new Date()` ou `Date.now()` encapsulados em provider simples

## Integracao (sem container de DI)

- nao ha NestJS neste projeto, portanto nao ha `@Injectable()` nem `providers: []` de modulo
- a classe concreta e exportada normalmente e instanciada onde for consumida: dentro de uma factory de caso de uso (ver `usuario-usecase-factory.example.ts`), dentro do proprio Route Handler/Server Action, ou por uma factory compartilhada em `src/infrastructure/security/`
- preferir uma factory simples (`makeRegistrarUsuario()`, por exemplo) quando o mesmo caso de uso for montado em mais de um lugar (Route Handler e Server Action, por exemplo), para nao duplicar a instanciacao

## Testes

Criar testes quando houver pelo menos um destes sinais:

- logica observavel alem de mero passthrough
- configuracao propria da implementacao
- normalizacao, fallback ou transformacao de dados
- risco real de regressao no contrato

Se a biblioteca externa fizer o trabalho quase inteiro, teste o contrato exposto pela classe e documente os limites de cobertura.

## O que evitar

- editar o contrato do dominio (`src/core/domain/<aggregate>/*.provider.ts`)
- criar tokens, symbols, containers de DI ou wrappers sem necessidade — este projeto nao usa NestJS
- adicionar metodos publicos fora do contrato
- empurrar regra de negocio para infraestrutura
- instalar dependencia nova quando a atual ja resolve
- espalhar a implementacao por varios arquivos sem necessidade
- reimplementar sessao/JWT manualmente quando o NextAuth.js ja cobre o caso
