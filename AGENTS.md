# jankurai-conformance Agent Instructions

## Zero-new-worktree policy

- Never run `git worktree add` or `git worktree move` anywhere, including under `/tmp`. Work only
  in the claimed canonical primary checkout. If it is dirty, busy, or held, wait for a stopped-head
  handoff.
- Existing worktrees are cleanup inputs only. Never force-remove or prune them. Any removal needs
  separate authority, regression/salvage proof, and recursive proof that the directory contains no
  symlink.
- Exact-SHA CI isolation may use only an automatically removed standalone clone or sandbox that is
  not registered with `git worktree`.

Read `SPLIT.md` first. This repository is one member of the Jankurai split
family. It is a data/corpus repository: the conformance fixtures and expected
reports the jankurai auditor is replayed against. See
[`README.md`](README.md) and [`docs/architecture.md`](docs/architecture.md) for
the layout.

## Setup and validation

- One-command setup: `just setup` (verifies the corpus is present, stages the
  output tree). `just install` and `just bootstrap` are aliases.
- Deterministic fast lane: `just fast` (corpus check + jankurai self-audit).
- Full local check: `just check`, or `bash scripts/ci-local.sh all`.

## Rules

- Canonical local Jeryu repo: `root/jankurai-conformance`.
- Public mirror target: `github.com/neverhuman/jankurai-conformance`.
- Do not add committed cross-repo `path = "../..."` dependencies. Use the hub
  fusion workspace for local path patches.
- Do not hand-edit generated artifacts listed in
  [`agent/generated-zones.toml`](agent/generated-zones.toml).
- The fixtures under `conformance/fixtures` are intentionally adversarial test
  data. Do NOT "fix" them to pass; their failing shapes are the test and are
  excluded from this repo's self-audit via
  [`agent/audit-policy.toml`](agent/audit-policy.toml). See
  [`docs/boundaries.md`](docs/boundaries.md) and
  [`docs/exceptions.md`](docs/exceptions.md).
- Prefer [`agent/owner-map.json`](agent/owner-map.json) and
  [`agent/test-map.json`](agent/test-map.json) to route a change to the smallest
  proof lane.
- Run `bash scripts/ci-local.sh required` before handing off changes.
