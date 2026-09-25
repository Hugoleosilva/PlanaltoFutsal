---
name: infrastructure-provider-scaffold
description: Implementa em src/infrastructure os providers técnicos definidos como contratos no domínio do Planalto Futsal (criptografia de senha, JWT/sessão, e-mail, geração de id, relógio, etc.), criando classes concretas simples em TypeScript puro, sem container de DI, prontas para serem injetadas manualmente em Route Handlers, Server Actions ou casos de uso.
---

# Infrastructure Provider Scaffold

Use esta skill quando o pedido for implementar, em `src/infrastructure/`, uma interface de provider tecnico definida no dominio em `src/core/domain/<aggregate>/*.provider.ts`.

Este projeto e um unico app Next.js e **nao usa NestJS** (nem container de DI equivalente). O foco desta skill e criar uma classe concreta simples, direta e facil de manter em `src/infrastructure/`, sem inventar tokens, symbols, wrappers, factories genericas ou camadas extras desnecessarias. A "injecao" acontece por composicao manual: quem monta o caso de uso (uma factory, um Route Handler ou uma Server Action) instancia a classe concreta e a passa pelo construtor.

## Objetivo

- criar a implementacao concreta de um provider tecnico definido no dominio
- manter a interface original do dominio intacta
- colocar a implementacao na subpasta correta de `src/infrastructure/` (`security/`, `audit/`, ou outra categoria tecnica coerente)
- permitir uso por instanciacao direta, sem container de DI
- instalar dependencias externas quando a implementacao realmente precisar
- evitar arquitetura excessiva para resolver um provider tecnico simples

## Entradas obrigatorias

Esta skill so pode prosseguir quando o provider alvo estiver claramente identificado por um dos modos abaixo:

1. path explicito do arquivo da interface, como `src/core/domain/usuario/crypto.provider.ts`
2. nome inequivoco da interface, como `CryptoProvider`, apenas quando houver um unico alvo claro no projeto

Informacoes adicionais obrigatorias apenas quando nao puderem ser inferidas com seguranca:

3. categoria de infraestrutura (`security`, `audit`, outra), quando o path nao bastar para inferir a subpasta correta de `src/infrastructure/`
4. tipo do provider ou intencao da implementacao, quando isso for necessario para escolher biblioteca, estrategia ou naming

## Entradas opcionais

- biblioteca preferida para a implementacao
- restricoes como:
  - evitar dependencias extras
  - reutilizar biblioteca ja instalada
  - usar abordagem sincrona ou assincrona
  - compatibilidade com API externa especifica

## Trava obrigatoria

- Esta skill so pode executar quando a interface de provider alvo estiver claramente identificada.
- Se houver ambiguidade sobre qual interface implementar, parar e pedir ao usuario o provider exato.
- Nao modificar, reescrever ou expandir a interface original do dominio.
- Tratar qualquer interface em `src/core/domain/<aggregate>/*.provider.ts` como contrato imutavel.
- Se o contrato nao der informacao suficiente para escolher uma estrategia segura, pedir esclarecimento em vez de inventar comportamento arriscado.

## Leituras obrigatorias

Antes de editar qualquer arquivo, leia obrigatoriamente:

1. a interface alvo dentro de `src/core/domain/<aggregate>/*.provider.ts`
2. os tipos relacionados exigidos por essa interface
3. um exemplo real ja existente no projeto, se houver (ex.: `src/infrastructure/security/bcrypt-crypto.provider.ts`)
4. o ponto de uso (Route Handler, Server Action ou factory de caso de uso), quando isso ajudar a entender como a implementacao sera consumida

Depois disso, leia tambem os materiais internos desta skill:

- `references/mandatory-readings.md`
- `references/provider-implementation-checklist.md`
- `references/few-shots/bcrypt-crypto.provider.example.ts`
- `references/few-shots/uuid.provider.example.ts`
- `references/few-shots/usuario-usecase-factory.example.ts`

Se alguma leitura obrigatoria falhar, pare e relate o bloqueio com clareza.

## Escopo

- ler a interface alvo e os tipos relacionados
- inferir a categoria de infraestrutura pelo tipo de provider
- criar a implementacao concreta em `src/infrastructure/<categoria>/`
- instalar dependencias externas quando necessario
- criar ou atualizar a factory de composicao (quando o projeto ja usar esse padrao) ou o ponto de uso direto, apenas no minimo necessario para permitir a instanciacao

## Fora de escopo

- modificar o contrato do provider no dominio
- criar tokens simbolicos, containers de DI ou decorators de framework (nao ha NestJS aqui)
- criar adapters, wrappers ou camadas extras sem ganho pratico
- refatorar o dominio so para acomodar a implementacao de infraestrutura
- espalhar abstracoes novas quando a classe concreta basta

## Convencoes obrigatorias

- Criar a implementacao em `src/infrastructure/<categoria>/<nome-tecnico>.provider.ts`.
- O nome do arquivo deve refletir a responsabilidade tecnica do provider.
- O nome da classe deve ser explicito e orientado a implementacao concreta.
  - Exemplo: `BcryptCryptoProvider`
- A implementacao deve cumprir exatamente o contrato da interface original.
- Nao adicionar metodos publicos extras fora do contrato, salvo helpers privados estritamente necessarios.
- Sem `@Injectable()`, sem decorators de framework: classe TypeScript simples.
- Nunca usar `any`.

## Workflow deterministico

