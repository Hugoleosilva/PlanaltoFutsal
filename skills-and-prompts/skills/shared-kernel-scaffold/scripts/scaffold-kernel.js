#!/usr/bin/env node

/**
 * Materializa o kernel compartilhado (core/domain, core/use-cases,
 * infrastructure/errors, shared/validation) dentro de um app Next.js
 * unico, a partir da copia canonica em assets/kernel-template.
 *
 * Uso:
 *   node scaffold-kernel.js --dry-run
 *   node scaffold-kernel.js --apply
 *   node scaffold-kernel.js --apply --force
 */

const fs = require("node:fs");
const path = require("node:path");

const COPY_MAP = [
  { from: path.join("core"), to: path.join("src", "core") },
  {
    from: path.join("infrastructure", "errors"),
    to: path.join("src", "infrastructure", "errors"),
  },
  {
    from: path.join("shared", "validation"),
    to: path.join("src", "shared", "validation"),
  },
];

function main() {
  const args = parseArgs(process.argv.slice(2));
  const apply = Boolean(args.apply);
  const force = Boolean(args.force);

  if (!apply && !args["dry-run"]) {
    fail("Informe --dry-run ou --apply.");
  }

  const projectRoot = process.cwd();
  const templateRoot = path.resolve(__dirname, "..", "assets", "kernel-template");

  if (!fs.existsSync(templateRoot)) {
    fail(`Template do kernel nao encontrado em ${templateRoot}.`);
  }

  const plan = [];

  for (const entry of COPY_MAP) {
    const sourceDir = path.join(templateRoot, entry.from);
    const targetDir = path.join(projectRoot, entry.to);
    collectFilePlan(sourceDir, targetDir, plan, force);
  }

  const created = plan.filter((item) => item.action === "create");
  const skipped = plan.filter((item) => item.action === "skip");
  const overwritten = plan.filter((item) => item.action === "overwrite");

  log(`Arquivos a criar: ${created.length}`);
  log(`Arquivos ja existentes preservados (use --force para sobrescrever): ${skipped.length}`);
  if (force) {
    log(`Arquivos sobrescritos por --force: ${overwritten.length}`);
  }

  if (!apply) {
    log("Modo --dry-run: nenhum arquivo foi escrito.");
    return;
  }

  for (const item of plan) {
    if (item.action === "skip") continue;
    fs.mkdirSync(path.dirname(item.target), { recursive: true });
    fs.copyFileSync(item.source, item.target);
  }

  checkTsconfigAlias(projectRoot);

  log("Kernel compartilhado materializado com sucesso em src/core, src/infrastructure/errors e src/shared/validation.");
}

function collectFilePlan(sourceDir, targetDir, plan, force) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      collectFilePlan(sourcePath, targetPath, plan, force);
      continue;
    }

    const exists = fs.existsSync(targetPath);

    if (exists && !force) {
      plan.push({ source: sourcePath, target: targetPath, action: "skip" });
      continue;
    }

    plan.push({
      source: sourcePath,
      target: targetPath,
      action: exists ? "overwrite" : "create",
    });
  }
}

function checkTsconfigAlias(projectRoot) {
  const tsconfigPath = path.join(projectRoot, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    log("Aviso: tsconfig.json nao encontrado na raiz do projeto. Configure manualmente o alias \"@/*\": [\"./src/*\"].");
    return;
  }

  const raw = fs.readFileSync(tsconfigPath, "utf8");

  if (!raw.includes('"@/*"')) {
    log(
      'Aviso: tsconfig.json nao parece declarar o alias "@/*". O kernel compartilhado depende dele para os imports entre core, infrastructure e shared.',
    );
  }
}

function parseArgs(argv) {
  const args = {};

  for (const current of argv) {
    if (current === "--apply") args.apply = true;
    else if (current === "--dry-run") args["dry-run"] = true;
    else if (current === "--force") args.force = true;
    else if (current === "--help" || current === "-h") {
      printHelp();
      process.exit(0);
    } else fail(`Argumento desconhecido: ${current}`);
  }

  return args;
}

function printHelp() {
  console.log(
    "Uso: node .agents/skills/shared-kernel-scaffold/scripts/scaffold-kernel.js [--dry-run|--apply] [--force]",
  );
}

function log(message) {
  console.log(`[shared-kernel-scaffold] ${message}`);
}

function fail(message) {
  console.error(`[shared-kernel-scaffold] ${message}`);
  process.exit(1);
}

main();
