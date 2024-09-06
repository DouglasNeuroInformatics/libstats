#!/bin/bash


cd build
# set -euo pipefail
# IFS=$'\n\t'

find . -name "*.tgz" -print0 | xargs -0 -I {} sh -c 'tar -xzvf {} -C $(dirname {}) --strip-components=1'
for dir in "$PWD/*"; do
  pnpm publish
done
