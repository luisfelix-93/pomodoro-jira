# Pull Request Summary: Fix Release Draft Uploads

## Objective

Fix the recurring "Too many retries" error encountered during the release job, which aborted the workflow before it could successfully finalize and attach Windows binaries to the GitHub release.

## Changes

- Modified `.github/workflows/release.yml`'s `build` job to run strictly and only on the `windows-latest` OS.
- Discarded Linux/macOS build processes since only the Windows environment was completing the build effectively in this phase.
- Re-scoped the upload phase to only collect `.exe`, `.blockmap`, and `latest.yml` generated binaries securely.

## Impact

The release workflow should now reliably emit Windows artifacts successfully without hanging on non-existent Linux or macOS asset resolution failures.
