## PR Summary: CI/CD Release Fix 🛠️

This PR addresses and resolves a critical pipeline failure in the GitHub Actions `release.yml` workflow, specifically in the step that builds and uploads the electron application artifacts.

### Key Changes ✨

- **Disabled Auto-Publishing:** Configured `electron-builder` to never attempt automatic publishing by adding the `-- -p never` flag to the build scripts. This prevents conflicts with the subsequent `Upload Release Assets` step which is explicitly responsible for handling the release.
- **Provided GitHub Tokens:** Injected `GH_TOKEN` and `GITHUB_TOKEN` environment variables into the build step to ensure `electron-builder` has the necessary permissions to complete its packaging process without authentication errors.

### Technical Details ⚙️

- Updated `.github/workflows/release.yml` conditional build steps.
- Fixed the `GitHub Personal Access Token is not set` error that occurred during the linux, mac, and win build jobs.
