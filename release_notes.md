# Release Notes 🎉

## What's New

### ⏱️ Extended Focus Mode (Focus Void)
Sometimes your work requires uninterrupted, fluid concentration without the rigid boundaries of a countdown timer. We've introduced the **Focus Void**, an increasing stopwatch mode. Start your session, dive straight into your work, and the timer will track your exact elapsed time. 

### 🖥️ Mini Timer Window
Keep your timer visible without cluttering your screen! We've introduced a minimalist **Mini Timer** window for the desktop application. This discreet overlay allows you to monitor your current task and time seamlessly while utilizing other applications.

### 🔋 Rock-Solid Time Tracking (Sleep/Wake Fix)
We've significantly enhanced our timer logic under the hood to handle your computer's power states. Now, if your device goes to sleep and wakes back up, the timer correctly accounts for the elapsed time instead of pausing unexpectedly.

### 🛣️ Community & Roadmap
- Open development is key. We've created new **GitHub Issue Templates** to make reporting bugs and requesting features much easier.
- We've also published our **Project Roadmap** (`docs/roadmap.md`) – check it out to see where the app is heading next!

## Under the Hood
- Adjusted `usePomodoro` and `useTimerStore` hooks to efficiently support both Pomodoro countdowns and chronological stopwatches.
- Refactored Electron main process logic to support dual-window handling (Main App and Mini Timer).
