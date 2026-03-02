#!/bin/sh

set -eu

usage="Usage: deploy.sh [-d] <dev|prod>"

maybe_dry_run=

while getopts d opt
do
  case $opt in
    d) maybe_dry_run="--dry-run";;
    ?) echo "$usage"
       exit 2;;
  esac
done

shift $((OPTIND-1))

if [ "${1-}" != dev ] && [ "${1-}" != prod ]; then
  echo "$usage"
  exit 1
fi

tempdir=$(mktemp -d /tmp/XXXXXX)
jsbundle="$tempdir"/index.js
zipfile="$tempdir"/function.zip

set -x

npx --no esbuild src/index.ts \
  --bundle --outfile="$jsbundle" --platform=node --target=node24

zip -j "$zipfile" "$jsbundle"

aws lambda update-function-code \
  "$maybe_dry_run" \
  --function-name=elevator-hotline-"$1" \
  --zip-file fileb://"$zipfile"
