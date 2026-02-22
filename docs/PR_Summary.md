## PR Summary: Pomodoro Timer Enhancements 🚀

This PR introduces major enhancements to the task management and timer experience, specifically aimed at improving focus, tracking accuracy, and application usability. These updates include the much-anticipated Extended Focus Mode ("Modo de Foco Prolongado") and a new Mini Timer for a less intrusive desktop experience.

### Key Features & Updates ✨

- **Extended Focus Mode (Focus Void):** Introduced a new chronological stopwatch mode in `FocusVoid.tsx` tailored for uninterrupted, open-ended work sessions, bypassing the standard Pomodoro countdown logic.
- **Mini Timer Window:** Added a minimalist `MiniTimer.tsx` floating window for electron, allowing users to keep track of their active tasks without having the main application window open.
- **Sleep/Wake Event Handling Enhancements:** Improved timer reliability in `useTimerStore.ts` and electron files (`main.ts`, `preload.ts`) to maintain accurate time tracking when the OS enters or resumes from sleep state. 
- **Project Structure & Tooling:** 
  - Added a new `docs/roadmap.md` file to outline future development plans.
  - Added GitHub Issue Templates (`bug_report.md`, `feature_request.md`, `custom.md`) to standardize community feedback and reporting.

### Technical Details 🛠

- Refactored `usePomodoro.ts` and `useTimerStore.ts` to properly handle state separation between `STOPWATCH` (Focus Void) and `POMODORO` countdown modes.
- Added IPC handles in Electron's `main.ts` and `preload.ts` to spawn and manage the new Mini Timer window.
- Updated typing declarations (`src/vite-env.d.ts`) to accommodate new Electron APIs.
