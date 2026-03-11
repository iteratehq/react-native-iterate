---
name: fix-cve
description: Fix CVE vulnerabilities in npm/yarn dependencies. Systematically identifies vulnerable transitive dependencies, prefers upgrading direct dependencies over lockfile hacks, assesses upgrade safety, and handles yarn/npm workspace complexity. Triggers on "fix CVE", "dependabot alert", "security vulnerability", "bump vulnerable dependency".
allowed-tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
  - WebFetch
  - Agent
preconditions:
  - CVE identifier or Dependabot alert details available
  - Project uses npm or yarn for package management
---

# fix-cve: Fix CVE Vulnerabilities in Dependencies

Systematic approach to resolving CVE vulnerabilities in npm/yarn projects, learned from real fixes across the Iterate monorepo.

## Core Principle

**Always prefer upgrading the direct dependency that pulls in the vulnerable transitive dependency.** This is safer and more maintainable than lockfile edits, resolutions, or overrides.

## Step-by-Step Process

### Step 1: Parse the CVE Details

Extract from the Dependabot alert or user-provided CVE info:

- **CVE ID** (e.g., CVE-2026-26278)
- **Affected package** and vulnerable version range
- **Patched version**
- **Dependency chain** — which direct dependencies pull in the vulnerable transitive dep
- **Which lockfiles** are affected (yarn.lock, package-lock.json, or both)

### Step 2: Trace the Dependency Chain

```bash
# Find where the vulnerable package appears in lockfiles
grep -n "vulnerable-package" yarn.lock package-lock.json examples/*/package-lock.json

# Identify which direct dependencies pull it in
npm view @direct/dependency dependencies --json
```

### Step 3: Check for Direct Dependency Upgrades (Preferred Fix)

```bash
# List available versions of the direct dependency
npm view @direct/dependency versions --json

# Check if newer versions use a patched transitive dep
npm view @direct/dependency@latest dependencies --json
```

**This is the preferred approach.** If a newer version of the direct dependency already uses a patched version of the vulnerable transitive dependency, upgrade the direct dependency instead of adding resolutions/overrides.

### Step 4: Assess Upgrade Safety

Before upgrading, check what changed between current and target versions:

```bash
# Check release notes via GitHub API
gh api repos/OWNER/REPO/releases --paginate --jq '.[] | select(.tag_name | test("^vMAJOR\\.")) | "## \(.tag_name)\n\(.body)\n"'
```

**Safety checklist:**
- Is this a patch/minor version bump? (lower risk)
- Are these dev-only dependencies? (won't affect shipped code)
- Are the changes bug fixes and security patches? (safe)
- Any breaking changes listed? (needs careful review)
- Is the package still targeting the same major framework version? (e.g., same react-native 0.8x)

### Step 5: Apply the Fix

**Option A: Upgrade direct dependencies (preferred)**

Update version numbers in all relevant `package.json` files:
- Root `package.json`
- Any workspace member `package.json` files (e.g., `examples/SimpleExample/package.json`)

**Option B: Add resolution/override (stopgap when direct dep hasn't released a fix)**

- Yarn: Add to `resolutions` in root `package.json`
- npm: Add to `overrides` in root `package.json`

> **Warning:** Yarn `resolutions` do NOT apply to npm `package-lock.json` files. npm `overrides` do NOT work properly inside Yarn workspace members. These are separate systems.

### Step 6: Update Lockfiles

**Yarn lockfile:**
```bash
yarn install
# Verify the diff is reasonable (not a full regeneration)
git diff --stat yarn.lock
```

**npm lockfile in a Yarn workspace member (e.g., examples/SimpleExample):**
```bash
# IMPORTANT: Must use --no-workspaces to generate lockfile in the subdirectory
cd examples/SimpleExample
rm package-lock.json
npm install --package-lock-only --legacy-peer-deps --ignore-scripts --no-workspaces
```

> **Critical:** Without `--no-workspaces`, npm will create the lockfile at the workspace root instead of in the subdirectory.

**Clean up accidental root package-lock.json:**
If the project intentionally doesn't have a root `package-lock.json` (uses Yarn), delete any accidentally created one:
```bash
rm -f /path/to/root/package-lock.json
```

### Step 7: Clean Up Stale Resolutions

If the direct dependency upgrade eliminates the vulnerable transitive dep, remove any `resolutions` or `overrides` entries that were previously added as stopgaps:

```bash
# Check if the resolution is still needed
grep "vulnerable-package" yarn.lock
# If it now resolves to a safe version through the direct dep upgrade, remove the resolution
```

### Step 8: Verify the Fix

```bash
# Confirm vulnerable version is gone from ALL lockfiles
grep "vulnerable-package" yarn.lock examples/*/package-lock.json

# Run tests
yarn test

# Run typecheck
yarn typecheck
```

### Step 9: Commit

Follow conventional commit format:
```
fix: resolve CVE-XXXX-XXXXX <package-name> <vulnerability-type>
```

## Common Pitfalls

### Yarn/npm workspace mismatch
A project can have Yarn workspaces with `yarn.lock` at the root AND `package-lock.json` files in workspace members. These are independent — fixing one doesn't fix the other. Dependabot scans both.

### Lockfile-only edits are fragile
Manually editing version numbers in `package-lock.json` can work for simple patches (4.5.3 → 4.5.4) but breaks on major version bumps or when dependency trees change. Prefer regenerating the lockfile.

### npm install creates lockfiles at wrong level
When running `npm install` inside a Yarn workspace member, npm may create the lockfile at the workspace root. Use `--no-workspaces` flag.

### Resolution overrides may mask problems
Adding `"fast-xml-parser": "^5.3.6"` to resolutions forces a major version bump that might break the consuming package. Upgrading the direct dependency is safer because the maintainer has tested compatibility.

## Decision Tree

```
CVE reported in transitive dependency
│
├─ Can the direct dependency be upgraded?
│  ├─ YES: Does the new version use a patched transitive dep?
│  │  ├─ YES → Upgrade direct dependency (BEST)
│  │  └─ NO → Add resolution/override as stopgap
│  └─ NO (no newer version exists)
│     └─ Add resolution/override as stopgap
│
├─ Is only the yarn.lock affected?
│  └─ Add to `resolutions` in root package.json, run yarn install
│
├─ Is only a package-lock.json affected?
│  └─ Add to `overrides` in relevant package.json, regenerate lockfile
│
└─ Both affected?
   └─ Fix both independently (resolutions for yarn, overrides or direct upgrade for npm)
```
