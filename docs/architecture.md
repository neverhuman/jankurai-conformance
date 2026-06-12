# jankurai-conformance Architecture

jankurai-conformance is a data/corpus repository. It holds the versioned
acceptance corpus the jankurai auditor is replayed against. It does not ship a
product surface (no web app, no database service, no Python AI service); its
job is to provide reproducible evidence for the standard's central claim: merge
decisions must be reproducible from versioned artifacts.

## Layout

| Path | Role |
| --- | --- |
| `conformance/fixtures` | seed repositories, both passing and deliberately failing |
| `conformance/expected` | expected repo-score and merge-witness reports per fixture |
| `schemas/` | JSON Schema for the conformance results artifact |
| `agent/` | machine-readable owner, test, generated-zone, and policy maps |
| `docs/` | architecture, testing, boundaries, release, and exception docs |
| `ops/` | pinned CI script entrypoints |
| `scripts/` | local CI helper |

## The corpus is data, not source

The fixtures under `conformance/fixtures` are intentionally adversarial. Several
contain leaked secrets, destructive migrations, unsafe rendering, or overbroad
agent permissions on purpose, so the auditor can prove it detects them, with the
expected detections recorded under `conformance/expected`. These trees are
input data for the auditor under test and are NOT this repository's own product
surface. They are therefore excluded from this repo's self-audit scoring in
[`agent/audit-policy.toml`](../agent/audit-policy.toml) `[scan] excluded_paths`.

## How the corpus is replayed

The hub jankurai auditor replays the corpus with its `conformance run`
subcommand, reading `conformance/fixtures` and comparing the observed reports to
`conformance/expected`. The generated results land under `target/jankurai`, the
only generated output tree in this repo (declared in
[`agent/generated-zones.toml`](../agent/generated-zones.toml)).

Agents should prefer [`agent/owner-map.json`](../agent/owner-map.json) and
[`agent/test-map.json`](../agent/test-map.json) for changes, then route to the
smallest proof lane (`just fast`).
