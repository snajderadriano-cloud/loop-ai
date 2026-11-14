# LOOP Studio — AI Developer Academy · v3

A free, mobile-first, offline-friendly progressive web app for learning AI development through **official-source guided practice**, applied knowledge checks, and repeatable small projects. Built without paid APIs or a remote user database. The project is independent of referenced course authors.

## What changed in v3

- New responsive visual system: designed course covers, microinteraction, meaningful hierarchy, first-party art made with CSS/SVG rather than stock images, graceful reduced-motion mode.
- **Honest baseline assessment:** 12 skill probes across six domains, including six typed answers and six applied multiple-choice scenarios. The question set rotates between attempts, four plausible options, explicit *I don't know*, and confidence (reasoned / uncertain / guessed) weighting. Old 13/14 scores no longer certify competence.
- **Daily training:** 90-second / 5-scenario micro-sprint, daily rotation, adaptive priority for weaker or review-due topics. Current question bank: 36 applied probes (18 are alternate scenarios). Review schedule stored per user in the browser.
- **9-stage AI Developer learning path** with real URLs to primary sources and clear practical deliverables, plus original other career tracks.
- **Prompt Lab:** three original writing/design scenarios and transparent rubric-based self-assessment, not an automatic AI grader.
- **Skills:** separate provisional quiz estimates, sprint attempts, and self-attested practical work; no invented professional qualification or claims that a checkbox proves a project works.
- Local migration: retains `loop-ai-v1` profile, previously unlocked levels and XP, `loop-ai-coach-v2` data, adds `loop-mastery-v3`. Export/import includes new data.
- Updated service worker uses network-first for code when online and cache fallback when offline. Cache bumped with v3 deployment.

## What it is NOT

- Not a replacement for Microsoft's, Hugging Face's or Google's official course platform; original source links go straight to the publisher.
- Does not inspect your actual code, connect to GitHub account, use an LLM to mark open writing or prove professional competence.
- No guarantee of a job, certification or real-world mastery just from finishing quizzes.
- Question bank is finite; varied cases and spaced reviews can be repeated indefinitely, but novel source lessons do not magically appear.
- Local-only storage, no sync across devices; export progress before changing browser or phone.

## Learning use

1. Choose **AI Developer** (or another track), follow the applied diagnostic. Guessing isn't rewarded as confidently knowing.
2. Start the recommended stage. Read its linked official documentation rather than treating the LOOP summary as the entire course.
3. Build a deliverable outside the app, test it and record the evidence in its practice card.
4. Do a 90-second micro-sprint as retrieval practice and work through missed areas.
5. Reassess after real practice to check retained knowledge; treat the score as provisional.

## Development

No npm dependencies for runtime. Requires Node 20+ for testing/building.

```bash
npm test
npm run build
python tests/v3_smoke.py    # headless Chromium / Playwright available
```

Deploy files at repo root (`index.html`, `app.mjs`, `mastery.mjs`, `studio.css`, original content, icons, manifest, service worker) on HTTPS GitHub Pages. Chrome on Android can offer installation as a PWA when Chromium installability rules are met. Layout tested at 320–412px using Playwright's desktop Chromium mobile emulation; not equivalent to physical Android.

## Source of truth

`CURRICULUM.md` maps the stages and learning outcomes to real primary sources. `mastery.mjs` includes original practice questions, source links and deterministic scoring. No copyrighted course text is mirrored beyond brief summaries. `tests/mastery.test.mjs` covers fairness and adaptive selection.


## Personal AI Product Developer route (local-only)

The dedicated career route offers eight outcomes mapped to Python, GitHub Skills, MDN, Microsoft, OpenAI, and Hugging Face original sources. The visitor selects a focus (products/agents/pipelines/tooling) and daily time (15/25/45 min), stored in `loop-personal-v1` only on the device. No inferred sensitive profile or name is published in the repository. Progress requires a self-reported artifact note, not just a high quiz score; code is not automatically graded. Export/import includes the personalized route.

## v4 · Workbench (in-app practice)

- The first `SPEC.md` assignment now opens an **actual Markdown editor** inside the lab. It saves drafts in `loop-workbench-v1`, checks that the document has a goal, three scenarios, constraints, and four acceptance criteria, and downloads the real `SPEC.md`. A green document check only verifies structure, not business quality or professional mastery.
- Python lessons open an in-browser `checker.py` editor with **real Python execution via Pyodide 0.27.7**, in a dedicated Web Worker, capture of stdout/stderr and seven real assertion cases. The first run loads WebAssembly from the Pyodide CDN; Python execution requires network on first run and is not guaranteed offline. This is not an operating-system shell, a secure execution service, or a full `pip` environment.
- User code runs on their device. No paid API, backend, login, remote user data, or shared terminal is added. Execution is cancellable on a 90-second timeout. Don't run untrusted code. Code and drafts persist locally and are included in Export/Import.
- UX test: `python tests/workbench_smoke.py`; logic: `node --test tests/workbench.test.mjs`.

## Workspace usability v5
- Guided SPEC.md form: title/goal/scenarios/constraints/acceptance checks, with source Markdown mode as an alternative. Both edit the same draft and retain previous user content.
- Mobile Python editor: large code field, quick syntax/indent keys, distinct Run and Check actions, actual Pyodide running in a worker. A successful print does not certify exercise tests.
- Browser worker is reused while on the editor screen to avoid downloading Python on every run. It is not an OS terminal or cloud code execution.
- PWA installation: old Android shortcut pointing at `loopai.com` is independent of this repo; uninstall/remove old shortcut and then install from the correct `github.io/loop-ai/` origin in normal Chrome. Export progress before uninstalling the PWA.
