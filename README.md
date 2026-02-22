# Pomerode Jira

A desktop productivity tool integrating the Pomodoro technique with Jira time tracking.

## Features

- **Pomodoro Timer**: Customizable timer for work and break intervals.
- **Jira Integration**: syncing worklogs directly to Jira issues.
- **Task Management**: View and manage your Jira tasks within the app.
- **Cross-Platform**: Available for Windows, macOS, and Linux.

## Installation

### Prerequisites

> [!IMPORTANT]
> Currently, the application requires **Node.js** to be installed on your system to run the backend server, even when using the installed application.
> Please install [Node.js](https://nodejs.org/) (LTS recommended) before running the app.

### Download

You can download the latest version of the application from the [Releases](https://github.com/luisf/pomerode-jira/releases) page.

1. Go to the **Releases** page.
2. Download the installer for your operating system:
   - **Windows**: `Pomerode Jira Setup <version>.exe`
   - **macOS**: `Pomerode Jira-<version>.dmg`
   - **Linux**: `Pomerode Jira-<version>.AppImage` or `.deb`
3. Run the installer and follow the on-screen instructions.

## Development Setup

If you want to run the application from source or contribute to development:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/luisf/pomerode-jira.git
   cd pomerode-jira
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```
   This will start the React frontend, the Express backend, and the Electron window concurrently.

## Building the Application

To create a distributable installer for your platform:

- **Windows**:
  ```bash
  npm run build:win
  ```

- **macOS**:
  ```bash
  npm run build:mac
  ```

- **Linux**:
  ```bash
  npm run build:linux
  ```

The build artifacts will be located in the `release/` directory.
