# Design: Hosted Theme Sharing

## Data boundary

Only validated theme configuration and minimal preview metadata are uploaded. Application source, environment variables, repository data, and arbitrary files are excluded. The service recompiles or safely renders the supported schema version.

## Snapshot model

Every publish action creates an immutable snapshot with a public identifier, creation time, schema version, optional expiry, and cryptographically separate management secret. The public URL is read-only. Updating a theme creates a new version rather than silently changing a reviewed snapshot.

## Security and privacy

Publishing requires an explicit confirmation that lists the uploaded fields. Anonymous snapshots default to expiration. Management secrets are shown once and stored locally only at the user's direction. Rate limiting and content-size limits protect the service. Deletion and revocation take effect immediately at the application layer.

## Local-first behavior

Theme compilation, Studio editing, contrast checking, and application builds remain local capabilities. Network failure never prevents local use. Hosted commands are a separate opt-in namespace and clearly report remote actions.

## Alternatives considered

- **Make the Studio cloud-only:** rejected because offline and private projects are core use cases.
- **Upload the repository for richer previews:** rejected because it materially expands privacy and security scope.
- **Mutable public URL by default:** rejected because reviewers need reproducible snapshots.

## Compatibility and migration

The service stores the submitted schema version. Compatible old versions remain renderable or receive an explicit unsupported-version message with a local migration path. Hosted clients negotiate supported versions before upload.
