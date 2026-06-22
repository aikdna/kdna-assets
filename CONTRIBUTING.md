# Contributing to kdna-assets

Public release repository for official KDNA judgment assets.

## Adding an asset
1. Ensure the .kdna file passes `kdna validate` with overall_valid: true.
2. Compute SHA256: `shasum -a 256 <asset>.kdna`.
3. Create a GitHub Release with the .kdna file and .sha256 file.
4. Update `assets.json` with the new asset entry.

## What NOT to do
- Do NOT create a registry, marketplace, or install service.
- Do NOT add assets that reference old registry names.

## Sign-off
Sign off all commits: `git commit -s`
