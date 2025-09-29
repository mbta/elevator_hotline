#!/bin/sh

set -e

if [ -z "$1" ]; then
  echo "Usage: build.sh <zip_file_name>"
  exit 1
fi

jsbundle=$(mktemp -d /tmp/XXXXXX)/index.js

npx --no esbuild src/index.ts \
  --bundle --outfile="$jsbundle" --platform=node --target=node20

zip -j "$1" "$jsbundle"
