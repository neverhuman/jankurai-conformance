#!/usr/bin/env node
// Validate every expected report in conformance/expected against the JSON
// Schemas shipped under schemas/. This is the corpus integrity gate: the
// fixtures are deliberately adversarial, but the expected reports the auditor
// must reproduce are held to their published contract.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemas = {
  "repo-score": "schemas/repo-score.schema.json",
  "merge-witness": "schemas/merge-witness.schema.json",
  conformance: "schemas/conformance-results.schema.json",
};

const validators = {};
for (const [name, path] of Object.entries(schemas)) {
  validators[name] = ajv.compile(JSON.parse(readFileSync(join(root, path), "utf8")));
}

let failures = 0;
const dir = join(root, "conformance", "expected");
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".json")) continue;
  const data = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const kind = file.includes(".merge-witness.") ? "merge-witness" : "repo-score";
  if (!validators[kind](data)) {
    failures += 1;
    console.error(`invalid ${file}:`, validators[kind].errors);
  }
}

if (failures > 0) {
  console.error(`corpus validation failed: ${failures} report(s) off-contract`);
  process.exit(1);
}
console.log("corpus validation passed: all expected reports match their schema");
