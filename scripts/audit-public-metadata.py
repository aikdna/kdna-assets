#!/usr/bin/env python3
"""
audit-public-metadata.py — Vendored public-side audit.

Self-contained (no private-repo dependency) version of the
public-metadata audit. Validates that every entry in
`assets.json` is factually correct against the actual
dist file on GitHub Releases.

Catches:
  - assets.json `sha256` that doesn't match the actual dist file
  - Release URL that returns non-200
  - Missing .sha256 sidecar (R1 from 2026-06-25 audit)
  - `contains` numbers that don't match the actual payload
  - Deprecated field names in `contains`
    (reasoning_chains / anti_patterns / source_files)
  - `updated` field that doesn't match the latest commit time
    (R5 from 2026-06-25 audit)

This script replaces the previous private-incubator-dependent
`audit-public-metadata.mjs` clone. The vendored copy is
deliberately kept simple: it does only what public-side
CI needs, no private-repo assumption.

Usage:
  python3 scripts/audit-public-metadata.py [--assets assets.json] [--allow-legacy]

Exit codes:
  0  all checks pass
  1  one or more checks failed
  2  script-level error (missing files, etc.)
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request


# Fields that are NOT in the runtime payload and should not be
# claimed in the public `contains` block.
DEPRECATED_CONTAINS_FIELDS = {
    'reasoning_chains',
    'anti_patterns',
    'source_files',
    'misconceptions',  # legacy field name; modern build uses 'patterns'
}


def read_assets(path):
    with open(path) as f:
        return json.load(f)


def get_latest_commit_iso(repo_dir):
    """Return the ISO 8601 commit time of the latest commit on the
    given repo. Uses `git log` directly; no network calls."""
    out = subprocess.check_output(
        ['git', 'log', '-1', '--format=%cI', '--', 'assets.json'],
        cwd=repo_dir, encoding='utf-8'
    ).strip()
    return out


def url_head(url, timeout=15):
    """Return (status_code, location) for a HEAD request."""
    req = urllib.request.Request(url, method='HEAD')
    req.add_header('User-Agent', 'kdna-assets-audit-public-metadata/1.0')
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.headers.get('Location', '')
    except urllib.error.HTTPError as e:
        return e.code, ''
    except Exception:
        return 0, ''


def url_get(url, timeout=30):
    """Return (status_code, body_bytes) for a GET request."""
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'kdna-assets-audit-public-metadata/1.0')
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, b''
    except Exception:
        return 0, b''


def read_payload_kdnab(kdna_path):
    """Extract payload.kdnab from a .kdna ZIP container and parse as JSON."""
    out = subprocess.check_output(
        ['python3', '-c',
         f'import zipfile, json, sys; z = zipfile.ZipFile({kdna_path!r}); sys.stdout.write(z.read("payload.kdnab").decode())'],
        encoding='utf-8'
    )
    return json.loads(out)


def actual_payload_counts(payload):
    """Mirror the kdna-studio-cli's runtime payload field names."""
    return {
        'axioms':        len(payload.get('core', {}).get('axioms', [])),
        'boundaries':    len(payload.get('core', {}).get('boundaries', [])),
        'stances':       len(payload.get('core', {}).get('stances', [])),
        'self_checks':   len(payload.get('reasoning', {}).get('self_checks', [])),
        'failure_modes': len(payload.get('reasoning', {}).get('failure_modes', [])),
        'scenarios':     len(payload.get('scenarios', [])),
        'cases':         len(payload.get('cases', [])),
        'patterns':      len(payload.get('patterns', [])),
        'frameworks':    len(payload.get('core', {}).get('frameworks', []) or []),
        'terms':         len(payload.get('terms', [])),
        'banned_terms':  len(payload.get('banned_terms', [])),
    }


