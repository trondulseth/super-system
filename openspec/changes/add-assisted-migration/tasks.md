# Tasks: Add Assisted Migration

## Discovery and planning

- [x] Define a versioned migration manifest and confidence model.
- [x] Extend audit findings with stable identifiers and transformation metadata.
- [x] Implement a read-only `migrate plan` command with human and JSON output.
- [x] Document supported frameworks, file types, and known limitations.

## Safe transformations

- [x] Add dry-run diff generation.
- [ ] Add clean-worktree protection and explicit override behavior.
- [ ] Implement token replacement transforms for unambiguous values.
- [ ] Implement selected native-to-Super-System component transforms.
- [ ] Add transform selection, per-rule opt-out, and resumable manifests.

## Verification

- [ ] Add fixture tests for successful, ambiguous, unsupported, and malformed source cases.
- [ ] Verify idempotency by applying each transform twice.
- [ ] Verify behavior in representative existing React, Next.js, and Vite projects.
- [ ] Run build, type, test, and audit checks after applied migrations.

## Documentation and release

- [ ] Write a backup, review, rollback, and troubleshooting guide.
- [ ] Provide AI-neutral follow-up instructions for unresolved findings.
- [ ] Publish as an opt-in beta and collect migration failure examples before stable release.
