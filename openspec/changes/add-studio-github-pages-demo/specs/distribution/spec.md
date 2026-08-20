# Distribution Delta

## ADDED Requirements

### Requirement: Generated studio demo artifact
The repository build SHALL produce a static Studio demo artifact from the shared Studio UI package without requiring manual updates to a separate demo source tree.

#### Scenario: Continuous integration builds the repository
- **GIVEN** a successful `pnpm check` run
- **WHEN** the studio demo build step executes
- **THEN** a static demo directory is generated for deployment

### Requirement: Automated GitHub Pages deployment
The repository SHALL deploy the generated Studio demo to GitHub Pages through GitHub Actions when changes land on the default branch.

#### Scenario: Main branch receives Studio UI changes
- **GIVEN** a push to the default branch
- **WHEN** the Pages deployment workflow runs successfully
- **THEN** the public demo reflects the latest generated Studio UI

### Requirement: Public demo documentation
The README SHALL link to the public Studio demo and explain that it is a browser preview while local Studio remains the project-integrated editor.

#### Scenario: A first-time visitor reads the README
- **GIVEN** no prior Super System experience
- **WHEN** the visitor reads the documentation
- **THEN** they can find the public demo link and understand how it differs from `super-system studio`
