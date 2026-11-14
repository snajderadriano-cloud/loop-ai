# Research notes — LOOP AI Gym

Research date: November 2026. Product lessons are original short interpretations, not copied lessons.

## Direct reference: user-supplied video

Analyzed ~64 seconds showing a dark minimalist cognitive training game. Key patterns: numbered rounds, progress dots, a central question card, visible circular countdown, three large answers, pause/time-stop control, level outcome, daily exercise area. The reference is used for interaction patterns only; no third-party code/assets or exact brand UI copied.

## Course sources

1. [AI Engineering From Scratch](https://github.com/rohitg00/ai-engineering-from-scratch): 542 lessons in 20 phases, Python/ML/LLM/RAG/agents, Agent-Assisted Engineering, paths and lesson skills. Our Engineer and Developer topics link back to this repo.
2. [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners): 21 lessons for LLMs, prompting, app integration, evaluation. Our AI Expert track is based on these themes.
3. [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit1/introduction): agent loop, tools, planning, agent frameworks and evaluation. Our Agents track links here.
4. [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course): supervised learning, data, evaluation. Our ML track links here.

## Other product mechanics studied

- [Brilliant](https://brilliant.org/help/using-brilliant/how-do-i-get-started-on-brilliant/): learn by doing, short interactive concepts, daily consistency.
- [spaced](https://github.com/thekbbohara/spaced): offline progress, active recall, per-question repetition. We implement the first step: missed questions return to a local review list. Full spaced scheduling is future scope.

## Engineering choices

- Fully local PWA; no server, no API keys and no permission prompts.
- No external JS/CDN dependencies; all behavior is transparent and inspectable in repo source.
- Three answer options are shuffled while preserving answer keys and session restoration.
- Real scores, no simulated accounts, fake progress or external AI-tutor claims.
- Level checks mix six specialist questions with four foundations questions; 8/10 unlocks next level.
- Session state can be resumed. Backups are available as JSON.
- Unit tests with Node.js and browser workflow checks with Playwright (Chromium).

## Limitations

First release has 15 mini lessons (3 per track) and 102 questions, not the full referenced curricula. There is no automatic server sync, no generative AI tutor, and no actual Android APK yet. Browser localStorage can be cleared by user/browser. Offline support is via service worker after first HTTPS load.