def audit_entry(entry, allow_legacy=False, tmpdir='/tmp'):
    """Audit a single assets.json entry. Returns a list of error
    strings (empty list = all checks passed)."""
    errors = []
    warnings = []

    name = entry.get('name', '?')
    tag = entry.get('tag', '')
    sha = entry.get('sha256', '')
    file_field = entry.get('file', '')
    is_legacy = bool(entry.get('legacy', False))

    # Legacy assets are allowed to be "as released" without
    # all 10-gate verification; the public-metadata-gate CI was
    # added AFTER the legacy 3 were published, so the legacy
    # entries' `contains` numbers may be different from a fresh
    # build (they were captured from the original build). We
    # still do the SHA + URL + sidecar check on legacy assets
    # (those are timeless), but skip the contains strict-check.
    if is_legacy and not allow_legacy:
        warnings.append(f"{name}: marked legacy, skipping strict contains check (use --allow-legacy to allow)")

    dist_url = f"https://github.com/aikdna/kdna-assets/releases/download/{tag}/{file_field}"
    sidecar_urls = [
        f"https://github.com/aikdna/kdna-assets/releases/download/{tag}/{file_field}.sha256",
        f"https://github.com/aikdna/kdna-assets/releases/download/{tag}/{file_field.replace('.kdna', '')}.sha256",
    ]

    # 1. URL must return 200
    status, _ = url_head(dist_url)
    if status != 200:
        errors.append(f"{name}: dist URL {dist_url} returned {status}, expected 200")
        return errors, warnings  # no point continuing
    print(f"  {name}: dist URL PASS (200)")

    # 2. Sidecar must return 200 (either naming convention)
    sidecar_ok = False
    for s_url in sidecar_urls:
        s_status, _ = url_head(s_url)
        if s_status == 200:
            sidecar_ok = True
            break
    if not sidecar_ok:
        errors.append(f"{name}: no .sha256 sidecar found at {sidecar_urls}")
    else:
        print(f"  {name}: sidecar PASS")

    # 3. SHA must match
    s_status, body = url_get(dist_url)
    if s_status != 200:
        errors.append(f"{name}: download failed (status {s_status})")
        return errors, warnings
    actual_sha = hashlib.sha256(body).hexdigest()
    if actual_sha != sha:
        errors.append(
            f"{name}: sha256 mismatch — assets.json says {sha[:12]}…, "
            f"actual is {actual_sha[:12]}…"
        )
    else:
        print(f"  {name}: SHA PASS ({actual_sha[:12]}…)")

    # 4. contains must match the actual payload (skip for legacy)
    if not is_legacy or allow_legacy:
        contains = entry.get('contains', {})
        deprecated_in_contains = set(contains.keys()) & DEPRECATED_CONTAINS_FIELDS
        for f in deprecated_in_contains:
            errors.append(
                f"{name}: contains.{f} is deprecated "
                f"(build schema does not produce this field)"
            )

        if contains:
            tmp = os.path.join(tmpdir, file_field)
            os.makedirs(tmpdir, exist_ok=True)
            with open(tmp, 'wb') as f:
                f.write(body)
            try:
                payload = read_payload_kdnab(tmp)
                actual = actual_payload_counts(payload)
                for key, expected in contains.items():
                    if key in actual:
                        if actual[key] != expected:
                            errors.append(
                                f"{name}: contains.{key} = {expected} in assets.json, "
                                f"but payload has {actual[key]}"
                            )
                print(f"  {name}: contains check PASS ({len(contains)} fields)")
            except Exception as e:
                errors.append(f"{name}: failed to read payload.kdnab: {e}")
            finally:
                try:
                    os.remove(tmp)
                except OSError:
                    pass

    return errors, warnings


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--assets', default='assets.json',
                        help='path to assets.json (default: assets.json)')
    parser.add_argument('--allow-legacy',
                        action='store_true',
                        help='strict-check contains on legacy entries too')
    parser.add_argument('--repo-dir', default='.',
                        help='path to the kdna-assets checkout (for `git log` of assets.json)')
    args = parser.parse_args()

    if not os.path.exists(args.assets):
        print(f"Error: {args.assets} not found", file=sys.stderr)
        return 2

    # Pre-check: updated timestamp
    try:
        commit_iso = get_latest_commit_iso(args.repo_dir)
    except subprocess.CalledProcessError as e:
        print(f"Error: git log failed: {e}", file=sys.stderr)
        return 2

    data = read_assets(args.assets)
    declared_updated = data.get('updated', '')

    print("Public metadata audit (vendored, no private-repo dependency)")
    print("=" * 70)
    print()
    print(f"Assets file:  {args.assets}")
    print(f"Commit time:  {commit_iso}")
    print(f"updated:      {declared_updated}")
    print()

    all_errors = []
    all_warnings = []

    # Check 0: updated matches commit time (within ±2 seconds for
    # round-trip / clock drift tolerance)
    if declared_updated != commit_iso:
        from datetime import datetime, timezone
        def parse_iso(s):
            # tolerate trailing 'Z' and ±HH:MM offsets
            return datetime.fromisoformat(s.replace('Z', '+00:00'))
        try:
            delta = abs((parse_iso(declared_updated) - parse_iso(commit_iso)).total_seconds())
        except ValueError:
            delta = None
        if delta is None or delta > 2:
            all_errors.append(
                f"assets.json \`updated\` ({declared_updated}) does not match the "
                f"latest commit time on assets.json ({commit_iso}; delta={delta}s). "
                f"Refresh by touching assets.json or rebasing."
            )

    # Check 1..N: per-entry
    for entry in data.get('assets', []):
        name = entry.get('name', '?')
        ver = entry.get('latest_version', '?')
        print(f"=== {name} v{ver} ===")
        errs, warns = audit_entry(entry, allow_legacy=args.allow_legacy)
        all_errors.extend(errs)
        all_warnings.extend(warns)
        print()

    if all_warnings:
        print(f"Warnings ({len(all_warnings)}):")
        for w in all_warnings:
            print(f"  ⚠ {w}")
        print()

    if all_errors:
        print(f"❌ public-metadata audit FAILED ({len(all_errors)} error(s)):")
        for e in all_errors:
            print(f"  ✗ {e}")
        return 1

    print("✅ public-metadata audit: PASS")
    return 0


if __name__ == '__main__':
    sys.exit(main())
