#!/usr/bin/env bash

set -euo pipefail

root_package_name=$(cat package.json | jq -r .name)
root_package_version=$(cat package.json | jq -r .version)
if [[ ! $root_package_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "ERROR: Invalid format of release version \"$root_package_version\"" >&2
  exit 1
fi

commit_file=$(mktemp)
echo "chore(release): publish v${root_package_version}" >> $commit_file
echo -e "\n" "- $root_package_name@$root_package_version" >> $commit_file

while read -r -d $'\0' filepath; do
  package_name=$(jq -r .name $filepath)
  package_version=$(jq -r .version $filepath)
  if [[ "$root_package_version" != "$package_version" ]]; then
    echo "ERROR: Unexpected version in file \"$filepath\", expected \"$root_package_version\" but found \"$package_version\"" >&2
    exit 1
  fi
  echo "- $package_name@$package_version" >> $commit_file
done < <(find .  -type f -path './npm/*/package.json' -print0)

git commit -F $commit_file
rm $commit_file
