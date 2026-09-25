#!/usr/bin/env node

/**
 * Cria a estrutura base de um agregado de dominio dentro do app Next.js
 * unico deste projeto: src/core/domain/<aggregate> e src/core/use-cases/<aggregate>.
 *
 * Uso:
 *   node create-aggregate.js --aggregate atleta --mode crud
 *   node create-aggregate.js --aggregate campeonato --mode example
 */

const fs = require("node:fs");
const path = require("node:path");

const VALID_MODES = new Set(["crud", "example"]);

const DOMAIN_FILES = [
  {
    template: path.join("assets", "common", "domain", "entity.ts.tpl"),
    output: ({ aggregateName }) => `${aggregateName}.entity.ts`,
  },
  {
    template: path.join("assets", "common", "domain", "repository.ts.tpl"),
    output: ({ aggregateName }) => `${aggregateName}.repository.ts`,
  },
  {
    template: path.join("assets", "common", "domain", "index.ts.tpl"),
    output: () => "index.ts",
  },
];

const MODE_FILES = {
  crud: [
    {
      template: path.join("assets", "usecase", "crud", "create.usecase.ts.tpl"),
      output: ({ aggregateName }) => `create-${aggregateName}.usecase.ts`,
      exportLine: ({ aggregateName }) => `export * from "./create-${aggregateName}.usecase";`,
    },
    {
      template: path.join("assets", "usecase", "crud", "update.usecase.ts.tpl"),
      output: ({ aggregateName }) => `update-${aggregateName}.usecase.ts`,
      exportLine: ({ aggregateName }) => `export * from "./update-${aggregateName}.usecase";`,
    },
    {
      template: path.join("assets", "usecase", "crud", "delete.usecase.ts.tpl"),
      output: ({ aggregateName }) => `delete-${aggregateName}.usecase.ts`,
      exportLine: ({ aggregateName }) => `export * from "./delete-${aggregateName}.usecase";`,
    },
    {
      template: path.join("assets", "usecase", "crud", "find-by-id.usecase.ts.tpl"),
      output: ({ aggregateName }) => `find-${aggregateName}-by-id.usecase.ts`,
      exportLine: ({ aggregateName }) => `export * from "./find-${aggregateName}-by-id.usecase";`,
    },
    {
      template: path.join("assets", "usecase", "crud", "find-page.usecase.ts.tpl"),
      output: ({ aggregateName }) => `find-${aggregateName}-page.usecase.ts`,
      exportLine: ({ aggregateName }) => `export * from "./find-${aggregateName}-page.usecase";`,
    },
  ],
  example: [
    {
      template: path.join("assets", "usecase", "example", "create.usecase.ts.tpl"),
      output: ({ aggregateName }) => `create-${aggregateName}.usecase.ts`,
      exportLine: ({ aggregateName }) => `export * from "./create-${aggregateName}.usecase";`,
    },
  ],
};

