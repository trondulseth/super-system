# Playbook: Flytt Super System til superhero-codes

[← Dokumentasjon](./README.md) · [Contributing](../CONTRIBUTING.md)

Denne playbooken beskriver hvordan du flytter kodebasen fra **personlig repo** til **organisasjon**, uten å bryte npm-publisering, GitHub Pages, CI eller bidragsflyt.

| | |
| --- | --- |
| **Fra** | `https://github.com/trondulseth/super-system` |
| **Til** | `https://github.com/superhero-codes/super-system` |
| **npm-scope** | `@super-system/*` (uendret — egen org på npm) |
| **Estimat** | 1–2 timer aktivt arbeid + verifisering |

---

## Mål

- Ett kanonisk repo under [superhero-codes](https://github.com/superhero-codes)
- Fungerende CI, Pages, npm Trusted Publishing og dokumentasjon
- Klare omdirigeringer fra gammelt repo
- Ingen tap av issues, PR-historikk eller tags (bruk **Transfer**, ikke nytt tomt repo)

---

## Fase 0 — Forberedelse

### 0.1 Sjekk tilgang

- [ ] Du er **Owner** på `superhero-codes`-orgen
- [ ] Du er **Admin** på `trondulseth/super-system`
- [ ] Du er **Owner** på npm-orgen `@super-system`
- [ ] GitHub Pages er aktivert for orgen (Settings → Pages → allow org sites)

### 0.2 Ta en release-snapshot

```bash
git fetch origin --tags
git tag -l 'v0.1.0-beta.*' | tail -5
```

Noter siste tag og siste grønne CI-kjøring. Ikke flytt repo midt i en pågående release.

### 0.3 Kommuniser

- [ ] Pin issue/Discussion i gammelt repo: «Repo flyttes til superhero-codes»
- [ ] Varsle evt. med-bidragsytere om planlagt vindu

---

## Fase 1 — GitHub repo-transfer

### 1.1 Transfer (anbefalt)

1. Gå til `trondulseth/super-system` → **Settings** → **General** → **Danger Zone**
2. Velg **Transfer ownership**
3. Ny eier: **`superhero-codes`**
4. Repo-navn: **`super-system`** (behold navnet)
5. Bekreft transfer

GitHub oppretter automatisk redirect: `trondulseth/super-system` → `superhero-codes/super-system`.

> **Ikke** opprett et nytt repo og push manuelt med `--force` med mindre du bevisst vil miste issues/PRs/stjerner.

### 1.2 Etter transfer — org-innstillinger (oversikt)

På `superhero-codes/super-system`:

| Område | Handling |
| --- | --- |
| **Settings → General** | Beskrivelse, topics, default branch `main` |
| **Settings → Actions → General** | Actions enabled; workflow permissions for OIDC |
| **Settings → Environments** | Gjenopprett **`npm`** og **`github-pages`** — [steg-for-steg nedenfor](#123-miljø-npm-steg-for-steg) |
| **Settings → Pages** | Source: **GitHub Actions** (som i dag) |
| **Settings → Secrets and variables** | Sjekk at ingenting mangler etter flytt |
| **Settings → Collaborators** | Sett org-team som maintainers |

> **Viktig:** Miljøene `npm` og `github-pages` **overføres ikke automatisk** med protection rules intakt. Du må opprette dem på nytt (eller rekonfigurere dem) manuelt etter transfer. Følg seksjon **1.2.1–1.2.5** — copy/paste-vennlig «for dummies»-guide.

### 1.2.1 GitHub Actions — grunninnstillinger (steg for steg)

Dette må gjøres **før** du tester publish eller Pages.

#### A) Org-nivå (anbefalt først)

1. Åpne `https://github.com/organizations/superhero-codes/settings/actions`
2. Under **Actions permissions**:
   - Velg **Allow all actions and reusable workflows** (eller «Allow superhero-codes, and select non-superhero-codes, actions…» hvis du vil stramme inn senere)
3. Under **Workflow permissions**:
   - Velg **Read and write permissions**
   - **Kryss av** for **Allow GitHub Actions to create and approve pull requests** — *valgfritt*; ikke nødvendig for Super System
4. Klikk **Save**

#### B) Repo-nivå

1. Åpne `https://github.com/superhero-codes/super-system/settings/actions`
2. Under **Actions permissions**:
   - Velg **Allow all actions and reusable workflows**
3. Under **Workflow permissions**:
   - Velg **Read and write permissions**
4. Klikk **Save**

**Hvorfor:** `publish.yml` trenger `id-token: write` (OIDC til npm). `pages.yml` trenger `pages: write` + `id-token: write`. Med kun «Read repository contents» feiler deploy/publish med permissions-feil.

---

### 1.2.2 Finn Environments-siden

1. Gå til `https://github.com/superhero-codes/super-system`
2. Klikk **Settings** (repo-fane, ikke org)
3. I venstremenyen: **Environments**

Du skal nå se enten en tom liste, eller miljøer uten regler. Begge deler håndteres likt: opprett på nytt eller åpne eksisterende og sett regler som beskrevet under.

---

### 1.2.3 Miljø: `npm` (steg for steg)

**Brukes av:** workflow **Publish beta** (`.github/workflows/publish.yml`)  
**Formål:** Publisere `@super-system/*` til npm via Trusted Publishing (OIDC — **ingen** `NPM_TOKEN` secret nødvendig)

#### Steg 1 — Opprett miljøet

1. På **Environments**-siden → **New environment**
2. **Name:** skriv nøyaktig `npm` (små bokstaver — må matche `environment: npm` i workflow-filen)
3. Klikk **Configure environment**

#### Steg 2 — Deployment branches and tags (viktigste regelen)

Under **Deployment branches and tags** (eller **Deployment protection rules** → **Deployment branches**):

1. Velg **Selected branches and tags** (ikke «All branches» — da kan hvem som helst trigge publish fra en tilfeldig branch)
2. Klikk **Add deployment branch or tag rule**
3. Velg **Tags**
4. Skriv mønster: `v0.1.0-beta.*`
5. Lagre regelen

**Resultat:** Bare tag-push som matcher `v0.1.0-beta.N` kan bruke `npm`-miljøet. Manuell **Run workflow** fra Actions fungerer fortsatt, men er fortsatt bundet til miljøreglene.

> Hvis GitHub UI viser «Add rule» med regex: bruk `v0.1.0-beta.*` eller `v0.1.0-beta.**` avhengig av UI — poenget er at kun beta-tags kan publisere.

#### Steg 3 — Required reviewers (valgfritt, anbefalt for team)

Under **Required reviewers**:

| Scenario | Anbefaling |
| --- | --- |
| **Kun deg (solo)** | La stå **av** — ellers må du godkjenne egne publish-kjøringer manuelt |
| **Team / flere maintainers** | **Slå på** → legg til 1–2 personer som må godkene før npm publish |

For solo: hopp over dette steget.

#### Steg 4 — Wait timer

La stå **av** (0 minutter). Ikke nødvendig for dette prosjektet.

#### Steg 5 — Secrets og variables

**Legg ikke til secrets** for npm publish — prosjektet bruker Trusted Publishing (OIDC).

Sjekkliste:

- [ ] **Environment secrets:** tom (ingen `NPM_TOKEN`)
- [ ] **Environment variables:** tom

Hvis du har en gammel `NPM_TOKEN` fra før OIDC: **ikke** legg den tilbake — den er unødvendig og mindre sikkert.

#### Steg 6 — Lagre

Klikk **Save protection rules** (eller tilsvarende knapp nederst).

---

### 1.2.4 Miljø: `github-pages` (steg for steg)

**Brukes av:** workflow **Deploy Studio Demo** (`.github/workflows/pages.yml`, jobben `deploy`)  
**Formål:** Publisere Studio-demo til `https://superhero-codes.github.io/super-system/`

#### Steg 0 — Aktiver Pages (hvis ikke gjort)

1. Gå til **Settings → Pages**
2. Under **Build and deployment** → **Source:** velg **GitHub Actions**
3. Lagre

GitHub oppretter ofte miljøet `github-pages` automatisk første gang Pages deploy kjører — men reglene må du sette selv.

#### Steg 1 — Opprett miljøet (hvis det ikke finnes)

1. **Settings → Environments → New environment**
2. **Name:** `github-pages` (nøyaktig — matcher `environment.name` i workflow)
3. **Configure environment**

> Hvis miljøet allerede finnes (auto-opprettet): klikk på navnet og gå til steg 2.

#### Steg 2 — Deployment branches and tags

1. Velg **Selected branches and tags**
2. **Add deployment branch or tag rule**
3. Velg **Branch**
4. Velg **`main`** (kun default branch skal deploye demo)
5. Lagre

**Ikke** tillat alle branches — da kan en feature-branch overskrive produksjons-demoen.

#### Steg 3 — Required reviewers

| Scenario | Anbefaling |
| --- | --- |
| **Solo / liten org** | **Av** — demo skal deploye automatisk ved merge til `main` |
| **Streng kontroll** | Slå på 1 reviewer (sjeldent nødvendig for en statisk demo) |

#### Steg 4 — Secrets og variables

Ingen secrets nødvendig for Pages med OIDC (`pages: write` + `id-token: write` i workflow).

- [ ] **Environment secrets:** tom
- [ ] **Environment variables:** tom

#### Steg 5 — Lagre

Lagre protection rules.

---

### 1.2.5 Verifiser miljøene (2 minutter)

#### Test `github-pages`

1. Gå til **Actions → Deploy Studio Demo**
2. Klikk **Run workflow** → branch **`main`** → **Run workflow**
3. Vent til grønt ✓
4. Åpne `https://superhero-codes.github.io/super-system/` — Studio-demo skal laste

**Feilsøking:**

| Feilmelding | Fix |
| --- | --- |
| `Environment github-pages not found` | Opprett miljøet (1.2.4) |
| `Deployment was rejected` | Sjekk at du kjører fra `main` og at branch-regelen tillater `main` |
| `Resource not accessible by integration` | Workflow permissions → Read and write (1.2.1) |

#### Test `npm` (uten faktisk ny versjon)

1. Gå til **Actions → Publish beta**
2. Klikk **Run workflow**
3. Velg en **eksisterende tag** (f.eks. `v0.1.0-beta.18`) — scriptet skipper allerede publiserte pakker
4. Workflow skal **starte** og nå `environment: npm`-steget (grønt eller skipped packages — ikke «environment protection»-feil)

**Feilsøking:**

| Feilmelding | Fix |
| --- | --- |
| `Waiting for approval` | Required reviewers er på — godkjenn i Actions, eller slå av (1.2.3 steg 3) |
| `Environment npm not found` | Opprett miljøet (1.2.3) |
| `403 Forbidden` ved npm publish | Trusted Publisher peker feil repo — se [Fase 3](#fase-3--npm-trusted-publishing) |
| `Resource not accessible by integration` | Workflow permissions (1.2.1) + `id-token: write` i workflow |

---

### 1.2.6 Oppsummert: hvilke regler skal stå hvor?

| Miljø | Workflow | Trigger | Deployment rule | Reviewers | Secrets |
| --- | --- | --- | --- | --- | --- |
| **`npm`** | Publish beta | Tag `v0.1.0-beta.*` | Tags: `v0.1.0-beta.*` | Av (solo) / 1+ (team) | Ingen (OIDC) |
| **`github-pages`** | Deploy Studio Demo | Push til `main` | Branch: `main` | Av | Ingen (OIDC) |

**Navn må være eksakte:** `npm` og `github-pages` — ikke `NPM`, `production`, eller `github-pages-production`.


### 1.3 Oppdater lokale remotes (alle utviklere)

```bash
git remote set-url origin https://github.com/superhero-codes/super-system.git
git remote -v
git fetch origin
```

---

## Fase 2 — GitHub Pages (Studio-demo)

**Gammel URL:** `https://trondulseth.github.io/super-system/`  
**Ny URL:** `https://superhero-codes.github.io/super-system/`

### 2.1 Deploy

1. Merge endringene i [Fase 4](#fase-4--oppdater-referanser-i-repo) (URL-er i docs)
2. Push til `main` — workflow **Deploy Studio Demo** (`.github/workflows/pages.yml`) kjører automatisk
3. Verifiser at demo laster på ny URL

### 2.2 Gammel Pages-URL

- User Pages (`trondulseth.github.io/super-system`) opphører etter flytt
- Legg en kort README i gammelt brukernavn **kun hvis** du oppretter et tomt erstatningsrepo (valgfritt)
- Oppdater eksterne lenker (README-badges, blogg, npm `homepage` hvis satt senere)

---

## Fase 3 — npm Trusted Publishing

npm-pakkene **`@super-system/*`** og **`eslint-plugin-super-system`** er **uavhengige** av GitHub-eier — men Trusted Publisher peker på repo + workflow.

For **hver** publisert pakke på [npmjs.com](https://www.npmjs.com/org/super-system):

1. npm → pakke → **Settings** → **Publishing access** → **Trusted Publishers**
2. Fjern / oppdater gammel publisher (`trondulseth/super-system`)
3. Legg til ny:
   - **Organization / user:** `superhero-codes`
   - **Repository:** `super-system`
   - **Workflow:** `publish.yml`
   - **Environment:** `npm` (hvis konfigurert)

Pakker som må oppdateres:

| Pakke | Trusted Publisher |
| --- | --- |
| `@super-system/tokens` | Ja |
| `@super-system/rules` | Ja (etter first publish) |
| `@super-system/react` | Ja |
| `@super-system/cli` | Ja |
| `eslint-plugin-super-system` | Ja (etter first publish) |

### 3.1 Verifiser publish

Etter Trusted Publisher er oppdatert:

```bash
# Lokalt (valgfritt smoke test med npm login)
node scripts/verify-release.mjs v0.1.0-beta.18
```

Eller re-kjør **Publish beta** på siste tag i Actions (scriptet skipper allerede publiserte versjoner).

---

## Fase 4 — Oppdater referanser i repo

Kjør søk etter gammel eier og erstatt:

```bash
rg 'trondulseth/super-system|trondulseth\.github\.io/super-system' .
```

### 4.1 Filer som **må** oppdateres

| Fil | Hva |
| --- | --- |
| `packages/*/package.json` (5 stk) | `repository.url` |
| `README.md` | Studio demo-lenke |
| `CONTRIBUTING.md` | `git clone`-URL |
| `docs/getting-started.md` | Browser demo-URL |
| `docs/studio.md` | Browser demo-URL |
| `docs/roadmap.md` | Demo + clone URL |
| `openspec/config.yaml` | `Repository:` |

**Erstatning:**

```text
https://github.com/trondulseth/super-system     → https://github.com/superhero-codes/super-system
git+https://github.com/trondulseth/super-system → git+https://github.com/superhero-codes/super-system
https://trondulseth.github.io/super-system/     → https://superhero-codes.github.io/super-system/
```

### 4.2 package.json-mal (alle publiserte pakker)

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/superhero-codes/super-system.git",
  "directory": "packages/<pakkenavn>"
}
```

Legg gjerne til (valgfritt, anbefalt):

```json
"bugs": {
  "url": "https://github.com/superhero-codes/super-system/issues"
},
"homepage": "https://github.com/superhero-codes/super-system#readme"
```

### 4.3 OpenSpec

`openspec/config.yaml`:

```yaml
Repository: https://github.com/superhero-codes/super-system
```

### 4.4 Verifiser etter commit

```bash
pnpm check
rg 'trondulseth' .   # skal gi 0 treff (unntatt denne playbooken / historikk)
```

---

## Fase 5 — CI og miljøer

Miljøoppsett er dokumentert i detalj under [1.2.1–1.2.6](#121-github-actions--grunninnstillinger-steg-for-steg). Denne fasen er en kort sjekkliste etter at du har fulgt den guiden.

### 5.1 Workflows (ingen endring i filnavn nødvendig)

| Workflow | Fil | Miljø | Protection rule (anbefalt) |
| --- | --- | --- | --- |
| CI | `.github/workflows/ci.yml` | *(ingen)* | — |
| Publish beta | `.github/workflows/publish.yml` | **`npm`** | Tags: `v0.1.0-beta.*` |
| Deploy Studio Demo | `.github/workflows/pages.yml` | **`github-pages`** | Branch: `main` |

### 5.2 Sjekkliste etter flytt

- [ ] **Actions → General:** Read and write permissions (repo + org)
- [ ] **Environment `npm`:** opprettet, tag-regel `v0.1.0-beta.*`, ingen NPM_TOKEN
- [ ] **Environment `github-pages`:** opprettet, kun branch `main`
- [ ] **Settings → Pages:** Source = GitHub Actions
- [ ] Publish beta workflow når `npm`-miljøet uten protection-feil
- [ ] Deploy Studio Demo grønn; demo laster på ny URL
- [ ] CI grønn på `main`
- [ ] Branch protection på `main` (hvis brukt) gjenopprettet

---

## Fase 6 — Dokumentasjon og kommunikasjon

### 6.1 Internt

- [ ] Oppdater [docs/README.md](./README.md) med lenke til denne playbooken (maintainer-seksjon)
- [ ] Oppdater `SUPERSTATE.md` / OpenSpec journal med migrasjonsdato
- [ ] Legg til kort notis i `MIGRATION.md` (valgfritt, for konsumenter som bokmerker GitHub-URL)

### 6.2 Eksternt

- [ ] GitHub repo **About** → ny URL og beskrivelse
- [ ] npm pakke-sider: sjekk at «Repository» peker riktig (oppdateres ved neste publish med ny `repository.url`)
- [ ] Cursor / IDE-prosjekter: oppdater clone-URL
- [ ] Eventuelle badges i README (legg til repo-badge mot org hvis ønskelig)

Eksempel badge:

```markdown
[![GitHub](https://img.shields.io/github/stars/superhero-codes/super-system?style=social)](https://github.com/superhero-codes/super-system)
```

---

## Fase 7 — Verifikasjon (acceptance criteria)

Migrasjonen er **ferdig** når alt dette er sant:

| # | Test |
| --- | --- |
| 1 | `https://github.com/superhero-codes/super-system` er kanonisk; gammel URL redirecter |
| 2 | `pnpm check` grønn på `main` |
| 3 | Studio demo: `https://superhero-codes.github.io/super-system/` |
| 4 | Ingen `trondulseth/super-system` i kildekode (unntatt historiske journaler) |
| 5 | npm Trusted Publishing peker på `superhero-codes/super-system` |
| 6 | Test-tag eller re-run publish fullfører uten 403/404 |
| 7 | `git clone https://github.com/superhero-codes/super-system.git` fungerer for ny utvikler |

---

## Rollback

Hvis noe går galt **før** du har committet URL-endringer:

1. Transfer tilbake til `trondulseth` (GitHub Settings → Danger Zone)
2. Gjenopprett npm Trusted Publisher til gammelt repo
3. Re-deploy Pages på gammel konto

Etter URL-er er oppdatert i `main` og publisert: **ikke** rollback transfer uten å også reversere doc- og npm-endringer.

---

## Vanlige feil

| Symptom | Sannsynlig årsak | Fix |
| --- | --- | --- |
| `Environment npm not found` | Miljø ikke opprettet etter transfer | [1.2.3 Miljø: npm](#123-miljø-npm-steg-for-steg) |
| `Environment github-pages not found` | Miljø ikke opprettet | [1.2.4 Miljø: github-pages](#124-miljø-github-pages-steg-for-steg) |
| `Deployment was rejected` / protection error | Feil branch/tag for miljøregel | Sjekk deployment rules i 1.2.3 / 1.2.4 |
| `Waiting for approval` på publish | Required reviewers på `npm` | Godkjenn i Actions, eller slå av reviewers (solo) |
| Publish workflow 403 | Trusted Publisher peker fortsatt på `trondulseth/super-system` | Oppdater npm Trusted Publisher (Fase 3) |
| `Resource not accessible by integration` | Workflow permissions for restriktive | [1.2.1 Actions grunninnstillinger](#121-github-actions--grunninnstillinger-steg-for-steg) |
| Pages 404 | Org Pages ikke aktivert, eller workflow feilet | Settings → Pages; sjekk Actions-logg |
| Clone feiler for bidragsytere | Gammel remote URL | `git remote set-url` (Fase 1.3) |
| `pnpm check` feiler etter URL-bytte | Glemt fil i Fase 4 | Kjør `rg trondulseth` |
| Partial npm publish | Kjent fra beta.16–18 | Følg [First-time npm packages](../CONTRIBUTING.md#first-time-npm-packages) |

---

## Scope som **ikke** endres i denne flytten

- npm scope `@super-system` (krever egen npm-org-overføring om du vil bytte navn)
- Pakkenavn på npm (`@super-system/cli`, osv.)
- CLI-kommandoer og `super-system.json`-schema
- OpenSpec change-mapper (historikk bevares via transfer)

---

## Referanser

- [GitHub: Transferring a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
- [GitHub Pages for organizations](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites)
- [Contributing — Release process](../CONTRIBUTING.md#release-process-maintainers)
