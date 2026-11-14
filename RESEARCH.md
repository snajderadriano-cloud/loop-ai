# Sourcing and product decisions · 2026-11-14

## Sources checked

- **AI Engineering From Scratch** by Rohit Ghumare and community — open-source, 542 lessons / 20 phases, developer and agent paths. https://github.com/rohitg00/ai-engineering-from-scratch . It is **not** an official Microsoft/OpenAI/Google course.
- **Microsoft Generative AI for Beginners** — official 21-lesson curriculum, covers prompts, text apps, RAG, responsible practice. https://github.com/microsoft/generative-ai-for-beginners
- **Microsoft AI Agents for Beginners** — official 18-lesson series on agents. https://github.com/microsoft/ai-agents-for-beginners . Some code samples need Azure infrastructure.
- **Hugging Face Agents Course** — official agent concepts, tool use and projects. https://huggingface.co/learn/agents-course/unit1/introduction
- **Google Machine Learning Crash Course** — official ML self-study. https://developers.google.com/machine-learning/crash-course
- **OpenAI Agents SDK Quickstart** — official API examples with tools and tracing. https://openai.github.io/openai-agents-python/quickstart/
- **GitHub Skills Introduction to GitHub** — official Git exercises. https://github.com/skills/introduction-to-github
- **Python Tutorial** — official Python documentation. https://docs.python.org/3/tutorial/
- **OWASP LLM01 Prompt Injection** — original security reference. https://genai.owasp.org/llmrisk/llm01-prompt-injection/

## Connector review

GitHub: connected, but prior direct contents API write was blocked; deployment via authorized Desktop Commander Git CLI worked. Vercel connector existed but had scope permission issues; Github Pages already works and needs no migration. Base44/Craftian/Figma/Canva available but introducing an independent hosting/design project would fracture the existing repo and local PWA data. Lovable and Replit are relevant but not installed; installation has been suggested, and no claim is made that they were used.

## Learning and design decisions

Previous 14-item quiz was too easy and allowed elimination of silly distractors. v3 replaces its primary route with applied scenarios, typed outputs, confidence weighting and no correct-answer reveal until the assessment ends. A high quiz score is not proof of code or prompt competence; project acceptance criteria and evidence remain separate. Gamification supports spaced retrieval and habit, not the source of truth for certification.

Design focuses on legible information, structured cards, handcrafted iconography and lightweight GPU-friendly transitions rather than excessive background videos or expensive effects. Supports `prefers-reduced-motion`.

## Constraints

Without a secured backend there is no safe storage for a paid AI API secret and no automatic review of real Python repositories. Project notes and rubrics are self-attested. The daily drill is adaptive via local-domain scores and due-review records, but this is a transparent heuristic, not a trained personal tutor model.
