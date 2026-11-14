# Agent engineering rules for LOOP

- Preserve storage keys `loop-ai-v1`, `loop-ai-coach-v2`, `loop-mastery-v3` and read previous values safely. Never reset profile on cosmetic upgrade.
- Do not add a paid API call, third-party analytics, tracker or authentication without explicit approval.
- Every new practice question needs a source URL, a verifiable answer and a plausible alternative; no silly distractors. Prefer tests before behavioral changes.
- UI changes must pass `npm test`, `npm run build`, `python tests/v3_smoke.py` and manual review at 320, 390, 412 CSS pixels with no horizontal overflow.
- The word "verified" means automated check or external artifact review; a user self-check must be labeled self-reported.
- Before publishing confirm PWA manifest, 192/512 icons, service worker cache update, links and GitHub Pages status. No deployment success claim without checking.
