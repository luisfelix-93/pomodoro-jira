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

## Phase 9: Focus Mode Implementation
- [x] Implement State Management for Focus Mode (`timerMode` in Zustand)
- [x] Update Timer logic for incremental counting
- [x] Add Mode Selector UI (Pomodoro vs Focus)
- [x] Format time display to handle hours (`HH:MM:SS`)
- [x] Implement 1-hour activity notification
- [x] Enforce 8-hour maximum limit and auto-pause
- [x] Integrate Focus Mode duration with Jira worklog submission

## Phase 10: History Calendar Refactoring
- [ ] Implement month navigation controls
- [ ] Create `CalendarGrid` and `DayCell` components
- [ ] Add monthly summary metrics (Total, Average, Best Day)
- [ ] Implement `DailyLogsDrawer` for day details
- [ ] Update `LogLedger.tsx` to use the new calendar view
- [ ] Refactor Zustand store to fetch and cache worklogs monthly

## Phase 11: Jira OAuth & Runtime Config
- [x] Create `public/config.json` and `public/config.example.json`
- [x] Modify `src/main.tsx` to fetch configuration before React render
- [x] Create `src/config/runtimeConfig.ts` singleton
- [x] Create `src/auth/jiraAuth.ts` (auth utility — authorize URL + server proxy)
- [x] Add `POST /api/auth/exchange` endpoint on server (token proxy with `client_secret`)
- [x] Rewrite `src/pages/CallbackPage.tsx` (extracts code → calls server)
- [x] Update `src/pages/LoginGate.tsx` (uses `redirectToLogin()`)
- [x] Remove `JiraAuthProvider` wrapper from `App.tsx`
- [x] Fix `DATABASE_URL` in GitHub Actions `release.yml` pipeline
- [x] Remove `react-oidc-context` from `package.json` (`npm uninstall react-oidc-context`)
- [x] Delete deprecated `src/auth/JiraAuthProvider.tsx`

