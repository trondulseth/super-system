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

### 1.2 Etter transfer — org-innstillinger

På `superhero-codes/super-system`:

| Område | Handling |
| --- | --- |
| **Settings → General** | Beskrivelse, topics, default branch `main` |
| **Settings → Actions → General** | Actions enabled; workflow permissions for OIDC |
| **Settings → Environments** | Gjenopprett **`npm`** og **`github-pages`** med protection rules |
| **Settings → Pages** | Source: **GitHub Actions** (som i dag) |
| **Settings → Secrets and variables** | Sjekk at ingenting mangler etter flytt |
| **Settings → Collaborators** | Sett org-team som maintainers |

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

### 5.1 Workflows (ingen endring i filnavn nødvendig)

| Workflow | Fil | Avhengighet |
| --- | --- | --- |
| CI | `.github/workflows/ci.yml` | — |
| Publish beta | `.github/workflows/publish.yml` | Environment **`npm`**, OIDC |
| Deploy Studio Demo | `.github/workflows/pages.yml` | Environment **`github-pages`** |

### 5.2 Sjekkliste etter flytt

- [ ] CI grønn på `main`
- [ ] Pages deploy grønn; demo laster
- [ ] `workflow_dispatch` på Publish beta fungerer
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
| Publish workflow 403 | Trusted Publisher peker fortsatt på `trondulseth/super-system` | Oppdater npm Trusted Publisher (Fase 3) |
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
