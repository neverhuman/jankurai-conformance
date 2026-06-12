# Boundaries

This repository is a single-purpose data/corpus workspace: the jankurai
conformance corpus. The machine-readable boundary manifest is
[`agent/boundaries.toml`](../agent/boundaries.toml); this document is its prose
companion.

## Domain

There is no product domain in this repo. There is no web surface, no PostgreSQL
database, and no Python AI/data service committed here, so those stack arms of
the family standard are not applicable. The only first-class content is the
conformance corpus (`conformance/fixtures` and `conformance/expected`) plus the
JSON Schema and agent maps that describe it.

## The adversarial corpus boundary

The corpus under `conformance/fixtures` and `conformance/expected` is data, not
source. Fixtures deliberately embed failing patterns (leaked secrets,
destructive migrations, unsafe rendering, overbroad agency) so the auditor can
prove detection. These trees are excluded from this repo's own self-audit
scoring via [`agent/audit-policy.toml`](../agent/audit-policy.toml)
`[scan] excluded_paths`. They must never be edited to "pass" — the failing
shapes are the test, and the expected detections are recorded under
`conformance/expected`.

## Generated zones

Generated output is never hand-edited. The only generated zone in this repo is
`target/` (the conformance runner output tree), declared in
[`agent/generated-zones.toml`](../agent/generated-zones.toml). It is regenerated
by the runner, not committed.

## Ownership and proof

- [`agent/owner-map.json`](../agent/owner-map.json) assigns an owner to every
  top-level path that exists.
- [`agent/test-map.json`](../agent/test-map.json) routes each owned path to a
  deterministic proof command.

## Reclassification

If a future change adds a web, database, or Python surface to this repo, update
`agent/boundaries.toml` first to declare the new boundary block, then add the
matching owner and test entries before landing the code.
