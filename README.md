# Pomerode Jira

A desktop productivity tool integrating the Pomodoro technique with Jira time tracking.

## Features

- **Pomodoro Timer**: Customizable timer for work and break intervals.
- **Focus Void**: Extended stopwatch mode for uninterrupted, open-ended work sessions.
- **Mini Timer Window**: Keep track of your active tasks with a non-intrusive desktop widget.
- **Weekly Calendar View**: Manage your worklogs effortlessly using a 24-hour scrollable grid with an intuitive drag-and-drop mechanics for your Jira tickets.
- **Jira Integration**: Syncing worklogs directly to Jira issues with robust **Atlassian OAuth 2.0** secure authentication.
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

2. **Environment Setup (Jira OAuth Config)**:
   The application requires some variables to connect to Atlassian APIs. These are configured via a Runtime Config JSON file.
   - Copy the example config file:
     ```bash
     cp public/config.example.json public/config.json
     ```
   - Update `public/config.json` with your Jira OAuth App credentials (specifically the `VITE_JIRA_CLIENT_ID`).
   > *Note: For the backend proxy token exchange to work locally, ensure you also have `.env` with `CLIENT_ID` and `CLIENT_SECRET` under the `server/` directory.*

4. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

5. **Run in development mode**:
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

## Release Notes

Stay up to date with the latest features and improvements by checking our [Release Notes](docs/release_notes.md).

## Privacy Policy

FocusApp operates completely locally and does not collect or transmit your personal data to our servers. Review the full [Privacy Policy](docs/PRIVACY.md) for details on how your Jira integration data and authentication tokens are securely handled locally on your device.
