# Tasks: Add Hosted Theme Sharing

## Product and security design

- [ ] Define the exact uploaded data model, retention policy, privacy notice, and abuse model.
- [ ] Choose hosting and storage with cost, region, backup, and deletion requirements documented.
- [ ] Threat-model public identifiers, management secrets, rendering, rate limits, and schema parsing.
- [ ] Define anonymous and future authenticated ownership flows.

## Service and client

- [ ] Implement validated immutable snapshot creation, retrieval, expiry, and deletion.
- [ ] Implement a read-only responsive preview with light/dark and contrast information.
- [ ] Add explicit `share`, `list`, and `revoke` CLI or Studio actions without changing local defaults.
- [ ] Add schema-version negotiation and safe rendering of supported historical snapshots.

## Verification

- [ ] Add API, authorization, expiry, rate-limit, malformed-input, and deletion tests.
- [ ] Conduct dependency, secret, and abuse-resistance reviews.
- [ ] Verify local Super System workflows remain functional without network access.
- [ ] Run accessibility checks on the hosted preview.

## Documentation and release

- [ ] Document exactly what is uploaded, link visibility, expiry, revocation, and recovery limits.
- [ ] Add service status and incident-response ownership before public beta.
- [ ] Launch with conservative quotas and monitor cost, errors, abuse, and deletion behavior.
