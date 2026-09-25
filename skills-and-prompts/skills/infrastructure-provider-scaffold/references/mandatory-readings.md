# Mandatory Readings

Leia estes arquivos exatamente nesta ordem antes de implementar o provider:

1. o arquivo alvo em `src/core/domain/<aggregate>/*.provider.ts` (o contrato/porta tecnica a implementar)
2. os tipos relacionados importados pelo provider alvo
3. um exemplo real ja existente no projeto, se houver (ex.: `src/infrastructure/security/bcrypt-crypto.provider.ts`)
4. o ponto de uso (Route Handler, Server Action ou factory de caso de uso) que vai consumir a implementacao concreta

Extraia dessas leituras:

- o contrato exato que precisa ser cumprido
- a convencao local de naming dos arquivos concretos de infraestrutura
- como o projeto monta (compoe) o caso de uso com a implementacao concreta, ja que nao ha container de DI
- se ja existe biblioteca instalada que resolve o problema

Antes de editar, confirme tambem:

- se a interface alvo esta inequivoca
- se `src/infrastructure/security/` (ou a subpasta de infraestrutura equivalente para o tipo de provider) ja existe
- se existe um Route Handler, Server Action ou factory que precisara trocar a abstracao por classe concreta

Se qualquer leitura obrigatoria falhar, pare e relate claramente o bloqueio.