1. Validar a entrada.
   - Confirmar que existe exatamente uma interface alvo.
   - Confirmar que o arquivo pertence a `src/core/domain/<aggregate>/`.
   - Se houver ambiguidade, interromper.
2. Ler o contrato e o contexto minimo.
   - Abrir a interface alvo.
   - Ler tipos, DTOs, enums e retornos usados pelo contrato.
   - Ler o ponto de uso quando isso ajudar a entender como a classe sera consumida.
3. Ler o exemplo real do projeto.
   - Usar `CryptoProvider` + `BcryptCryptoProvider` como referencia base, quando ja existirem.
4. Inferir destino e naming.
   - Inferir a categoria de infraestrutura (`security`, `audit`, outra) pelo tipo de provider.
   - Criar o arquivo em `src/infrastructure/<categoria>/` por padrao.
   - Escolher nome de classe concreto e previsivel.
5. Escolher a estrategia de implementacao.
   - Reutilizar bibliotecas ja instaladas quando cobrirem o contrato.
   - Se mais de uma biblioteca for razoavel e o usuario nao tiver preferencia, escolher a opcao mais simples e estavel.
   - Se a escolha ainda for arriscada, parar e pedir confirmacao.
6. Implementar a classe concreta.
   - Criar uma classe TypeScript simples.
   - Implementar exatamente os metodos da interface.
   - Manter a logica tecnica concentrada no proprio arquivo.
   - Usar helpers privados apenas quando isso melhorar clareza ou reduzir repeticao real.
7. Conectar ao ponto de uso.
   - Se o projeto ja usar uma factory de composicao (ex.: `makeRegistrarUsuario()`), atualiza-la para instanciar a nova implementacao.
   - Se nao houver factory ainda, instanciar a classe concreta diretamente no Route Handler ou Server Action que consome o caso de uso.
   - Nao alterar o contrato do dominio.
8. Instalar dependencias externas quando necessario.
   - Exemplos:
     - `npm install bcrypt` (mais `npm install -D @types/bcrypt`)
     - `npm install nodemailer` (mais `npm install -D @types/nodemailer`)
9. Testar e verificar.
   - Criar testes quando houver logica observavel relevante.
   - Seguir o padrao de testes do projeto (Vitest/Jest).
   - Rodar ao menos o build do projeto e os testes relevantes quando possivel.
10. Reportar resultado.
   - Informar interface implementada, arquivos criados ou alterados e dependencias adicionadas.

## Regras de implementacao

- Priorizar implementacao simples, direta e facil de manter.
- A classe concreta deve ficar em `src/infrastructure/<categoria>/`.
- Nao exigir symbol, token ou container de DI para a implementacao funcionar.
- Nao adicionar comportamento fora do contrato, exceto detalhes tecnicos inevitaveis da biblioteca usada.
- Nao mover regra de negocio para dentro do provider tecnico.
- Se houver configuracao tecnica pequena e estavel, mantela no proprio arquivo com constantes locais claras.
- Se o provider precisar de configuracao sensivel ou variavel, ler de `process.env` (variaveis de ambiente do Next.js), sem reinventar infraestrutura de configuracao.

## Regras para dependencias externas

- Identificar se a implementacao exige biblioteca externa.
- Reaproveitar primeiro o que ja estiver instalado no projeto.
- Quando precisar instalar algo novo, preferir bibliotecas maduras, simples e compativeis com Next.js (Edge Runtime x Node.js Runtime: verificar se o provider sera usado em rota que roda em Edge, e nesse caso evitar bibliotecas Node-only como `bcrypt`).
- Se houver varias opcoes razoaveis e nenhuma preferencia do usuario, escolher a opcao mais simples e estavel.
- Relatar claramente quais dependencias foram adicionadas e por que.

## Regras de adaptacao ao contexto

Esta skill deve se adaptar a providers tecnicos como:

- criptografia de senha (para o fluxo de autenticacao de `Usuario`, complementando o NextAuth.js/Auth.js quando necessario)
- geracao/validacao de token fora do fluxo padrao do NextAuth
- e-mail (ex.: notificacao de mensalidade em atraso, confirmacao de inscricao em campeonato)
- geracao de id/uuid
- relogio e data
- storage de arquivos (ex.: upload de fotos de jogos para um bucket)
- integracoes externas simples

Quando a interface nao trouxer contexto suficiente para definir o comportamento com seguranca, parar e pedir esclarecimento.

## Regras de testes

- Quando a implementacao tiver logica observavel relevante, criar testes.
- Quando a implementacao depender muito de biblioteca externa, criar ao menos testes uteis para o comportamento esperado e relatar limites de cobertura.
- Seguir o padrao de testes do projeto, quando ele existir.
- Preferir testes pequenos e diretos, focados no contrato implementado.

## Guardrails

- Nao executar sem alvo inequivoco.
- Nao editar o provider do dominio.
- Nao expandir interfaces do dominio.
- Nao criar tokens, symbols ou containers de DI desnecessarios — nao ha NestJS neste projeto.
- Nao instalar bibliotecas sem necessidade real.
- Nao ajustar consumidores alem do necessario para a instanciacao funcionar.
- Nao inventar comportamento quando o contrato estiver incompleto.
- Nunca usar `any`.

## Saida esperada

- implementacao concreta criada em `src/infrastructure/<categoria>/`
- factory de composicao ou ponto de uso atualizado quando necessario
- dependencias externas instaladas apenas quando realmente precisarem
- testes adicionados quando houver comportamento observavel relevante
