# slack-gg

A retro Windows 95-style instant messenger desktop app, built with Tauri 2.

## Tech Stack

- **Runtime:** Tauri 2 (Rust backend, macOS native webview)
- **UI:** React 19, TypeScript (strict)
- **Bundler:** Vite 7
- **Styling:** CSS Modules
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint 9, Prettier 3
- **Package Manager:** pnpm

## Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- macOS (only platform currently supported)

## Getting Started

```bash
pnpm install
pnpm tauri dev
```

First launch compiles the Rust backend (~2-3 minutes). Subsequent launches are fast.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm tauri dev` | Start development server with hot reload |
| `pnpm tauri build` | Build production app bundle |
| `pnpm test` | Run unit tests |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

## Project Structure

```
src/
├── components/
│   ├── Ad/              # Banner advertisement
│   ├── ContactList/     # Selectable contact list
│   ├── InnerWindow/     # 3D bordered container
│   ├── StatusIcon/      # Online/away status indicator
│   ├── WindowButton/    # Win95-style menu button
│   └── WindowFrame/     # Frameless window with title bar
├── assets/              # Menu icons
├── styles/
│   └── global.css       # Win95 theme, scrollbars
├── App.tsx              # Main application
└── main.tsx             # Entry point

src-tauri/               # Tauri/Rust backend
tests/                   # Vitest + React Testing Library
```

## License

MIT
