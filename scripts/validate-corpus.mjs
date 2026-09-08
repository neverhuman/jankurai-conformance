#!/usr/bin/env node
// Expected files are assertions about reports, not complete runtime reports.
// Compile the runtime schemas and validate the assertion contract and fixtures.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
for (const file of readdirSync(join(root, "schemas"))) {
  if (file.endsWith(".schema.json")) {
    ajv.addSchema(JSON.parse(readFileSync(join(root, "schemas", file), "utf8")));
  }
}

for (const file of readdirSync(join(root, "schemas"))) {
  if (!file.endsWith(".schema.json")) continue;
  const schema = JSON.parse(readFileSync(join(root, "schemas", file), "utf8"));
  const validate = ajv.getSchema(schema.$id);
  if (!validate) throw new Error(`missing schema: ${file}`);
}

let failures = 0;
const dir = join(root, "conformance", "expected");
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".json")) continue;
  const data = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const kind = file.includes(".merge-witness.") ? "witness" : "audit";
  const validate = ajv.getSchema(`https://jankurai.dev/schemas/conformance-expectation.schema.json#/$defs/${kind}`);
  if (!validate) throw new Error(`missing validator: ${kind}`);
  if (!validate(data)) {
    failures += 1;
    console.error(`invalid ${file}:`, validate.errors);
    continue;
  }
  for (const fixture of data.fixtures ?? [data.fixture]) {
    if (!existsSync(join(root, "conformance", "fixtures", fixture))) {
      failures += 1;
      console.error(`missing fixture referenced by ${file}: ${fixture}`);
    }
  }
}

if (failures > 0) {
  console.error(`corpus validation failed: ${failures} report(s) off-contract`);
  process.exit(1);
}
console.log("corpus validation passed: runtime schemas compile and every expectation references an existing fixture");