function main() {
  const args = parseArgs(process.argv.slice(2));
  const aggregateInput = args.aggregate;
  const mode = args.mode;

  if (!aggregateInput) {
    fail("Informe --aggregate <nome-do-agregado> (ex.: atleta, campeonato, financeiro).");
  }

  if (!mode) {
    fail('Informe --mode <crud|example>. Se o pedido nao trouxer isso, pergunte: "Deseja criar a base de usecases em \\"crud\\" ou \\"example\\"?"');
  }

  if (!VALID_MODES.has(mode)) {
    fail("O modo deve ser crud ou example.");
  }

  const aggregateName = toKebabCase(aggregateInput);

  if (!aggregateName) {
    fail("Nao foi possivel normalizar o nome do agregado.");
  }

  const projectRoot = process.cwd();
  const skillRoot = path.resolve(__dirname, "..");
  const srcDir = path.join(projectRoot, "src");
  const coreDomainDir = path.join(srcDir, "core", "domain");
  const coreUseCasesDir = path.join(srcDir, "core", "use-cases");
  const entityFilePath = path.join(coreDomainDir, "entity.ts");
  const repositoriesDir = path.join(coreDomainDir, "repositories");
  const useCaseFilePath = path.join(coreUseCasesDir, "use-case.ts");
  const aggregateDomainDir = path.join(coreDomainDir, aggregateName);
  const aggregateUseCasesDir = path.join(coreUseCasesDir, aggregateName);

  assertFileExists(
    entityFilePath,
    "src/core/domain/entity.ts nao existe. Rode a skill shared-kernel-scaffold antes desta.",
  );
  assertDirectoryExists(
    repositoriesDir,
    "src/core/domain/repositories nao existe. Rode a skill shared-kernel-scaffold antes desta.",
  );
  assertFileExists(
    useCaseFilePath,
    "src/core/use-cases/use-case.ts nao existe. Rode a skill shared-kernel-scaffold antes desta.",
  );

  if (fs.existsSync(aggregateDomainDir)) {
    fail(`O agregado ${aggregateName} ja existe em src/core/domain/${aggregateName}.`);
  }

  const replacements = {
    "__AGGREGATE_NAME__": aggregateName,
    "__AGGREGATE_CLASS_NAME__": toPascalCase(aggregateName),
    "__AGGREGATE_REPOSITORY_NAME__": `${toPascalCase(aggregateName)}Repository`,
    "__AGGREGATE_VARIABLE_NAME__": toCamelCase(aggregateName),
  };

  log(`Criando agregado ${aggregateName} em src/core/domain/${aggregateName} e src/core/use-cases/${aggregateName}`);
  fs.mkdirSync(aggregateDomainDir, { recursive: true });
  fs.mkdirSync(aggregateUseCasesDir, { recursive: true });

  for (const file of DOMAIN_FILES) {
    const templatePath = path.join(skillRoot, file.template);
    const outputPath = path.join(aggregateDomainDir, file.output({ aggregateName }));
    materializeTemplate(templatePath, outputPath, replacements);
  }

  const modeFiles = MODE_FILES[mode];

  for (const file of modeFiles) {
    const templatePath = path.join(skillRoot, file.template);
    const outputPath = path.join(aggregateUseCasesDir, file.output({ aggregateName }));
    materializeTemplate(templatePath, outputPath, replacements);
  }

  const useCasesIndexTemplatePath = path.join(
    skillRoot,
    "assets",
    "common",
    "use-cases",
    "index.ts.tpl",
  );
  materializeTemplate(
    useCasesIndexTemplatePath,
    path.join(aggregateUseCasesDir, "index.ts"),
    {
      ...replacements,
      "__USECASE_EXPORTS__": modeFiles.map((file) => file.exportLine({ aggregateName })).join("\n"),
    },
  );

  log(`Agregado ${aggregateName} criado com sucesso.`);
  log(`Lembrete: implemente a versao Mongoose do repositorio em src/infrastructure/database/${aggregateName}/ (fora do escopo desta skill).`);
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === "--aggregate") {
      args.aggregate = argv[index + 1];
      index += 1;
      continue;
    }

    if (current === "--mode") {
      args.mode = argv[index + 1];
      index += 1;
      continue;
    }

    if (current === "--help" || current === "-h") {
      printHelp();
      process.exit(0);
    }

    fail(`Argumento desconhecido: ${current}`);
  }

  return args;
}

function printHelp() {
  console.log(
    "Uso: node .agents/skills/domain-aggregate-scaffold/scripts/create-aggregate.js --aggregate <nome-do-agregado> --mode <crud|example>",
  );
}

function materializeTemplate(templatePath, outputPath, replacements) {
  assertFileExists(templatePath, `Template nao encontrado: ${templatePath}`);
  const template = fs.readFileSync(templatePath, "utf8");
  const content = applyReplacements(template, replacements);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, ensureTrailingNewline(content));
}

function applyReplacements(template, replacements) {
  return Object.entries(replacements).reduce((content, [key, value]) => {
    return content.split(key).join(String(value));
  }, template);
}

function toKebabCase(value) {
  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toPascalCase(value) {
  return toKebabCase(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(value) {
  const pascalCase = toPascalCase(value);

  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

function ensureTrailingNewline(content) {
  return content.endsWith("\n") ? content : `${content}\n`;
}

function assertDirectoryExists(directoryPath, message) {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    fail(message);
  }
}

function assertFileExists(filePath, message) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    fail(message);
  }
}

function log(message) {
  console.log(`[domain-aggregate-scaffold] ${message}`);
}

function fail(message) {
  console.error(`[domain-aggregate-scaffold] ${message}`);
  process.exit(1);
}

main();
