#!/usr/bin/env bash
set -eu
rm -rf /tmp/mapa-internal-build /tmp/mapa-parse-out
bun build app/page.tsx --outdir /tmp/mapa-internal-build --target browser --external react --external react-dom --external 'next/*' --external next --external zod
failures=0
while IFS= read -r file; do
  if ! bun build "$file" --outdir /tmp/mapa-parse-out --target browser --external react --external react-dom --external 'next/*' --external next --external zod --external vitest --external '@testing-library/*' >/dev/null; then
    echo "[fail] $file"
    failures=$((failures + 1))
  fi
done < <(find app src tests -type f \( -name '*.ts' -o -name '*.tsx' \) | sort)
test "$failures" -eq 0
echo "[ok] internal syntax validation"
