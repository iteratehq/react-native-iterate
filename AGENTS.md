# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

React Native SDK for [Iterate](https://iteratehq.com) — an in-app survey platform. The SDK sends events to the Iterate API, which returns surveys matching targeting rules. Surveys are rendered in a WebView modal; an optional native prompt card can appear first to invite the user.

## Commands

```bash
yarn install          # Install dependencies (yarn workspaces, not npm)
yarn test             # Run Jest tests (react-native preset)
yarn test --watch     # Run tests in watch mode
yarn lint             # ESLint
yarn lint --fix       # Auto-fix lint errors
yarn typecheck        # TypeScript (strict mode, noEmit)
yarn prepare          # Build library via react-native-builder-bob → lib/
yarn release          # Publish via release-it (bumps version, tags, npm publish, GitHub release)
```

Node >= 20 required (see `.nvmrc`). Use Yarn (v3.6.1, workspaces enabled) — npm will not work.

## Architecture

**Singleton pattern**: `src/iterate.tsx` exports `new Iterate()` — a single class instance that holds SDK state. All public API methods (`init`, `sendEvent`, `identify`, `preview`, `reset`, `onResponse`, `onEvent`) live on this singleton.

**State management**: Redux store (`src/redux.tsx`) with a flat `State` type. Components connect via `react-redux` `connect()` (not hooks). The store is created at module level in `iterate.tsx` and provided via `<Provider>` inside `IterateProvider`.

**Lazy initialization**: `init()` is synchronous and minimal (stores apiKey, sets providers). Heavier async work (reading auth tokens and user traits from storage) is deferred to `initSendEvent()` / `initIdentify()`, which run once on first call.

**Key data flow**:
1. `init()` → sets apiKey, storage provider, safe area provider
2. `sendEvent(name)` → `initSendEvent()` (lazy) → `api.embed(context)` → API returns survey → dispatch `showPrompt` or `showSurvey`
3. `PromptOrSurvey` component (connected to Redux) renders either `Prompt` (native bottom sheet) or `Survey` (WebView modal)
4. Survey WebView communicates back via `postMessage` → `onMessage` handler processes close/response/progress/survey-complete events

**Provider pattern for pluggable dependencies**: Storage, SafeArea, and Markdown each use a singleton wrapper (`src/storage.tsx`, `src/safearea.tsx`, `src/markdown.tsx`) with a `.provider` property set during `init()`. This lets consumers inject their own implementations (e.g., encrypted storage, safe area insets).

**File layout**:
- `src/iterate.tsx` — Singleton SDK class, Redux store creation
- `src/redux.tsx` — Redux state, actions, reducer (all in one file)
- `src/api.tsx` — HTTP client (`fetch`-based, Bearer token auth against `iteratehq.com/api/v1`)
- `src/types.tsx` — All TypeScript types (API types, component props, event types)
- `src/interaction-events.tsx` — Event callback system (`onResponse`, `onEvent`)
- `src/constants.tsx` — Version string, API host, colors, themes, trigger types
- `src/components/IterateProvider.tsx` — Top-level provider wrapping children with Redux Provider + PromptOrSurvey
- `src/components/PromptOrSurvey.tsx` — Connected component that decides whether to show Prompt or Survey
- `src/components/Prompt/` — Native animated bottom sheet prompt card with swipe-to-dismiss
- `src/components/Survey.tsx` — WebView-based survey modal with theme support

## Build Output

`yarn prepare` (bob build) outputs to `lib/` with three targets: `commonjs`, `module`, `typescript`. The `lib/` directory is gitignored but included in the npm package.

## Conventions

- **Conventional commits** enforced by commitlint pre-commit hook: `fix:`, `feat:`, `refactor:`, `docs:`, `test:`, `chore:`
- **Pre-commit hooks** via lefthook: runs ESLint and TypeScript type checking on changed files. Lefthook uses `@{push}` to determine changed files, so commits will fail on new branches without an upstream. Push the branch first (`git push -u origin <branch>`) before committing.
- **Strict TypeScript**: `strict: true`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`
- **Version constant**: `src/constants.tsx` has a `Version` string that must match `package.json` version — update both when bumping
- **Peer dependencies**: `react`, `react-native`, `react-native-webview`, `react-native-safe-area-context` are peers (not bundled)
- **Storage keys** are prefixed with `com.iteratehq.` and values are JSON-wrapped as `{ value: ... }`
- **Pull requests**: Don't include "Generated with Claude Code" in PR descriptions. Keep test plans minimal — only include verification steps for non-obvious or risky changes, not routine checkboxes.
- **Fixing CVEs**: When fixing a CVE in a dependency, consider both approaches: (1) adding a `resolutions` override in `package.json` to force a patched version, and (2) upgrading the underlying direct dependency that pulls in the vulnerable transitive dependency. Prefer upgrading the direct dependency when possible; use resolutions as a stopgap when the direct dependency hasn't released a fix yet.
