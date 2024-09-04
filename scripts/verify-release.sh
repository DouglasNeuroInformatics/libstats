#!/usr/bin/env bash

set -euo pipefail

release_version=${1:-}
if [ -z $release_version ]; then
  echo "ERROR: Usage: \$0 <version>" >&2
  exit 1
elif [[ ! $release_version =~ ^[0-9]+\.[0-9]+\.[0-9]+(-alpha.[0-9]+)?$ ]]; then
  echo "ERROR: Invalid format of release version \"$release_version\"" >&2
  exit 1
fi

while read -r -d $'\0' filepath; do
  package_version=$(jq -r .version $filepath)
  if [[ "$release_version" != "$package_version" ]]; then
    echo "ERROR: Unexpected version in file \"$filepath\", expected \"$release_version\" but found \"$package_version\"" >&2
    exit 1
  fi
done < <(find .  -type f '(' -path './npm/*/package.json' -o -path './package.json' ')' -print0)

echo "Done! Verified Release $release_version"
