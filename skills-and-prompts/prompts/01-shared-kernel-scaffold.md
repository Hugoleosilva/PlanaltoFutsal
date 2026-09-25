Crie uma skill chamada `shared-kernel-scaffold` dentro de `skills-and-prompts/skills/shared-kernel-scaffold` para materializar de forma deterministica o kernel compartilhado deste app Next.js unico (Planalto Futsal).

No `SKILL.md`, defina:

- `name`: `shared-kernel-scaffold`
- `description`: `Materializa o kernel compartilhado da aplicação Planalto Futsal (Next.js + Mongoose), concentrando a classe base de entidade, o contrato de caso de uso, a hierarquia de erros de dominio e o motor de validacao reutilizavel consumidos por todos os modulos do dominio.`

Regras da implementacao:

1. Este projeto NAO e um monorepo Turborepo com `packages/shared`. E um unico app Next.js (App Router) com Clean Architecture organizada em `/src`. Nao inventar workspaces, scope de pacote npm ou deteccao dinamica de namespace — nada disso existe aqui.
2. O kernel deve ser distribuido em tres pastas de destino dentro do app real, conforme a convencao definida no CLAUDE.md do projeto:
   - `src/core/domain/` — classe base `Entity<TState>` e os contratos (ports) de repositorio (`CreateRepository`, `UpdateRepository`, `DeleteRepository`, `FindByIdRepository`, `FindPageRepository`, `CrudRepository`, `PageResult`).
   - `src/core/use-cases/` — contrato base `UseCase<IN, OUT>`.
   - `src/infrastructure/errors/` — hierarquia `DomainError` (`NotFoundError`, `UnauthorizedError`, `ValidationError`, `ValidationException`).
   - `src/shared/validation/` — `Validator`, `rule.utils.ts` e o catalogo de ~60 regras de validacao reutilizaveis (email, cpf, cep, phone-br, strong-password, etc.).
3. Copie para dentro da propria pasta da skill (`assets/kernel-template/`) todos os arquivos canonicos necessarios para recriar esse kernel do zero, ja organizados espelhando exatamente as quatro pastas de destino acima.
4. Como o kernel passa a viver em pastas de topo diferentes (em vez de um unico pacote com barrel `src/index.ts`), ajuste os imports cruzados entre elas para usar o alias `"@/*"` do Next.js (`@/shared/validation`, `@/infrastructure/errors`), preservando imports relativos dentro da mesma pasta.
5. Toda a base deterministica da reconstrucao deve ficar fisicamente dentro de `skills-and-prompts/skills/shared-kernel-scaffold/assets/kernel-template/`. A skill nao pode depender de arquivos, templates ou pastas externas para recriar o kernel.
6. Nao inclua artefatos gerados ou temporarios, como `dist`, `coverage`, `.next` ou `node_modules`.
7. Nao embuta nome de cliente, empresa ou scope de pacote npm nos arquivos-base — este projeto nao publica pacotes npm internos.
8. Crie um script `scripts/scaffold-kernel.js` que copia `assets/kernel-template/{core,infrastructure/errors,shared/validation}` para `src/{core,infrastructure/errors,shared/validation}` do projeto real, com `--dry-run`/`--apply`/`--force`, preservando arquivos ja customizados por padrao (so sobrescrevendo com `--force`).
9. O script deve avisar se `tsconfig.json` nao declarar o alias `"@/*": ["./src/*"]`, ja que o kernel depende dele.
10. Se fizer sentido para completar a skill, crie tambem `agents/openai.yaml` coerente com o nome e a descricao definidos no `SKILL.md`.

Importante:

- Nao use nenhuma pasta externa compartilhada.
- Nao dependa do estado futuro do repositorio para reconstruir o kernel.
- Tudo que a skill precisa para funcionar deve estar contido dentro de `skills-and-prompts/skills/shared-kernel-scaffold/`.
- A skill nao deve conter Prisma, NestJS ou qualquer referencia a Turborepo/workspaces.
