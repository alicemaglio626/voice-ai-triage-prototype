#!/usr/bin/env bash
# One-command "push": sync the two prototype flows from the local DASHBOARD
# (the source of truth you edit + see at localhost:3000), rebuild the static
# site, and deploy it to the shareable GitHub Pages prototype.
#
#   Usage:  npm run deploy      (from the prototype repo root)
#
# The dashboard keeps its own copy (labeled "(prototype)", living beside the
# real pages). This repo is the SHAREABLE mock dash: it adds the sidebar shell,
# the mocked neighbor pages, and renders the two flows AS the real Ops Review /
# Triage. Only the two flows sync; everything else here is standalone.
set -euo pipefail

DASH="$HOME/Desktop/ClaudePlay/Voice-AI/dashrepo/web/src/app"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
APP="$HERE/src/app"
REMOTE="https://github.com/alicemaglio626/voice-ai-triage-prototype.git"

if [ ! -d "$DASH/triage-prototype" ]; then
  echo "✗ Can't find the dashboard at $DASH" >&2
  exit 1
fi

echo "→ Syncing prototype flows from the dashboard…"
rm -rf "$APP/triage-prototype" "$APP/ops-review-prototype"
cp -R "$DASH/triage-prototype" "$APP/"
cp -R "$DASH/ops-review-prototype" "$APP/"

# The Disagreements flow was folded into the single queue — drop the orphan route.
rm -rf "$APP/triage-prototype/disagreement"
rm -f "$APP/triage-prototype/disagreement-mock.ts"

# Static export can't put generateStaticParams in a client page, so the client
# detail becomes detail-view.tsx and a tiny server page.tsx enumerates the IDs.
mv "$APP/triage-prototype/[callId]/page.tsx" "$APP/triage-prototype/[callId]/detail-view.tsx"
mv "$APP/ops-review-prototype/[callId]/page.tsx" "$APP/ops-review-prototype/[callId]/detail-view.tsx"

cat > "$APP/triage-prototype/[callId]/page.tsx" <<'EOF'
import { TRIAGE_MOCK } from "../mock-data";
import DetailView from "./detail-view";

// Static export needs the full set of call pages known at build time.
export function generateStaticParams() {
  return TRIAGE_MOCK.map((i) => ({ callId: i.call_id }));
}

export default function Page() {
  return <DetailView />;
}
EOF

cat > "$APP/ops-review-prototype/[callId]/page.tsx" <<'EOF'
import { OPS_QUEUE } from "../queue-mock";
import DetailView from "./detail-view";

// Static export needs the full set of call pages known at build time.
export function generateStaticParams() {
  return OPS_QUEUE.map((r) => ({ callId: r.id }));
}

export default function Page() {
  return <DetailView />;
}
EOF

# These render as the real pages in the shareable shell — drop "(prototype)".
perl -pi -e 's/Triage \(prototype\)/Triage/g' \
  "$APP/triage-prototype/page.tsx" "$APP/triage-prototype/[callId]/detail-view.tsx"
perl -pi -e 's/Ops Review \(prototype\)/Ops Review/g' \
  "$APP/ops-review-prototype/page.tsx" "$APP/ops-review-prototype/[callId]/detail-view.tsx"

echo "→ Building static site…"
cd "$HERE"
npm run build

echo "→ Committing source to main…"
git add -A
git commit -q -m "Sync prototype flows from dashboard + deploy" || echo "  (no source changes)"
git push -q origin main

echo "→ Deploying to gh-pages…"
TMP="$(mktemp -d)"
cp -R out/. "$TMP/"
touch "$TMP/.nojekyll"
cd "$TMP"
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="Alice Maglio" -c user.email="alice.maglio@datavant.com" \
  commit -q -m "Deploy static prototype"
git remote add origin "$REMOTE"
git push -q --force origin gh-pages
cd "$HERE"
rm -rf "$TMP"

echo ""
echo "✓ Deployed → https://alicemaglio626.github.io/voice-ai-triage-prototype/"
