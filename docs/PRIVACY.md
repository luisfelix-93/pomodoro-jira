# Privacy Policy — FocusApp

**Last updated: February 22, 2026**

## 1. Overview

FocusApp ("the App") is a desktop productivity application designed to integrate with Atlassian Jira for Pomodoro-based time tracking. This policy explains what data the App collects, how it is used, and how it is stored.

**The App does not transmit any personal data to the developer or any third-party server.** All data is stored locally on your device.

---

## 2. Data We Collect

### 2.1 Jira Authentication Tokens
When you authenticate via Atlassian OAuth 2.0, the App receives and stores locally:
- **OAuth Access Token** — used to make requests to the Jira API on your behalf.
- **OAuth Refresh Token** — used to renew the access token without re-authentication.
- **Cloud ID** — your Atlassian organization identifier.

These tokens are stored in a local SQLite database on your device and are **never transmitted to the developer or any external service** other than Atlassian's own servers.

### 2.2 Jira Work Data
The App stores a local cache of data fetched from Jira:
- **Issues/Tasks** — summary, status, project key, and priority.
- **Worklogs** — start time, duration, and optional comment associated with a pomodoro session.

This data is fetched from Jira via the Atlassian REST API and synchronized locally.

---

## 3. How We Use Your Data

| Data | Purpose |
|---|---|
| OAuth Tokens | Authenticate requests to the Jira API |
| Jira Issues | Display your task list and enable time tracking |
| Worklogs | Track pomodoro sessions and sync time entries back to Jira |

---

## 4. Data Storage

- All data is stored **locally on your device** in a SQLite database file located in the App's user data directory.
- No data is sent to the developer's servers.
- The developer has no access to your Jira credentials, tokens, or work data.

---

## 5. Third-Party Services

The App communicates exclusively with **Atlassian's APIs** to provide its functionality:
- `auth.atlassian.com` — OAuth 2.0 authentication.
- `api.atlassian.com` — Fetching issues and submitting worklogs.

Your use of Atlassian's services is governed by [Atlassian's Privacy Policy](https://www.atlassian.com/legal/privacy-policy).

---

## 6. Data Retention & Deletion

- All locally stored data (tokens, tasks, worklogs) can be deleted at any time by logging out of the App or uninstalling it.
- Uninstalling the App removes the application files. To fully remove the local database, delete the App's data folder from your system's user application data directory.

---

## 7. Data Security

- Authentication is handled via Atlassian's OAuth 2.0 standard — your Jira password is **never seen or stored** by the App.
- Communication with Atlassian's servers uses HTTPS (TLS) encryption.
- The local database is accessible only to your user account on your operating system.

---

## 8. Children's Privacy

This App is intended for professional use and is not directed at children under the age of 13. We do not knowingly collect any data from children.

---

## 9. Changes to This Policy

Any changes to this privacy policy will be reflected in updated releases of the App and in this document. Continued use of the App after changes constitutes acceptance of the revised policy.

---

## 10. Contact

If you have any questions about this privacy policy, please open an issue in the [project's GitHub repository](https://github.com/luisfelix-93/pomerode-jira).
