#!/bin/sh
# The built scripts must parse as ES2017 (Safari 12 on old iPads). Dynamic import() and import.meta
# are newer by the book but Safari 12 has them (the tales are fetched with them), so they are masked
# out before the check.
set -e
out=node_modules/.cache/syntax
rm -rf "$out" && mkdir -p "$out"
for f in dist/assets/*.js; do
  perl -pe 's/import\.meta/__im/g; s/(?<![\w.\$])import\(/__imp(/g' "$f" > "$out/$(basename "$f")"
done
npx --yes acorn@8 --ecma2017 --module --silent "$out"/*.js
