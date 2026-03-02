#!/bin/sh

set -eu

usage="Usage: invoke.sh <dev|prod>"

if [ "${1-}" != dev ] && [ "${1-}" != prod ]; then
  echo "$usage"
  exit 1
fi

out=$(mktemp -d /tmp/XXXXXX)/out.json

set -x

aws lambda invoke --function-name=elevator-hotline-"$1" "$out"
node -p "util.inspect(JSON.parse(fs.readFileSync(\"$out\")), {colors: true})"
