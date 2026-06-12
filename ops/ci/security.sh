#!/usr/bin/env bash
# Security lane: secret scanning plus dependency vulnerability scanning.
# gitleaks scans for committed secrets (the adversarial fixtures under
# conformance/fixtures are excluded by .gitleaks config / audit-policy so the
# deliberately-leaked test material does not mask real leaks); cargo audit
# checks any dependency manifests shipped with the corpus tooling. The same
# lane runs locally via `just security`.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
cd "$REPO_ROOT"

log "security lane: gitleaks + npm audit + cargo audit"
gitleaks detect --source . --no-banner --redact
npm audit --audit-level=high
cargo audit
