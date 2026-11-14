/* LOOP personal, local-only AI Product Developer curriculum. All sources are original sites. */
export const FOCUSES=[
 {id:'products',name:'AI-продукты',summary:'Приложения с LLM, API, тестами и интерфейсом.',project:'Построй AI-помощника для работы с файлами своего проекта.'},
 {id:'agents',name:'Агенты и MCP',summary:'Инструменты, разрешения, память и управление шагами.',project:'Построй агента, который читает задачи и запускает только разрешённые инструменты.'},
 {id:'automation',name:'Пайплайны',summary:'Надёжная обработка данных, проверки и автоматизация.',project:'Построй пайплайн «данные → обработка → проверка → результат».'},
 {id:'tooling',name:'AI-инструменты',summary:'Промптинг, Codex, отладка, evals и оценка моделей.',project:'Собери тестовый стенд для сравнения AI-инструментов на одинаковых задачах.'}
];
export const STEPS=[
 {id:'python',name:'01 · Код как инструмент',skill:'Python',duration:'1–2 недели',source:'https://docs.python.org/3/tutorial/controlflow.html',publisher:'Python Software Foundation',task:'Сделай функцию check_answer(score), которая по порогам 0.5 и 0.8 возвращает статус AI-ответа. Добавь проверку значения вне диапазона 0–1 и 7 assert-тестов.',deliverable:'checker.py + вывод семи пройденных тестов',checks:['Можешь объяснить return, if, elif своими словами','Вход 0.7999 обрабатывается корректно','Неверные границы вызывают явную ошибку']},
 {id:'git',name:'02 · Проверяй, а не верь',skill:'Git, тесты',duration:'1 неделя',source:'https://github.com/skills/introduction-to-github',publisher:'GitHub Skills',task:'Положи checker.py в Git. Нарочно испорть порог, получи падающий тест, исправь код и сохрани коммит с объяснением.',deliverable:'Git-коммит + красный и зелёный результат теста',checks:['Есть отдельный тест, который падал до исправления','История Git показывает изменение','Тесты проходят после исправления']},
 {id:'api',name:'03 · API и данные',skill:'HTTP',duration:'1–2 недели',source:'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',publisher:'MDN Web Docs',task:'Сделай небольшой Python-клиент к открытому API без ключа: запрос с timeout, ответ JSON, понятные сообщения при 404, 429 и отключённой сети.',deliverable:'api_client.py + 4 сценария ошибок',checks:['Есть timeout','Не выводятся секреты','Ошибки сети и HTTP разделены']},
 {id:'prompts',name:'04 · Управление LLM',skill:'Промптинг, evals',duration:'1–2 недели',source:'https://github.com/microsoft/generative-ai-for-beginners/tree/main/04-prompt-engineering-fundamentals',publisher:'Microsoft',task:'Придумай 10 реальных примеров входа для своего продукта, напиши инструкцию LLM, определи JSON-формат, правило «не знаю» и проверь результаты по рубрике.',deliverable:'prompt.md + 10 тест-кейсов и таблица ошибок',checks:['Указан ожидаемый формат','Есть трудные и пустые входы','Метрики отражают ошибки, а не впечатление от демо']},
 {id:'llm',name:'05 · Первый AI-сервис',skill:'LLM API',duration:'2 недели',source:'https://developers.openai.com/api/docs/quickstart',publisher:'OpenAI Developers',task:'Подключи локальную модель или доступный API к своему Python-коду: вход → модель → проверка структуры → ответ. Протестируй пустой ответ и недоступную модель.',deliverable:'Запускаемый сервис + 5 автопроверок',checks:['Секреты отсутствуют в публичном репозитории','Плохой ответ валидируется и отклоняется','Описано, как запускать сервис']},
 {id:'rag',name:'06 · Память и поиск',skill:'RAG',duration:'2 недели',source:'https://github.com/microsoft/generative-ai-for-beginners/tree/main/15-rag-and-vector-databases',publisher:'Microsoft',task:'Собери retrieval по пяти собственным тестовым документам. Ответ должен ссылаться на конкретный фрагмент и честно говорить, когда данных нет.',deliverable:'Ретривер + 10 контрольных вопросов с источниками',checks:['Отвечает по найденным, а не придуманным данным','Есть кейс без ответа','Отдельно оценивается качество поиска']},
 {id:'agents',name:'07 · Агенты и инструменты',skill:'Agents, MCP',duration:'2 недели',source:'https://huggingface.co/learn/agents-course/unit1/introduction',publisher:'Hugging Face',task:'Собери агента с одним безопасным инструментом и ограничением шагов. Добавь лог действий и пять тестовых сценариев, включая ошибки инструмента.',deliverable:'Прототип агента + трассы 3 успешных и 2 ошибочных сценариев',checks:['У инструментов есть схемы входа','Чужой текст не получает доступ к инструментам','Есть лимиты шагов и прав']},
 {id:'shipping',name:'08 · Выпуск и качество',skill:'CI, deployment',duration:'1–2 недели',source:'https://docs.github.com/en/actions/get-started/quickstart',publisher:'GitHub Docs',task:'Сделай выпуск своего AI-продукта: README, автоматические тесты в CI, инструкции по запуску, проверки после обновления и способ отката.',deliverable:'Рабочая ссылка/демо + CI + тесты + README',checks:['Проверки запускаются без ручных действий','Есть негативные тесты','Описаны ограничения и откат']}
];
const ids=new Set(STEPS.map(s=>s.id));
export function normalizePersonal(value){
 const v=value&&typeof value==='object'?value:{};
 return {
  focus:FOCUSES.some(x=>x.id===v.focus)?v.focus:'products',
  minutes:[15,25,45].includes(v.minutes)?v.minutes:25,
  completed:Array.isArray(v.completed)?v.completed.filter(x=>x&&ids.has(x.id)&&typeof x.note==='string').slice(0,STEPS.length).map(x=>({id:x.id,note:x.note.slice(0,2000),at:typeof x.at==='string'?x.at:'',verified:false})).filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i):[]
 };
}
export function selectCurrentStep(profile){const p=normalizePersonal(profile);return STEPS.find(s=>!p.completed.some(c=>c.id===s.id))||STEPS.at(-1)}
export function submitEvidence(profile,stepId,note){
 if(!ids.has(stepId))throw Error('Неизвестный этап');
 if(typeof note!=='string'||note.trim().length<45)throw Error('Нужен описанный результат: файл, выполненная команда и проверка');
 const p=normalizePersonal(profile);
 if(!p.completed.some(x=>x.id===stepId))p.completed.push({id:stepId,note:note.trim().slice(0,2000),at:new Date().toISOString(),verified:false});
 return p;
}
export function makeDailyPlan(minutes){const m=[15,25,45].includes(minutes)?minutes:25;return [{name:'Разминка',minutes:Math.min(3,m)},{name:'Официальный материал',minutes:m===15?5:m===25?7:12},{name:'Практика и проверка',minutes:m-(Math.min(3,m))-(m===15?5:m===25?7:12)}]}
export function sourceForStep(id){return STEPS.find(s=>s.id===id)?.source??''}
