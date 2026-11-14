# LOOP Academy 2.0

Mobile-first, offline-friendly AI-development learning companion (PWA). Free and open-source style personal training tool.

## What is implemented
- 5 career paths. **AI Developer** has nine staged modules, including safe AI-system security.
- 14-question formative placement assessment in 7 domains. Scores are tentative and never certify practical ability.
- Personal focus recommendations, 10-question level rounds, daily warmup, 60-second sprint, mistake review.
- A task/checklist for each module, linked to **official primary sources**. Marking a lab complete saves a **self-reported result**, not machine-verified code.
- Source directory with official Python, GitHub, Microsoft, Hugging Face, OpenAI, Google, MCP resources plus an independently authored community course.
- Offline shell after the first online load; profile, quiz answers, assessment and lab notes stored locally in the browser. No cloud login or sync.
- Keeps legacy `loop-ai-v1` progress intact; new coaching data is stored separately in `loop-ai-coach-v2`.
- Export/import in settings includes new coaching data. The first launch after an update may require one normal online reload to refresh cached files.

## Deployment
Push `index.html`, `style.css`, `app.mjs`, `engine.mjs`, `content.mjs`, `coach.mjs`, `manifest.webmanifest`, `sw.js`, `icon.svg` and `assets/` to the root of a public GitHub repository. GitHub Pages: Settings → Pages → Deploy from main/root. Install in Chrome → menu → Add to home screen. API calls are NOT made by this app.

## Tests
```
npm test
npm run build
python tests/v2_smoke.py
```
The Playwright smoke test uses a standalone build through `page.set_content` to work in restricted environments; it verifies UI workflows. It does NOT simulate production HTTPS/service-worker install and must not be presented as physical Android testing.

## Honest scope
This app is not affiliated with the authors of linked courses, does not mirror or replace their full lessons and does not issue their certificates. Advanced external API exercises may have provider usage costs. The quiz bank and procedural variations can be reused indefinitely; new theoretical subjects are finite until further content updates. Progress is not synced across devices unless the user exports/imports a backup.

## Sources
See `coach.mjs` (`OFFICIAL_COURSES`) for direct links and `RESEARCH.md` for the project sourcing rationale. Topics include defensive prompt-injection and boundary testing; nothing in the app requires bypassing access controls or unsafe behavior.
