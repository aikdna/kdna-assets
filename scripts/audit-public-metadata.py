#!/usr/bin/env python3
"""Run the public current-asset and Cluster metadata checks.

This audit never unpacks or directly decodes a KDNA container. Assets are
exercised only through the official CLI.
"""

from __future__ import annotations

import argparse
import subprocess
import sys


CHECKS = [
    ["node", "scripts/validate-indexes.mjs"],
    ["node", "scripts/verify-digests.mjs"],
    ["node", "scripts/check-current-assets.mjs"],
    ["node", "scripts/check-clusters.mjs"],
    ["node", "scripts/check-licenses.mjs"],
    ["node", "scripts/check-public-surface.mjs"],
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--online-releases",
        action="store_true",
        help="also compare the current index with GitHub Release assets and sidecars",
    )
    args = parser.parse_args()

    checks = list(CHECKS)
    if args.online_releases:
        checks.append(["node", "scripts/check-release-consistency.mjs", "--online"])

    print("Public metadata audit")
    print("=" * 72)
    for command in checks:
        print(f"\n$ {' '.join(command)}")
        result = subprocess.run(command, check=False)
        if result.returncode != 0:
            print(f"\nPublic metadata audit: FAIL ({' '.join(command)})", file=sys.stderr)
            return result.returncode

    print("\nPublic metadata audit: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
