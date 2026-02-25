# Release Notes

## Changes in this Release

### Core Fixes
- **Release CI Overhaul:** The GitHub Actions release pipeline has been updated to exclusively build Windows artifacts. This bypasses a recurring issue where the release draft was aborted due to missing Linux and macOS files, leading to "Too many retries" failures. 
- You can now properly download and update to latest versions directly from the release page!

### Technical Details
- Restricted `release.yml` to target only `windows-latest`.
- Removed macOS `.dmg` and Linux `.AppImage`, `.deb`, `.snap` targets from the post-build upload step.
- Added `.blockmap` and `latest.yml` to ensure autoupdaters can evaluate updates appropriately.
