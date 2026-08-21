# Tasks: Add Assisted Migration

## Discovery and planning

- [x] Define a versioned migration manifest and confidence model.
- [x] Extend audit findings with stable identifiers and transformation metadata.
- [x] Implement a read-only `migrate plan` command with human and JSON output.
- [x] Document supported frameworks, file types, and known limitations.

## Safe transformations

- [x] Add dry-run diff generation.
- [x] Add clean-worktree protection and explicit override behavior.
- [x] Implement token replacement transforms for unambiguous values.
- [x] Implement selected native-to-Super-System component transforms.
- [x] Add transform selection, per-rule opt-out, and resumable manifests.

## Verification

- [x] Add fixture tests for successful, ambiguous, unsupported, and malformed source cases.
- [x] Verify idempotency by applying each transform twice.
- [x] Verify behavior in representative existing React, Next.js, and Vite projects.
- [x] Run build, type, test, and audit checks after applied migrations.

## Documentation and release

- [x] Write a backup, review, rollback, and troubleshooting guide.
- [x] Provide AI-neutral follow-up instructions for unresolved findings.
- [x] Publish as an opt-in beta and collect migration failure examples before stable release.
