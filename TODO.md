# Setup Todo List

## Phase 1: Repository Initialization
- [x] Initialize Git repository
- [x] Create `.gitignore` (Node, Mac, Windows, Electron)
- [x] Configure `package.json` basics (name, version, license)
- [x] Install dev dependencies:
    - [x] `concurrently` (to run electron + react + express)
    - [x] `wait-on`
    - [x] `cross-env`
    - [x] `electron`
    - [x] `electron-builder`

## Phase 2: React Frontend Setup (Vite)
- [x] Initialize Vite project (`npm create vite@latest . -- --template react-ts`)
- [x] Update `vite.config.ts` for Electron compatibility (base path, outDir)
- [x] Install UI dependencies:
    - [x] `tailwindcss` + `@tailwindcss/postcss`
    - [x] `lucide-react` (icons)
    - [x] `react-router-dom`
    - [x] `zustand` (state management)
    - [x] `date-fns`

## Phase 3: Backend Setup (Express + SQLite)
- [x] Create `server/` directory structure
- [x] Initialize `server/package.json`
- [x] Install Backend dependencies:
    - [x] `express`
    - [x] `sqlite3`
    - [x] `sequelize` or `knex` (or raw `sqlite` driver)
    - [x] `axios` (for Jira API)
    - [x] `cors`
- [x] Configure TypeScript for backend (`tsconfig.server.json`)

## Phase 4: Electron Integration
- [x] Create `electron/main.ts` (Main Process)
- [x] Create `electron/preload.ts` (Context Bridge)
- [x] Configure `electron-builder.yml`
- [x] Create script to spawn Express server as a child process of Electron

## Phase 5: Developer Experience
- [x] Configure ESLint + Prettier
- [x] Set up `npm run dev` command to launch everything

## Phase 6: UI Design Implementation (StitchMCP)
- [x] Implement Design System (Theme, Colors, Typography)
- [x] Create Core Components:
    - [x] `GlassPanel` & `StarField` Background
    - [x] `OrbitButton` & `TimerRing`
- [x] Develop Screens:
    - [x] Login Gate (Jira Auth)
    - [x] Task Orbit (Dashboard & Task List)
    - [x] Focus Void (Active Timer & Mini-mode)
    - [x] Notation Modal (Memo & Auto-pause)

    - [x] Log Ledger (Calendar & Sync)

## Phase 7: Frontend Logic & Integration
- [x] Setup Stores (Zustand):
    - [x] AuthStore (Jira Credentials)
    - [x] TaskStore (Issues & Drafts)
    - [x] TimerStore (Pomodoro Logic)
- [x] Implement Services:
    - [x] Jira API Client
    - [x] Timer Hook (`usePomodoro`)
- [x] Feature Integration:
    - [x] Wire up Login Screen
    - [x] Wire up Task List (JQL Fetch)
    - [x] Wire up Active Timer (FocusVoid)
    - [x] Wire up Ledger & Sync

## Phase 8: Persistence & History Integration
- [x] Update Jira Service for Worklogs
- [x] Integrate FocusVoid (Save Worklog)
- [x] Integrate LogLedger (View History)
- [x] Verify End-to-End Flow

