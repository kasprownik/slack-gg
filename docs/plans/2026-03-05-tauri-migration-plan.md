# Tauri Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate slack-gg from Electron 4 + React 16 + Flow + Webpack 4 to Tauri 2 + React 19 + strict TypeScript + Vite.

**Architecture:** Clean rewrite — scaffold a fresh Tauri 2 project, port Win95 UI components and styles. Single-page app, no router, no state management library. macOS only.

**Tech Stack:** Tauri 2, React 19, TypeScript (strict), Vite, CSS Modules, pnpm, Vitest + React Testing Library, Playwright

---

### Task 1: Preserve Old Source and Assets

Before deleting anything, copy the assets and CSS we need to port.

**Files:**
- Read: `app/components/` (all PNG and CSS files)
- Read: `app/containers/HomePage/` (PNG files)
- Read: `app/app.global.css`

**Step 1: Create a temporary backup of assets we'll need**

```bash
mkdir -p /tmp/slack-gg-assets/StatusIcon
mkdir -p /tmp/slack-gg-assets/WindowFrame
mkdir -p /tmp/slack-gg-assets/Ad
mkdir -p /tmp/slack-gg-assets/HomePage
cp app/components/StatusIcon/available.png /tmp/slack-gg-assets/StatusIcon/
cp app/components/StatusIcon/brb.png /tmp/slack-gg-assets/StatusIcon/
cp app/components/StatusIcon/invisible.png /tmp/slack-gg-assets/StatusIcon/
cp app/components/StatusIcon/unavailable.png /tmp/slack-gg-assets/StatusIcon/
cp app/components/WindowFrame/buttons.png /tmp/slack-gg-assets/WindowFrame/
cp app/components/WindowFrame/defaultIcon.png /tmp/slack-gg-assets/WindowFrame/
cp app/components/Ad/xteam.png /tmp/slack-gg-assets/Ad/
cp app/containers/HomePage/messagesIcon.png /tmp/slack-gg-assets/HomePage/
cp app/containers/HomePage/contactsIcon.png /tmp/slack-gg-assets/HomePage/
cp app/containers/HomePage/wwwIcon.png /tmp/slack-gg-assets/HomePage/
```

**Step 2: Verify backup**

Run: `ls -la /tmp/slack-gg-assets/**/*`
Expected: 10 PNG files across 4 directories

**Step 3: Commit current state**

No commit needed — we're on master with only package.json modified. Note: Kasper said working on master is fine.

---

### Task 2: Delete Old Codebase

Remove all old Electron/Webpack/Babel/Flow/Redux files.

**Files to delete:**
- `app/` (entire directory)
- `configs/` (Webpack configs)
- `internals/` (scripts and mocks)
- `test/` (old Jest/Enzyme/TestCafe tests)
- `flow-typed/`
- `babel.config.js`
- `.flowconfig`
- `.eslintrc`
- `.prettierrc`
- `.stylelintrc`
- `.testcafe-electron-rc`
- `.travis.yml`
- `appveyor.yml`
- `renovate.json`
- `CHANGELOG.md`
- `README.md`
- `yarn.lock`
- `node_modules/`
- `package.json`
- `.dockerignore`
- `.vscode/`
- `.github/`

**Step 1: Delete everything except git, docs, resources, and license**

```bash
rm -rf app configs internals test flow-typed node_modules .vscode .github
rm -f babel.config.js .flowconfig .eslintrc .prettierrc .stylelintrc
rm -f .testcafe-electron-rc .travis.yml appveyor.yml renovate.json
rm -f CHANGELOG.md README.md yarn.lock package.json .dockerignore
```

**Step 2: Verify only essential files remain**

Run: `ls -la`
Expected: `.git/`, `docs/`, `resources/`, `LICENSE`, `.editorconfig`, `.gitattributes`, `.gitignore`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old Electron/Webpack/Flow codebase

