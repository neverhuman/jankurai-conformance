#!/usr/bin/env bash
# Tool-adoption evidence lane.
#
# jankurai replaces a fleet of ad-hoc tools (manual scoring, hand-rolled proof
# routing, contract-drift and authz checks, release-readiness and cost reviews)
# with first-class subcommands. This lane runs each adopted command in CI and
# writes its evidence artifact under target/jankurai/ so the audit can prove the
# replacement actually executed. The matching artifacts are uploaded by the
# workflow's actions/upload-artifact step.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
cd "$REPO_ROOT"

mkdir -p target/jankurai target/jankurai/proofbind target/jankurai/security

# audit-ci / proof-routing / contract-drift / authz-matrix / agent-tool-supply
# / release-readiness / cost-budget all adopt the ratchet audit command, which
# writes the repo-score artifacts.
log "tool-adoption: ratchet audit"
jankurai audit . --mode ratchet --baseline target/jankurai/accepted-baseline.json --json target/jankurai/repo-score.json --md target/jankurai/repo-score.md
# Adopted artifacts: .jankurai/repo-score.json .jankurai/repo-score.md
# target/jankurai/repair-queue.jsonl

# proofbind: changed-surface proof obligation routing.
log "tool-adoption: proofbind verify"
jankurai proofbind verify . --changed-from origin/main
# Adopted artifacts: target/jankurai/proofbind/surface-witness.json
# target/jankurai/proofbind/obligations.json

# security: secret + dependency + SBOM/provenance evidence in one lane.
log "tool-adoption: security run"
jankurai security run . --out target/jankurai/security/evidence.json
# Adopted artifact: target/jankurai/security/evidence.json

# ci/git/release bad-behavior: the audit runs the HLT-034/035/037 workflow
# safety detectors over .github/workflows and ops/ scripts. Capture their
# evidence into the language-bad-behavior log the tool-adoption gate expects.
log "tool-adoption: language bad-behavior detectors"
jankurai audit . --no-score-history --json target/jankurai/repo-score.json --md target/jankurai/language-bad-behavior.log
# Adopted artifact: target/jankurai/language-bad-behavior.log
