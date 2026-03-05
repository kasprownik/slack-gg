# Tauri Migration Design

Migrate slack-gg from Electron 4 + React 16 + Flow + Webpack 4 to Tauri 2 + React 19 + strict TypeScript + Vite.

## Approach

Clean rewrite. Scaffold a fresh Tauri 2 + Vite + React 19 project, then port the Win95 UI components and styles from the old codebase. The app's custom logic is small enough that incremental migration would create more work than starting fresh.

## Target Stack

| Layer | Old | New |
|-------|-----|-----|
| Runtime | Electron 4 | Tauri 2 |
| UI | React 16 + Flow | React 19 + strict TypeScript |
| State | Redux + thunks + connected-react-router | React useState (no library) |
| Bundler | Webpack 4 + Babel | Vite |
| Styling | CSS Modules + node-sass | CSS Modules (plain CSS, Vite built-in) |
| Testing | Jest + Enzyme + Sinon + TestCafe | Vitest + React Testing Library + Playwright |
| Linting | ESLint 5 + Prettier 1 + Flow | ESLint 9 flat config + @typescript-eslint + Prettier 3 |
| Package manager | Yarn 1 | pnpm |
| Platform | macOS, Windows, Linux | macOS only |

## Project Structure

```
slack-gg/
├── src-tauri/          # Tauri/Rust backend
├── src/
│   ├── main.tsx        # React entry point
│   ├── App.tsx         # Root component
│   ├── components/
│   │   ├── WindowFrame/
│   │   ├── WindowButton/
│   │   ├── InnerWindow/
│   │   ├── ContactList/
│   │   ├── StatusIcon/
│   │   └── Ad/
│   ├── assets/
│   └── styles/
│       └── global.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── tests/
    ├── components/
    └── e2e/
```

## Components

All ported as typed functional components. No new components — faithful TypeScript ports of existing ones.

- **WindowFrame** — Outer window shell. Draggable title bar, window controls via Tauri `appWindow` API. Drag via `data-tauri-drag-region`.
- **WindowButton** — Reusable button with default/small size variants.
- **InnerWindow** — Container with 3D inset/outset borders. `raised` and `mergeDown` variants.
- **ContactList** — Scrollable list of hardcoded contacts. Selection via useState.
- **StatusIcon** — 16x16px PNG status indicator.
- **Ad** — Banner in the menu area.

Counter page is dropped (boilerplate, no app value).

## Styling

CSS Modules (`.module.css`) colocated with components. One `global.css` for:
- Win95 base theme (#c3c7cb, fonts, box-sizing)
- Custom pixel-art scrollbars (data URIs)
- Shared 3D border utilities

No preprocessor, no Tailwind, no CSS-in-JS. The Win95 aesthetic is preserved as-is.

## Tauri Window Config

In `tauri.conf.json`:
- `decorations: false` (frameless)
- `transparent: true`
- `shadow: false`
- `width: 245, height: 550`
- `minWidth: 245, minHeight: 200`

## Testing

**Vitest + React Testing Library:**
- ContactList — renders contacts, selection works
- WindowFrame — renders title, control buttons trigger Tauri API (mocked)
- WindowButton — size variants, click handler
- StatusIcon — correct icon per status
- InnerWindow — children with variant styles

**Playwright:**
- App launches and renders contact list
- Window controls work
- Contact selection highlights
- Scrolling works

## Tooling

- ESLint 9 flat config, `@typescript-eslint`, strict, no `any`
- Prettier 3
- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`
- pnpm with `strict-peer-dependencies=true`

## Files to Delete

Everything from the old setup:
- `configs/` (Webpack)
- `babel.config.js`
- `.flowconfig`, `flow-typed/`
- Old `.eslintrc`, `.prettierrc`, `.stylelintrc`
- `app/` (entire old source)
- `internals/`
- `.travis.yml`, `appveyor.yml`
- `.testcafe-electron-rc`
- `test/` (old tests)
- `yarn.lock`
- `renovate.json`
