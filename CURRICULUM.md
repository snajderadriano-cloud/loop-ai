# AI Developer pathway: source-linked outcomes

Primary goal: independently plan, implement, test, and maintain a small AI-powered application. **The nine LOOP checkpoints are original practice structure**, not a verbatim Microsoft or Hugging Face syllabus. Open the real materials at the linked sites.

| Stage | Official/first-party study | Evidence to build |
|---|---|---|
| 01. Scope & architecture | [Microsoft responsible genAI](https://github.com/microsoft/generative-ai-for-beginners/tree/main/03-using-generative-ai-responsibly), [community AI Engineering](https://github.com/rohitg00/ai-engineering-from-scratch) | SPEC.md: three user flows, constraints, four acceptance tests |
| 02. Python | [Python functions / control flow](https://docs.python.org/3/tutorial/controlflow.html), [unittest](https://docs.python.org/3/library/unittest.html) | Small function, seven assertions incl. edge cases |
| 03. Git & debugging | [GitHub Skills](https://github.com/skills/introduction-to-github), [GitHub Actions](https://docs.github.com/en/actions/get-started/quickstart) | Reproduced red test -> green test -> commit |
| 04. HTTP & API | [MDN HTTP status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status), [OpenAI developer quickstart](https://developers.openai.com/api/docs/quickstart) | Client handles timeouts / rate limiting / invalid JSON; no secrets on web |
| 05. LLM application | [Microsoft prompting](https://github.com/microsoft/generative-ai-for-beginners/tree/main/04-prompt-engineering-fundamentals), [text-generation app](https://github.com/microsoft/generative-ai-for-beginners/tree/main/06-text-generation-apps), [OpenAI evals](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | Structured output, validator, 5 representative eval cases |
| 06. Retrieval and RAG | [Microsoft RAG & vector DBs](https://github.com/microsoft/generative-ai-for-beginners/tree/main/15-rag-and-vector-databases) | Five documents, citation-based answers, no-evidence case, retrieval metric |
| 07. Agent systems | [Hugging Face Agents unit 1](https://huggingface.co/learn/agents-course/unit1/introduction), [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/quickstart/), [Microsoft Agents](https://github.com/microsoft/ai-agents-for-beginners) | Tool schema, step cap, logs, three success and two failure tests |
| 08. Security | [OWASP prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [Microsoft AI security](https://github.com/microsoft/generative-ai-for-beginners/tree/main/13-securing-ai-applications) | Five negative tests and explicit permissions boundary |
| 09. Production & delivery | [GitHub Actions](https://docs.github.com/en/actions/get-started/quickstart), [OpenAI evaluation](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | CI, smoke checks, deploy URL, rollback instructions |

**Gate:** Comprehension quizzes never unlock an assertion of practical ability. For projects, attach a trace, test output, and explanation. LOOP can record such evidence but cannot validate external code on its own.

**Daily micro-practice:** 5 applied questions in 90 seconds, rotating and prioritizing errors/due topics. **Extended study:** follow original course assignments; LOOP only curates the link and checkpoint. **Mastery verification (future backend feature):** isolated code sandbox with safe execution, versioned eval suites, instructor feedback, optional explicit account and synced data.