Preparing for Tauri 2 + React 19 + TypeScript migration."
```

---

### Task 3: Scaffold Tauri 2 Project

Create a fresh Tauri 2 + React + TypeScript + Vite project.

**Step 1: Install pnpm if not available**

```bash
which pnpm || npm install -g pnpm
```

**Step 2: Scaffold with create-tauri-app**

Run from the project root directory. We need to scaffold into a temp directory first since our directory isn't empty.

```bash
cd /tmp
pnpm create tauri-app slack-gg-new --template react-ts --manager pnpm
```

If the `--template` flag doesn't work with that exact syntax, use the interactive mode:
```bash
pnpm create tauri-app slack-gg-new
```
Choose: TypeScript / JavaScript → pnpm, UI template → React, UI flavor → TypeScript

**Step 3: Copy scaffolded files into our project**

```bash
cp -r /tmp/slack-gg-new/* /Users/kasper.wargula/dev/slack-gg/
cp /tmp/slack-gg-new/.gitignore /Users/kasper.wargula/dev/slack-gg/.gitignore
```

Be careful not to overwrite `.git/`, `docs/`, `resources/`, `LICENSE`.

**Step 4: Verify scaffold**

Run: `ls -la`
Expected: `src-tauri/`, `src/`, `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, plus our preserved files.

**Step 5: Install dependencies**

```bash
cd /Users/kasper.wargula/dev/slack-gg
pnpm install
```

**Step 6: Verify dev server starts**

```bash
pnpm tauri dev
```

Expected: A default Tauri window opens with the React template content. Close it after verifying.

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Tauri 2 + React 19 + TypeScript + Vite project"
```

---

### Task 4: Configure Tauri Window

Set up the frameless, transparent window matching the old Electron config.

**Files:**
- Modify: `src-tauri/tauri.conf.json`
- Modify: `src-tauri/Cargo.toml`

**Step 1: Update tauri.conf.json window settings**

In the `"app"` > `"windows"` array, find the default window entry and update it:

```json
{
  "app": {
    "macOSPrivateApi": true,
    "windows": [
      {
        "title": "Ja (12345)",
        "width": 245,
        "height": 550,
        "minWidth": 245,
        "minHeight": 200,
        "decorations": false,
        "transparent": true,
        "shadow": false
      }
    ]
  }
}
```

Key settings:
- `"macOSPrivateApi": true` — required for transparent windows on macOS
- `"decorations": false` — frameless window
- `"transparent": true` — transparent background
- `"shadow": false` — no window shadow (matching old Electron config)

**Step 2: Enable macOS private API feature in Cargo.toml**

In `src-tauri/Cargo.toml`, find the `[dependencies.tauri]` section and add `macos-private-api` to its features:

```toml
[dependencies.tauri]
version = "2"
features = ["macos-private-api"]
```

Or if features are listed differently, just make sure `macos-private-api` is included.

**Step 3: Verify transparent window**

Update `src/App.tsx` temporarily to have a colored background to test transparency:

```tsx
function App() {
  return <div style={{ background: 'rgba(192, 192, 192, 0.9)', width: '100%', height: '100vh' }}>Test</div>;
}
export default App;
```

Also update `src/styles.css` (or whatever the scaffold's global CSS is) to set:
```css
html, body {
  background: transparent;
  margin: 0;
  padding: 0;
}
```

Run: `pnpm tauri dev`
Expected: A frameless, transparent-background window with "Test" text. The window edges should be see-through.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure Tauri frameless transparent window for macOS"
```

---

### Task 5: Configure TypeScript Strict Mode

**Files:**
- Modify: `tsconfig.json`

**Step 1: Update tsconfig.json**

Ensure these settings are present (merge with whatever the scaffold provides):

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

**Step 2: Verify types compile**

Run: `pnpm tsc --noEmit`
Expected: No errors (or fix any scaffold-generated errors)

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: configure strict TypeScript"
```

---

### Task 6: Set Up Global Styles

Port the Win95 global CSS theme.

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/main.tsx` (import global styles)
- Modify: `index.html` (set transparent background)

**Step 1: Create global.css**

Create `src/styles/global.css` with the Win95 theme. This is a direct port from `app/app.global.css` with the addition of `background: transparent` on `html, body` for Tauri transparency:

```css
html,
body {
  margin: 0;
  padding: 0;
  background: transparent;
  overflow: hidden;
}

body {
  font-size: 11px;
  font-family: sans-serif;
  -webkit-font-smoothing: none;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

::-webkit-scrollbar-track {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFElEQVQIW2M4fPz0////GYAYyAIASnoKpV3w4kgAAAAASUVORK5CYII=');
  image-rendering: pixelated;
}
::-webkit-scrollbar-track:active {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAEElEQVQIW2No6+pjgAAgCwAWogM9VKrgGQAAAABJRU5ErkJggg==');
}

::-webkit-scrollbar-thumb {
  border-top: 1px solid #c3c7cb;
  border-left: 1px solid #c3c7cb;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  box-shadow: inset 1px 1px 0 0 white, inset -1px -1px 0 0 #868a8e;
  width: 16px;
  height: 16px;
  background-color: #c3c7cb;
  z-index: 1;
}

::-webkit-scrollbar-corner {
  background-color: #c3c7cb;
}

::-webkit-resizer {
  width: 16px;
  height: 16px;
  background-color: #c3c7cb;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAN0lEQVR4Ae3MgQUAMBRDwU5fFF05lb/CARTBw2Ulof0DxPtcwp3hNuEYnjbcEW4TjuFpwx3h9gMWGgZ2Y/PT2gAAAABJRU5ErkJggg==');
  background-position: bottom right;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

::-webkit-scrollbar-button,
::-webkit-scrollbar-button {
  border-top: 1px solid #c3c7cb;
  border-left: 1px solid #c3c7cb;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  box-shadow: inset 1px 1px 0 0 white, inset -1px -1px 0 0 #868a8e;
  display: block;
  width: 16px;
  height: 16px;
  background-color: #c3c7cb;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-position: center center;
}
::-webkit-scrollbar-button:active,
::-webkit-scrollbar-button:active {
  background-position: 2px 2px;
}
::-webkit-scrollbar-button:horizontal:decrement,
::-webkit-scrollbar-button:horizontal:decrement {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAHklEQVQY02NgoBT8xyX8H5fwf1zCpOjAYwceV1EEAAO2D/HsQ4vsAAAAAElFTkSuQmCC');
}
::-webkit-scrollbar-button:horizontal:increment,
::-webkit-scrollbar-button:horizontal:increment {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAHUlEQVQY02NgIB/8xy3xH7fEf9wS/0nUQZqrKAYAK44P8ZRmzLQAAAAASUVORK5CYII=');
}
::-webkit-scrollbar-button:vertical:decrement,
::-webkit-scrollbar-button:vertical:decrement {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGklEQVR4AWMYxuA/SYphmETFhDX9x4mHGQAAcL4P8dQiMq8AAAAASUVORK5CYII=');
}
::-webkit-scrollbar-button:vertical:increment,
::-webkit-scrollbar-button:vertical:increment {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAF0lEQVQY02NgoBf4jwJxSOHQhcNAOgMAWWAP8Rv2U3UAAAAASUVORK5CYII=');
}
::-webkit-scrollbar-button:horizontal:increment:start,
::-webkit-scrollbar-button:horizontal:increment:start {
  display: none;
}
::-webkit-scrollbar-button:horizontal:decrement:end,
::-webkit-scrollbar-button:horizontal:decrement:end {
  display: none;
}
::-webkit-scrollbar-button:vertical:increment:start,
::-webkit-scrollbar-button:vertical:increment:start {
  display: none;
}
::-webkit-scrollbar-button:vertical:decrement:end,
::-webkit-scrollbar-button:vertical:decrement:end {
  display: none;
}
::-webkit-scrollbar-button:active,
::-webkit-scrollbar-button:active {
  border-top: 1px solid #868a8e;
  border-left: 1px solid #868a8e;
  border-bottom: 1px solid #868a8e;
  border-right: 1px solid #868a8e;
  box-shadow: none;
}
```

**Step 2: Import global.css in main.tsx**

In `src/main.tsx`, ensure the global CSS is imported:

```tsx
import './styles/global.css';
```

Remove any scaffold-generated CSS imports that conflict.

**Step 3: Clean up index.html**

Ensure `index.html` does not have any background styles that override transparency. The `<body>` should be clean.

**Step 4: Commit**

```bash
git add src/styles/global.css src/main.tsx index.html
git commit -m "feat: port Win95 global CSS theme with transparent background"
```

---

### Task 7: Port StatusIcon Component

The simplest component — port it first as a foundation.

**Files:**
- Create: `src/components/StatusIcon/StatusIcon.tsx`
- Create: `src/components/StatusIcon/StatusIcon.module.css`
- Create: `src/components/StatusIcon/index.ts`
- Copy: PNG assets to `src/components/StatusIcon/`
- Test: `tests/components/StatusIcon.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/StatusIcon.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusIcon } from '../../src/components/StatusIcon';

describe('StatusIcon', () => {
  it('renders an image with the correct alt text', () => {
    render(<StatusIcon status="available" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'available');
  });

  it('renders each status variant', () => {
    const statuses = ['available', 'brb', 'invisible', 'unavailable'] as const;
    for (const status of statuses) {
      const { unmount } = render(<StatusIcon status={status} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', status);
      unmount();
    }
  });
});
```

**Step 2: Set up Vitest and React Testing Library**

Before running the test, we need testing dependencies:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add to `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Add to `tsconfig.json` compilerOptions:

```json
"types": ["vitest/globals"]
```

**Step 3: Run test to verify it fails**

Run: `pnpm vitest run tests/components/StatusIcon.test.tsx`
Expected: FAIL — module not found

**Step 4: Copy PNG assets**

```bash
mkdir -p src/components/StatusIcon
cp /tmp/slack-gg-assets/StatusIcon/*.png src/components/StatusIcon/
```

**Step 5: Create CSS module**

Create `src/components/StatusIcon/StatusIcon.module.css`:

```css
.status {
  width: 16px;
  height: 16px;
}
```

**Step 6: Write the component**

Create `src/components/StatusIcon/StatusIcon.tsx`:

```tsx
import styles from './StatusIcon.module.css';
import available from './available.png';
import brb from './brb.png';
import invisible from './invisible.png';
import unavailable from './unavailable.png';

export type ContactStatus = 'available' | 'brb' | 'invisible' | 'unavailable';

const iconPaths: Record<ContactStatus, string> = {
  available,
  brb,
  invisible,
  unavailable,
};

interface StatusIconProps {
  status: ContactStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  return (
    <img
      src={iconPaths[status]}
      alt={status}
      className={styles.status}
    />
  );
}
```

Create `src/components/StatusIcon/index.ts`:

```ts
export { StatusIcon } from './StatusIcon';
export type { ContactStatus } from './StatusIcon';
```

**Step 7: Declare PNG module for TypeScript**

Create `src/vite-env.d.ts` (or add to existing):

```ts
/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}
```

**Step 8: Run test to verify it passes**

Run: `pnpm vitest run tests/components/StatusIcon.test.tsx`
Expected: PASS

**Step 9: Commit**

```bash
git add src/components/StatusIcon/ tests/components/StatusIcon.test.tsx tests/setup.ts src/vite-env.d.ts vite.config.ts
git commit -m "feat: port StatusIcon component with tests"
```

---

### Task 8: Port WindowButton Component

**Files:**
- Create: `src/components/WindowButton/WindowButton.tsx`
- Create: `src/components/WindowButton/WindowButton.module.css`
- Create: `src/components/WindowButton/index.ts`
- Test: `tests/components/WindowButton.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/WindowButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WindowButton } from '../../src/components/WindowButton';

describe('WindowButton', () => {
  it('renders children', () => {
    render(<WindowButton>Messages</WindowButton>);
    expect(screen.getByRole('button', { name: 'Messages' })).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<WindowButton size="small">Test</WindowButton>);
    const button = screen.getByRole('button', { name: 'Test' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<WindowButton onClick={handleClick}>Click Me</WindowButton>);
    await user.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/WindowButton.test.tsx`
Expected: FAIL

**Step 3: Create CSS module**

Create `src/components/WindowButton/WindowButton.module.css`:

```css
.menuItem {
  background: none;
  outline: none;
  border: 1px solid transparent;
  display: inline-block;
  font-size: 11px;
  padding: 1px 9px 2px 2px;
  user-select: none;
  margin: -1px 0 0 -2px;
}

.small {
  font-size: 9px;
  padding-right: 2px;
  padding-bottom: 0;
}

.menuItem:hover,
.menuItem:active {
  color: #00f;
}

.menuItem:hover {
  border-color: #fff;
  border-bottom-color: #808080;
  border-right-color: #808080;
}

.menuItem:active {
  border-color: #808080;
  border-bottom-color: #fff;
  border-right-color: #fff;
}

.menuItem::first-letter {
  text-decoration: underline;
}

.menuItem img {
  display: block;
  margin: 2px auto;
  height: 17px;
}
```

**Step 4: Write the component**

Create `src/components/WindowButton/WindowButton.tsx`:

```tsx
import type { ReactNode } from 'react';
import styles from './WindowButton.module.css';

interface WindowButtonProps {
  children: ReactNode;
  size?: 'default' | 'small';
  onClick?: () => void;
}

export function WindowButton({ children, size = 'default', onClick }: WindowButtonProps) {
  const className = [
    styles.menuItem,
    size === 'small' ? styles.small : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={className} onClick={onClick} type="button">
      {children}
    </button>
  );
}
```

Create `src/components/WindowButton/index.ts`:

```ts
export { WindowButton } from './WindowButton';
```

**Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/components/WindowButton.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/WindowButton/ tests/components/WindowButton.test.tsx
git commit -m "feat: port WindowButton component with tests"
```

---

### Task 9: Port InnerWindow Component

**Files:**
- Create: `src/components/InnerWindow/InnerWindow.tsx`
- Create: `src/components/InnerWindow/InnerWindow.module.css`
- Create: `src/components/InnerWindow/index.ts`
- Test: `tests/components/InnerWindow.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/InnerWindow.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InnerWindow } from '../../src/components/InnerWindow';

describe('InnerWindow', () => {
  it('renders children', () => {
    render(<InnerWindow>Hello</InnerWindow>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders with raised variant', () => {
    const { container } = render(<InnerWindow raised>Content</InnerWindow>);
    const outerFrame = container.firstChild as HTMLElement;
    expect(outerFrame.className).toContain('raised');
  });

  it('renders with mergeDown variant', () => {
    const { container } = render(<InnerWindow mergeDown>Content</InnerWindow>);
    const outerFrame = container.firstChild as HTMLElement;
    expect(outerFrame.className).toContain('mergeDown');
  });

  it('renders with fill variant', () => {
    const { container } = render(<InnerWindow fill>Content</InnerWindow>);
    const outerFrame = container.firstChild as HTMLElement;
    expect(outerFrame.className).toContain('fill');
  });

  it('renders with compact variant', () => {
    const { container } = render(<InnerWindow compact>Content</InnerWindow>);
    const innerFrame = container.querySelector('[class*="innerFrame"]') as HTMLElement;
    expect(innerFrame.className).toContain('compact');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/InnerWindow.test.tsx`
Expected: FAIL

**Step 3: Create CSS module**

Create `src/components/InnerWindow/InnerWindow.module.css`:

```css
.outerFrame {
  border: 1px solid #808080;
  border-right-color: #fff;
  border-bottom-color: #fff;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
}

.raised {
  border: 1px solid #fff;
  border-right-color: #808080;
  border-bottom-color: #808080;
}

.fill {
  flex: 1;
}

.innerFrame {
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  border-right-color: #c0c0c0;
  border-bottom-color: #c0c0c0;
  flex: 1;
  background: #ff8041;
  padding: 2px;
  overflow: auto;
}

.raised .innerFrame {
  border: 1px solid #c0c0c0;
  border-right-color: #000;
  border-bottom-color: #000;
}

.compact {
  padding: 0;
}

.mergeDown {
  margin-bottom: -4px;
}
```

**Step 4: Write the component**

Create `src/components/InnerWindow/InnerWindow.tsx`:

```tsx
import type { ReactNode } from 'react';
import styles from './InnerWindow.module.css';

interface InnerWindowProps {
  children: ReactNode;
  compact?: boolean;
  raised?: boolean;
  mergeDown?: boolean;
  fill?: boolean;
}

export function InnerWindow({ children, compact, raised, mergeDown, fill }: InnerWindowProps) {
  const outerClassName = [
    styles.outerFrame,
    fill ? styles.fill : '',
    raised ? styles.raised : '',
    mergeDown ? styles.mergeDown : '',
  ].filter(Boolean).join(' ');

  const innerClassName = [
    styles.innerFrame,
    compact ? styles.compact : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
```

Create `src/components/InnerWindow/index.ts`:

```ts
export { InnerWindow } from './InnerWindow';
```

**Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/components/InnerWindow.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/InnerWindow/ tests/components/InnerWindow.test.tsx
git commit -m "feat: port InnerWindow component with tests"
```

---

### Task 10: Port Ad Component

**Files:**
- Create: `src/components/Ad/Ad.tsx`
- Create: `src/components/Ad/Ad.module.css`
- Create: `src/components/Ad/index.ts`
- Copy: `xteam.png` asset
- Test: `tests/components/Ad.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/Ad.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ad } from '../../src/components/Ad';

describe('Ad', () => {
  it('renders an image', () => {
    render(<Ad />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/Ad.test.tsx`
Expected: FAIL

**Step 3: Copy asset and create files**

```bash
mkdir -p src/components/Ad
cp /tmp/slack-gg-assets/Ad/xteam.png src/components/Ad/
```

Create `src/components/Ad/Ad.module.css`:

```css
.ad {
  margin: 2px auto 0;
  user-select: none;
  cursor: pointer;
  height: 33px;
  width: 221px;
}
```

**Step 4: Write the component**

Create `src/components/Ad/Ad.tsx`:

```tsx
import styles from './Ad.module.css';
import xteam from './xteam.png';

export function Ad() {
  return <img src={xteam} className={styles.ad} alt="Advertisement" />;
}
```

Create `src/components/Ad/index.ts`:

```ts
export { Ad } from './Ad';
```

**Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/components/Ad.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Ad/ tests/components/Ad.test.tsx
git commit -m "feat: port Ad component with tests"
```

---

### Task 11: Port ContactList Component

**Files:**
- Create: `src/components/ContactList/ContactList.tsx`
- Create: `src/components/ContactList/ContactList.module.css`
- Create: `src/components/ContactList/index.ts`
- Test: `tests/components/ContactList.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/ContactList.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactList } from '../../src/components/ContactList';

const contacts = [
  { status: 'available' as const, name: 'Alice', id: '111' },
  { status: 'brb' as const, name: 'Bob', id: '222' },
  { status: 'unavailable' as const, name: 'Charlie', id: '333' },
];

describe('ContactList', () => {
  it('renders all contacts', () => {
    render(<ContactList contacts={contacts} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders a status icon for each contact', () => {
    render(<ContactList contacts={contacts} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('highlights selected contact on click', async () => {
    const user = userEvent.setup();
    render(<ContactList contacts={contacts} />);
    const alice = screen.getByText('Alice').closest('[class*="listItem"]') as HTMLElement;
    await user.click(alice);
    expect(alice.className).toContain('selected');
  });

  it('shows contact ID when selected', async () => {
    const user = userEvent.setup();
    render(<ContactList contacts={contacts} />);
    await user.click(screen.getByText('Alice'));
    expect(screen.getByText('111')).toBeInTheDocument();
  });

  it('deselects previous contact when new one is clicked', async () => {
    const user = userEvent.setup();
    render(<ContactList contacts={contacts} />);
    await user.click(screen.getByText('Alice'));
    await user.click(screen.getByText('Bob'));
    const alice = screen.getByText('Alice').closest('[class*="listItem"]') as HTMLElement;
    const bob = screen.getByText('Bob').closest('[class*="listItem"]') as HTMLElement;
    expect(alice.className).not.toContain('selected');
    expect(bob.className).toContain('selected');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/ContactList.test.tsx`
Expected: FAIL

**Step 3: Create CSS module**

Create `src/components/ContactList/ContactList.module.css`:

```css
.container {
  background: #ffff9c;
  flex: 1;
  overflow: auto;
}

.listItem {
  display: flex;
  align-items: center;
  font-size: 11px;
  height: 18px;
  font-weight: 800;
  padding: 1px 2px;
  cursor: default;
  user-select: none;
}

.selected {
  background: #07216c;
  color: #fff;
}

.name {
  padding-left: 3px;
}

.contactInfo {
  display: flex;
  background: #f7f7d9;
  padding: 3px;
  border-top: 1px solid #a0a0a0;
}

.contactInfo > * {
  flex: 1;
}
```

**Step 4: Write the component**

Create `src/components/ContactList/ContactList.tsx`:

```tsx
import { useState } from 'react';
import type { ContactStatus } from '../StatusIcon';
import { StatusIcon } from '../StatusIcon';
import { InnerWindow } from '../InnerWindow';
import styles from './ContactList.module.css';

export interface Contact {
  status: ContactStatus;
  name: string;
  id: string;
}

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedContact = selectedIndex !== null ? contacts[selectedIndex] : undefined;

  return (
    <InnerWindow compact fill>
      <div className={styles.container}>
        {contacts.map((contact, index) => {
          const isSelected = selectedIndex === index;
          const className = [
            styles.listItem,
            isSelected ? styles.selected : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={`${contact.id}-${index}`}
              className={className}
              onClick={() => setSelectedIndex(index)}
            >
              <StatusIcon status={contact.status} />
              <div className={styles.name}>{contact.name}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.contactInfo}>
        <div>
          {selectedContact !== undefined ? (
            <>ID {selectedContact.id}</>
          ) : (
            <>ID</>
          )}
        </div>
        <div>tel</div>
      </div>
    </InnerWindow>
  );
}
```

Create `src/components/ContactList/index.ts`:

```ts
export { ContactList } from './ContactList';
export type { Contact } from './ContactList';
```

**Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/components/ContactList.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/ContactList/ tests/components/ContactList.test.tsx
git commit -m "feat: port ContactList component with tests"
```

---

### Task 12: Port WindowFrame Component

This is the most complex component — it wraps the entire app and provides the title bar with Tauri window controls.

**Files:**
- Create: `src/components/WindowFrame/WindowFrame.tsx`
- Create: `src/components/WindowFrame/WindowFrame.module.css`
- Create: `src/components/WindowFrame/index.ts`
- Copy: `buttons.png` asset
- Test: `tests/components/WindowFrame.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/WindowFrame.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WindowFrame } from '../../src/components/WindowFrame';

// Mock Tauri window API
const mockMinimize = vi.fn();
const mockToggleMaximize = vi.fn();
const mockClose = vi.fn();

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({
    minimize: mockMinimize,
    toggleMaximize: mockToggleMaximize,
    close: mockClose,
  }),
}));

describe('WindowFrame', () => {
  it('renders the title', () => {
    render(<WindowFrame title="Test Window">Content</WindowFrame>);
    expect(screen.getByText('Test Window')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<WindowFrame title="Test">Hello World</WindowFrame>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders minimize button when minimizable', () => {
    render(<WindowFrame title="Test" minimizable>Content</WindowFrame>);
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument();
  });

  it('does not render minimize button by default', () => {
    render(<WindowFrame title="Test">Content</WindowFrame>);
    expect(screen.queryByLabelText('Minimize')).not.toBeInTheDocument();
  });

  it('renders maximize button when maximizable', () => {
    render(<WindowFrame title="Test" maximizable>Content</WindowFrame>);
    expect(screen.getByLabelText('Maximize')).toBeInTheDocument();
  });

  it('always renders close button', () => {
    render(<WindowFrame title="Test">Content</WindowFrame>);
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('calls Tauri minimize on minimize click', async () => {
    const user = userEvent.setup();
    render(<WindowFrame title="Test" minimizable>Content</WindowFrame>);
    await user.click(screen.getByLabelText('Minimize'));
    expect(mockMinimize).toHaveBeenCalledOnce();
  });

  it('calls Tauri close on close click', async () => {
    const user = userEvent.setup();
    render(<WindowFrame title="Test">Content</WindowFrame>);
    await user.click(screen.getByLabelText('Close'));
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it('calls Tauri toggleMaximize on maximize click', async () => {
    const user = userEvent.setup();
    render(<WindowFrame title="Test" maximizable>Content</WindowFrame>);
    await user.click(screen.getByLabelText('Maximize'));
    expect(mockToggleMaximize).toHaveBeenCalledOnce();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/WindowFrame.test.tsx`
Expected: FAIL

**Step 3: Copy asset**

```bash
mkdir -p src/components/WindowFrame
cp /tmp/slack-gg-assets/WindowFrame/buttons.png src/components/WindowFrame/
```

**Step 4: Create CSS module**

Create `src/components/WindowFrame/WindowFrame.module.css`:

```css
.mainContainer {
  border: 1px solid #c0c0c0;
  border-right-color: #000;
  border-bottom-color: #000;
  position: absolute;
  background: #c0c0c0;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.mainInnerContainer {
  border: 1px solid #fff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  flex: 1;
  padding: 2px;
  display: flex;
  flex-direction: column;
}

.titleBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 18px;
  background: #000080;
  padding: 2px;
  user-select: none;
}

.title {
  font-family: sans-serif;
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  padding: 0 4px;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.buttons {
  display: flex;
}

.button {
  background: url('./buttons.png');
  background-repeat: no-repeat;
  background-size: 50px;
  height: 14px;
  width: 16px;
  padding: 0;
  border: none;
  outline: none;
  cursor: pointer;
}

.minimizeButton {
  composes: button;
  background-position: 0 0;
}

.maximizeButton {
  composes: button;
  background-position: -16px 0;
}

.closeButton {
  composes: button;
  margin-left: 2px;
  background-position: -33px 0;
}

.minimizeButton:active {
  background-position: 0 -43px;
}

.maximizeButton:active {
  background-position: -16px -29px;
}

.closeButton:active {
  background-position: -33px -14px;
}
```

**Step 5: Write the component**

Create `src/components/WindowFrame/WindowFrame.tsx`:

```tsx
import type { ReactNode } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { InnerWindow } from '../InnerWindow';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  children: ReactNode;
  title: string;
  minimizable?: boolean;
  maximizable?: boolean;
}

export function WindowFrame({ children, title, minimizable, maximizable }: WindowFrameProps) {
  const appWindow = getCurrentWindow();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainInnerContainer}>
        <div className={styles.titleBar} data-tauri-drag-region>
          <div className={styles.title}>{title}</div>
          <div className={styles.buttons}>
            {minimizable && (
              <button
                className={styles.minimizeButton}
                aria-label="Minimize"
                onClick={() => appWindow.minimize()}
              />
            )}
            {maximizable && (
              <button
                className={styles.maximizeButton}
                aria-label="Maximize"
                onClick={() => appWindow.toggleMaximize()}
              />
            )}
            <button
              className={styles.closeButton}
              aria-label="Close"
              onClick={() => appWindow.close()}
            />
          </div>
        </div>
        <InnerWindow fill>{children}</InnerWindow>
      </div>
    </div>
  );
}
```

Create `src/components/WindowFrame/index.ts`:

```ts
export { WindowFrame } from './WindowFrame';
```

**Step 6: Run test to verify it passes**

Run: `pnpm vitest run tests/components/WindowFrame.test.tsx`
Expected: PASS

**Step 7: Commit**

```bash
git add src/components/WindowFrame/ tests/components/WindowFrame.test.tsx
git commit -m "feat: port WindowFrame component with Tauri window controls"
```

---

### Task 13: Build the App (HomePage)

Wire everything together into the main App component.

**Files:**
- Modify: `src/App.tsx`
- Copy: HomePage PNG assets to `src/assets/`
- Test: `tests/components/App.test.tsx`

**Step 1: Write the failing test**

Create `tests/components/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../src/App';

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({
    minimize: vi.fn(),
    toggleMaximize: vi.fn(),
    close: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders the window frame with title', () => {
    render(<App />);
    expect(screen.getByText('Ja (12345)')).toBeInTheDocument();
  });

  it('renders the Slaku-Slaku button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Slaku-Slaku' })).toBeInTheDocument();
  });

  it('renders menu buttons', () => {
    render(<App />);
    expect(screen.getByText(/Wiadomości/)).toBeInTheDocument();
    expect(screen.getByText(/Kontakty/)).toBeInTheDocument();
    expect(screen.getByText(/Strona WWW/)).toBeInTheDocument();
  });

  it('renders the contact list', () => {
    render(<App />);
    // All contacts are named "Kasper" in the original
    const kaspers = screen.getAllByText('Kasper');
    expect(kaspers.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/App.test.tsx`
Expected: FAIL

**Step 3: Copy HomePage assets**

```bash
mkdir -p src/assets
cp /tmp/slack-gg-assets/HomePage/messagesIcon.png src/assets/
cp /tmp/slack-gg-assets/HomePage/contactsIcon.png src/assets/
cp /tmp/slack-gg-assets/HomePage/wwwIcon.png src/assets/
```

**Step 4: Write the App component**

Overwrite `src/App.tsx`:

```tsx
import { WindowFrame } from './components/WindowFrame';
import { WindowButton } from './components/WindowButton';
import { InnerWindow } from './components/InnerWindow';
import { ContactList } from './components/ContactList';
import type { Contact } from './components/ContactList';
import { Ad } from './components/Ad';
import messagesIcon from './assets/messagesIcon.png';
import contactsIcon from './assets/contactsIcon.png';
import wwwIcon from './assets/wwwIcon.png';

const contacts: Contact[] = [
  { status: 'available', name: 'Kasper', id: '12345' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
];

export default function App() {
  return (
    <WindowFrame title="Ja (12345)">
      <div>
        <WindowButton>Slaku-Slaku</WindowButton>
      </div>
      <InnerWindow raised mergeDown>
        <div>
          <WindowButton size="small">
            <img src={messagesIcon} alt="" /> Wiadomości
          </WindowButton>
          <WindowButton size="small">
            <img src={contactsIcon} alt="" /> Kontakty
          </WindowButton>
          <WindowButton size="small">
            <img src={wwwIcon} alt="" /> Strona WWW
          </WindowButton>
        </div>
        <Ad />
      </InnerWindow>
      <ContactList contacts={contacts} />
    </WindowFrame>
  );
}
```

**Step 5: Clean up main.tsx**

Ensure `src/main.tsx` is clean:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**Step 6: Run test to verify it passes**

Run: `pnpm vitest run tests/components/App.test.tsx`
Expected: PASS

**Step 7: Run all tests**

Run: `pnpm vitest run`
Expected: All tests pass

**Step 8: Commit**

```bash
git add src/App.tsx src/main.tsx src/assets/ tests/components/App.test.tsx
git commit -m "feat: wire up App with all components matching original HomePage"
```

---

### Task 14: Clean Up Scaffold Remnants

Remove any leftover scaffold files we don't need.

**Step 1: Remove scaffold CSS and assets**

Look for and delete any scaffold-generated files we haven't touched:
- `src/App.css` (if it exists — we use App.tsx directly, no CSS module for it)
- `src/styles.css` or `src/index.css` (replaced by our global.css)
- Any scaffold logos or SVGs (e.g. `src/assets/react.svg`, `src/logo.svg`)

```bash
# Check what scaffold files exist and remove ones we don't need
ls src/
# Remove as appropriate, e.g.:
rm -f src/App.css src/index.css src/assets/react.svg
```

**Step 2: Verify the app still compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove scaffold remnants"
```

---

### Task 15: Set Up ESLint 9 + Prettier

**Files:**
- Create: `eslint.config.js`
- Create: `.prettierrc`
- Modify: `package.json` (add lint scripts)

**Step 1: Install ESLint and Prettier**

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier
```

**Step 2: Create eslint.config.js**

Create `eslint.config.js`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'src-tauri'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettier,
);
```

**Step 3: Create .prettierrc**

Create `.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

**Step 4: Add lint scripts to package.json**

Add to `"scripts"` in `package.json`:

```json
"lint": "eslint src/",
"lint:fix": "eslint src/ --fix",
"format": "prettier --write 'src/**/*.{ts,tsx,css}'",
"typecheck": "tsc --noEmit"
```

**Step 5: Run lint and fix any issues**

Run: `pnpm lint`
Expected: Fix any issues that arise.

Run: `pnpm typecheck`
Expected: No errors.

**Step 6: Commit**

```bash
git add eslint.config.js .prettierrc package.json pnpm-lock.yaml
git commit -m "chore: configure ESLint 9 + Prettier"
```

---

### Task 16: Visual Verification

**Step 1: Run the app**

```bash
pnpm tauri dev
```

**Step 2: Visually verify**

Check that:
- Window is frameless and transparent at the edges
- Title bar shows "Ja (12345)" in white on dark blue
- Close button is visible and works
- "Slaku-Slaku" button is rendered
- Menu bar has Wiadomości, Kontakty, Strona WWW with icons
- Ad banner is displayed
- Contact list is scrollable with yellow background
- Clicking a contact highlights it in dark blue
- Win95-style scrollbar is visible when list overflows
- 3D beveled borders throughout match the original look

**Step 3: Fix any visual issues found**

Compare side-by-side with original if possible.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual adjustments after migration verification"
```

---

### Task 17: Run Full Test Suite and Type Check

**Step 1: Run all tests**

```bash
pnpm vitest run
```

Expected: All tests pass.

**Step 2: Run type check**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

**Step 3: Run lint**

```bash
pnpm lint
```

Expected: No errors.

---

### Task 18: Clean Up Temporary Files

**Step 1: Remove temp backup**

```bash
rm -rf /tmp/slack-gg-assets /tmp/slack-gg-new
```

**Step 2: Update .gitignore**

Ensure `.gitignore` includes at minimum:

```
node_modules/
dist/
src-tauri/target/
```

Check the scaffold-generated `.gitignore` and verify it's appropriate.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete Tauri 2 migration - clean up"
```
