# Agent exceptions and overrides

This document defines the agent-friendly exception pattern for
jankurai-conformance: how an agent or maintainer requests, records, and bounds
an override of a standard rule. Exceptions are the only sanctioned way to
deviate from the audit baseline.

## Principle

The default answer is "follow the standard." An exception is a dated, owned,
expiring waiver for a specific rule on a specific path. Exceptions are data, not
prose: they live next to the data they govern and are reviewed on every audit.

## How to request an exception

1. Identify the exact `rule_id` and `path` the exception applies to (from the
   audit JSON `findings[]`).
2. Add an entry to the relevant `agent/*.toml` manifest. For scan-scope
   exclusions (such as the adversarial corpus) use
   [`agent/audit-policy.toml`](../agent/audit-policy.toml) `[scan]
   excluded_paths`; for boundary reclassifications use
   [`agent/boundaries.toml`](../agent/boundaries.toml).
3. Every exception entry that waives a rule MUST carry:
   - `owner` — the team or person accountable.
   - `classification` — e.g. `corpus`, `brownfield`, `temporary`, `vendor`.
   - `expires` — an ISO date after which the exception is invalid and the audit
     fails again.
   - `migration_path` — the concrete plan to remove the exception.

## The corpus exclusion

The largest standing exception in this repo is the scan exclusion of
`conformance/fixtures` and `conformance/expected`. This is classified `corpus`:
the trees are intentionally-failing test data, not product source, so scoring
them as this repo's own code would be incorrect. The exclusion is documented in
[`agent/audit-policy.toml`](../agent/audit-policy.toml) and
[`docs/boundaries.md`](boundaries.md). It does not expire because the corpus is
the permanent purpose of the repository, but it is re-reviewed on every audit.

## Override review

- Every exception is re-evaluated on each `just audit` run.
- An expired exception is treated as a hard finding, not a pass.
- Removing an exception requires deleting its entry and proving the underlying
  rule now passes on its own.

## What is never excepted

Secret leakage in the product surface, destructive migrations without rollback,
and hand-edits to generated zones are never granted exceptions in this repo's
own source. (The deliberately-failing fixtures are corpus data, not the product
surface, and are governed by the scan exclusion above.) Fix the underlying cause
instead.
