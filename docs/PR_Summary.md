# Pull Request Summary

## Commits Overview
- `e3d8f59` 20260223 - #5 melhorias modo FOCUS
- `8aad5c0` 20260223 - #5 bug minitimer
- `1303bdd` 20260223 - #5 calendario

## Detailed Technical Changes

### 1. Calendar History View (`1303bdd`)
This represents a major refactoring of the history visualization, transitioning from a linear ledger to a rich, month-based calendar system.
* **Frontend State Management:** Introduced a new Zustand store `useHistoryStore` mapping `YYYY-MM` keys to lists of worklogs, providing efficient caching, month-based fetching, localized deletions, and synchronization.
* **UI Components:** 
  * `CalendarGrid`, `DayCell`, and `HistoryMonthHeader` were added to visually map worklog intensity across days, providing metrics like total hours and daily averages.
  * `DailyLogsDrawer`: Implemented a persistent slide-out drawer offering granular details of all worklogs for any selected calendar day.
* **Backend Integration:** Updated the backend API service (`jiraApi.getWorklogs`) to support queries filtered by `month` and `year`.

### 2. Global Worklog System & Minitimer Fix (`8aad5c0`)
Resolved a structural issue where the worklog prompt was constrained to the FocusVoid screen, breaking the flow for users relying exclusively on the minitimer.
* **Global Modal:** Created a centralized `GlobalWorklogModal` component embedded at the root application routing level, triggered by a global `isPromptingWorklog` flag in `useTimerStore`.
* **Flow Refactoring:** Removed isolated Worklog logic from `FocusVoid.tsx`. Users can now log work from any screen in the main app upon pausing/stopping the timer.
* **Minitimer Exclusion:** Safeguards were implemented so the global modal only appears in the full desktop mode (`#/` routing path) and specifically excludes the `#/mini` route to preserve the widget's compact format.

### 3. Focus Mode Enhancements (`e3d8f59`)
Further refined the core Pomodoro focus experience, improving flexibility and automated tracking.
* **Configurable Durations:** Modified the timer state to adopt dynamic `focusDuration` rather than a hardcoded 25-minute cycle.
* **UI Quick Actions:** Updated `FocusVoid.tsx` to include instant toggle buttons corresponding to popular focus structures (25, 45, and 60 minutes).
* **Automated Prompts:** Programmed the timer to automatically trigger `isPromptingWorklog` (pushing the new `GlobalWorklogModal`) exactly when the countdown hits zero, immediately converting spent time into trackable Jira worklogs without manual pausing.
