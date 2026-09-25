#!/usr/bin/env node

/**
 * Cria a superficie Next.js de um modulo de dominio do Planalto Futsal:
 * um Route Handler em src/app/api/<module>, uma Server Action e uma pagina
 * App Router em src/app/(<access>)/<module>, chamando os casos de uso ja
 * criados por domain-aggregate-scaffold / domain-use-case-scaffold em
 * src/core/use-cases/<module>.
 *
 * Este projeto e um unico app Next.js: nao ha apps/frontend, apps/backend,
 * NestJS, workspaces ou namespace npm. Nao ha nada para "registrar" — o
 * App Router do Next.js descobre rotas pelo sistema de arquivos.
 *
 * Uso:
 *   node create-module.js --module atleta
 *   node create-module.js --module financeiro --access private
 *   node create-module.js --module galeria --access public --skip-route
 */

const fs = require("node:fs");
const path = require("node:path");

const FRONTEND_TEMPLATE_FILES = [
  {
    template: path.join("frontend-module-template", "route-page.tsx"),
    output: ({ moduleName, access }) =>
      path.join("app", `(${access})`, moduleName, "page.tsx"),
  },
  {
    template: path.join("frontend-module-template", "page.tsx"),
    output: ({ moduleName }) =>
      path.join("modules", moduleName, "pages", `${moduleName}.page.tsx`),
  },
  {
    template: path.join("frontend-module-template", "component.tsx"),
    output: ({ moduleName }) =>
      path.join("modules", moduleName, "components", `${moduleName}.component.tsx`),
  },
];

function main() {
  const args = parseArgs(process.argv.slice(2));
  const moduleName = args.module;
  const access = args.access ?? "private";
  const skipFrontend = Boolean(args["skip-frontend"]);
  const skipRoute = Boolean(args["skip-route"]);
  const skipAction = Boolean(args["skip-action"]);

  if (!moduleName) {
    fail("Informe --module <nome-do-modulo> (ex.: atleta, campeonato, financeiro).");
  }

  if (!/^[a-z0-9-]+$/.test(moduleName)) {
    fail("O nome do modulo deve usar apenas letras minusculas, numeros e hifens.");
  }

  if (!["public", "private"].includes(access)) {
    fail("--access deve ser public ou private.");
  }

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, "src");
  const appDir = path.join(srcDir, "app");
  const skillRoot = path.resolve(__dirname, "..");
  const moduleClassName = toPascalCase(moduleName);
  const moduleDisplayName = toDisplayName(moduleName);

  assertDirectoryExists(appDir, "src/app nao encontrado. Este script espera um app Next.js (App Router) existente.");

  const replacements = {
    "__MODULE_NAME__": moduleName,
    "__MODULE_CLASS_NAME__": moduleClassName,
    "__MODULE_DISPLAY_NAME__": moduleDisplayName,
  };

  if (!skipRoute) {
    const routeTargetPath = path.join(appDir, "api", moduleName, "route.ts");
    assertNotExists(routeTargetPath, `Route Handler ja existe em src/app/api/${moduleName}/route.ts.`);
    log(`Criando src/app/api/${moduleName}/route.ts`);
    materializeFile(
      path.join(skillRoot, "assets", "route-handler-template", "route.ts"),
      routeTargetPath,
      replacements,
    );
  }

  if (!skipAction) {
    const actionTargetPath = path.join(appDir, `(${access})`, moduleName, "actions.ts");
    assertNotExists(actionTargetPath, `Server Action ja existe em src/app/(${access})/${moduleName}/actions.ts.`);
    log(`Criando src/app/(${access})/${moduleName}/actions.ts`);
    materializeFile(
      path.join(skillRoot, "assets", "server-action-template", "actions.ts"),
      actionTargetPath,
      replacements,
    );
  }

  if (!skipFrontend) {
    log(`Criando estrutura de pagina para ${moduleName} (grupo de rota "${access}")`);
    for (const file of FRONTEND_TEMPLATE_FILES) {
      const sourcePath = path.join(skillRoot, "assets", file.template);
      const targetPath = path.join(srcDir, file.output({ moduleName, access }));
      assertNotExists(targetPath, `Arquivo ja existe: ${path.relative(projectRoot, targetPath)}`);
      materializeFile(sourcePath, targetPath, replacements);
    }
  }

  log(`Modulo ${moduleName} criado com sucesso.`);
  log("Nao ha registro manual a fazer: o App Router do Next.js descobre a rota pelo sistema de arquivos.");
  log(`Lembrete: src/core/domain/${moduleName} e src/core/use-cases/${moduleName} precisam existir (rode domain-aggregate-scaffold antes, se ainda nao existirem).`);
  log(`Lembrete: a implementacao real do repositorio com Mongoose (${moduleClassName}RepositoryMongoose) precisa ser criada em src/infrastructure/database/${moduleName}/.`);
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === "--module") {
      args.module = argv[index + 1];
      index += 1;
      continue;
    }

    if (current === "--access") {
      args.access = argv[index + 1];
      index += 1;
      continue;
    }

    if (current === "--skip-frontend") {
      args["skip-frontend"] = true;
      continue;
    }

    if (current === "--skip-route") {
      args["skip-route"] = true;
      continue;
    }

    if (current === "--skip-action") {
      args["skip-action"] = true;
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
    "Uso: node .agents/skills/nextjs-module-scaffold/scripts/create-module.js --module <nome> [--access public|private] [--skip-frontend] [--skip-route] [--skip-action]",
  );
}

function materializeFile(sourcePath, targetPath, replacements) {
  assertFileExists(sourcePath, `Template ausente: ${sourcePath}`);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  let content = fs.readFileSync(sourcePath, "utf8");
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.split(placeholder).join(value);
  }

  fs.writeFileSync(targetPath, content, "utf8");
}

function assertDirectoryExists(directoryPath, message) {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    fail(message);
  }
}

function assertFileExists(filePath, message) {
  if (!fs.existsSync(filePath)) {
    fail(message);
  }
}

function assertNotExists(targetPath, message) {
  if (fs.existsSync(targetPath)) {
    fail(message);
  }
}

function toPascalCase(name) {
  return name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

function toDisplayName(name) {
  return name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function log(message) {
  console.log(`[nextjs-module-scaffold] ${message}`);
}

function fail(message) {
  console.error(`[nextjs-module-scaffold] ${message}`);
  process.exit(1);
}

main();
