# Add Hosted Theme Sharing

## Problem

The local Studio makes theme editing safe and immediate, but teams cannot yet share a preview link, collaborate on a theme, or promote an approved theme between projects without exchanging files manually.

## Goals

- Publish an optional hosted preview of a theme without making cloud use mandatory.
- Support shareable, revocable links and immutable theme versions.
- Keep `super-system.json` portable and fully usable offline.
- Provide an authenticated path for team-owned themes after public-link foundations are secure.

## Non-goals

- Move token compilation or core component usage behind a hosted service.
- Upload application source code.
- Build a full design-canvas product or real-time multiplayer editor in the first release.

## Affected capabilities

- Theme Studio
- Theme system
- Distribution
- Accessibility

## Dependencies

- A stable, versioned theme schema.
- Hosting, storage, authentication, abuse protection, and privacy decisions.
- A secure secret-handling and link-revocation model.

## Risks

- Public links may expose brand information unintentionally.
- Hosted content creates privacy, abuse, availability, and retention obligations.
- Schema drift could make old shared previews inaccurate.

## Rollout

Begin with anonymous, explicitly published, read-only snapshots that expire and can be deleted with a secret management link. Add authenticated workspaces and team collaboration only after security and demand are validated.
