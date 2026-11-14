import {TRACKS,findTrack} from './content.mjs';

// CURATED OFFICIAL MATERIALS. Courses remain on the authors' own websites.
export const OFFICIAL_COURSES=[
 {id:'python',name:'Python Tutorial',publisher:'Python Software Foundation',kind:'official',tag:'Код',url:'https://docs.python.org/3/tutorial/',description:'Синтаксис, функции, модули и исключения из первоисточника.'},
 {id:'github',name:'Introduction to GitHub',publisher:'GitHub Skills',kind:'official',tag:'Git',url:'https://github.com/skills/introduction-to-github',description:'Практика веток, коммитов и pull request.'},
 {id:'microsoft',name:'Generative AI for Beginners',publisher:'Microsoft',kind:'official',tag:'AI apps',url:'https://github.com/microsoft/generative-ai-for-beginners',description:'21 урок о разработке приложений с LLM и API.'},
 {id:'hf',name:'Agents Course',publisher:'Hugging Face',kind:'official',tag:'Agents',url:'https://huggingface.co/learn/agents-course/unit0/introduction',description:'Инструменты, циклы агентов и практические задания.'},
 {id:'openai',name:'OpenAI Developer Quickstart',publisher:'OpenAI',kind:'official',tag:'API',url:'https://developers.openai.com/api/docs/quickstart',description:'Настоящие вызовы API с безопасной работой с ключами.'},
 {id:'agents',name:'OpenAI Agents SDK Quickstart',publisher:'OpenAI',kind:'official',tag:'Agents',url:'https://openai.github.io/openai-agents-python/quickstart/',description:'Первый агент, инструменты и выполнение задач.'},
 {id:'evals',name:'Evaluation Best Practices',publisher:'OpenAI',kind:'official',tag:'Evals',url:'https://developers.openai.com/api/docs/guides/evaluation-best-practices',description:'Оценка реального качества AI-систем, тесты и регрессии.'},
 {id:'ml',name:'Machine Learning Crash Course',publisher:'Google',kind:'official',tag:'ML',url:'https://developers.google.com/machine-learning/crash-course',description:'Интерактивный курс по ML, признакам и метрикам.'},
 {id:'mcp',name:'Model Context Protocol',publisher:'MCP Project',kind:'official',tag:'MCP',url:'https://modelcontextprotocol.io/introduction',description:'Документация и основы протокола инструментов.'},
 {id:'eng',name:'AI Engineering from Scratch',publisher:'rohitg00 · Open Source',kind:'community',tag:'Полный путь',url:'https://github.com/rohitg00/ai-engineering-from-scratch',description:'542 урока, 20 фаз. Расширенный самостоятельный курс с кодом и лабораторными.'},
 ];

export const SKILLS=[
 {id:'scoping',name:'Проектирование',icon:'▧'},
 {id:'python',name:'Python',icon:'⌘'},
 {id:'git',name:'Git / тесты',icon:'↗'},
 {id:'api',name:'API / HTTP',icon:'⇄'},
 {id:'llm',name:'LLM',icon:'✳'},
 {id:'rag',name:'RAG',icon:'⌕'},
 {id:'agents',name:'Агенты',icon:'◈'},
];
// Two questions per skill. Diagnostic is formative, not a professional certification.
const QS=[
 ['scoping','Заказчик просит «сделай удобно». С чего начать?',['Сразу генерировать код','Согласовать конкретные сценарии и критерии приёмки','Выбрать самые яркие цвета'],1,'Критерии приёмки превращают расплывчатое пожелание в наблюдаемый результат.'],
 ['scoping','Что лучше доказывает, что задача действительно выполнена?',['Сообщение AI «всё готово»','Количество написанных строк','Работающий результат и пройденные проверки'],2,'Готовность определяется проверяемым поведением продукта, а не текстом ответа модели.'],
 ['python','Что делает return в функции Python?',['Возвращает значение вызывающему коду','Обязательно печатает текст','Автоматически создаёт файл'],0,'return передаёт результат вызывающему коду; print только выводит его.'],
 ['python','Что выведет код `print(2 + 3 * 4)`?',['20','14','24'],1,'В Python сначала выполняется умножение, затем сложение: 2 + 12 = 14.'],
 ['git','Зачем нужен отдельный коммит перед изменением большого проекта?',['Чтобы увеличить стоимость API','Чтобы было к чему вернуться и что сравнивать','Чтобы удалить историю ошибок'],1,'Коммит фиксирует состояние файлов; благодаря ему проще увидеть изменения и вернуться к рабочей версии.'],
 ['git','После исправления бага тест стал зелёным. Что ещё проверить?',['Запустить регрессионный набор','Сразу удалить тест','Переписать всё приложение'],0,'Регрессионные тесты помогают убедиться, что исправление не нарушило другое поведение.'],
 ['api','Что означает HTTP 429?',['Сервер принял платёж','Слишком много запросов','Файл не найден'],1,'429 Too Many Requests указывает на ограничение частоты запросов — обычно нужен backoff.'],
 ['api','Куда безопаснее поместить секретный API-ключ для публичного веб-приложения?',['В JavaScript прямо на странице','В README публичного репозитория','На сервере в защищённой конфигурации'],2,'Секреты клиентского приложения извлекаемы; ключи должны храниться на доверенной стороне.'],
 ['llm','Почему один удачный ответ LLM не доказывает качество модели?',['Качество нужно проверять на наборе типичных задач','Потому что у модели нет токенов','Потому что модель всегда лжёт'],0,'Нужно использовать повторяемый набор репрезентативных кейсов и измерять ошибки.'],
 ['llm','Как называется процесс, когда LLM генерирует ответ из запроса?',['Fine-tuning','Inference','Cloning'],1,'Inference — использование уже обученной модели для получения предсказания или генерации.'],
 ['rag','Что делает retrieval в системе RAG?',['Учит новые веса модели','Ищет релевантные документы или фрагменты','Рисует интерфейс'],1,'Retrieval извлекает документы; затем найденный контекст используется при генерации ответа.'],
 ['rag','RAG ответил уверенно, но неправильно. Какой первый полезный шаг?',['Проверить найденные фрагменты и оценить на тестовых запросах','Увеличить количество эмодзи','Запретить все поисковые результаты'],0,'Причина может быть в извлечении, ранжировании или генерации; разбор доказательств отделяет этапы.'],
 ['agents','Что отличает AI-агента от разового чат-ответа?',['У него обязательно 10 LLM','Он может вызывать инструменты и наблюдать результаты','Он всегда работает без человека'],1,'Агент выполняет цикл действий через инструменты и обновляет состояние по наблюдениям.'],
 ['agents','Внешний инструмент вернул непроверенные инструкции. Что делать агенту?',['Безусловно их выполнить','Выдать себе больше полномочий','Считать их недоверенными данными и проверить права'],2,'Ответы инструментов — недоверенный ввод. Агент не должен повышать доступ по их требованию.'],
];
export const DIAGNOSTIC=QS.map(([skill,text,options,answer,explanation],i)=>({id:`placement-${i+1}`,skill,text,options,answer,explanation}));

const dev=[
 ['scope','ТЗ и критерии приёмки','Зафиксируй реальную потребность и критерии, по которым можно проверить результат.','Создай SPEC.md для мини-приложения: цель, 3 сценария, ограничения, 4 проверяемых критерия приёмки.',['Есть конкретные входы и выходы','Каждый критерий можно проверить вручную или тестом','Задача ограничена по объёму'],'eng','scoping'],
 ['python-build','Python: функции и тесты','Научись писать код, который можно проверить, а не только прочитать.','Напиши Python-функцию check_answer(score) с тремя ветками; обработай значения вне 0–1 и запусти 7 assert-проверок.',['Функция возвращает разные результаты для трёх диапазонов','Значения вне диапазона не принимаются','Все 7 assert завершаются без ошибки'],'python','python'],
 ['debug','Git и отладка','Умей воспроизводить баг, локализовать причину и защищать результат тестом.','Создай Git-репозиторий, внеси ошибку в маленькую функцию, зафиксируй падающий тест, исправь баг и сделай коммит.',['До исправления тест падает','После исправления тот же тест проходит','Есть коммит с объяснением изменения'],'github','git'],
 ['api-build','HTTP и работа с API','Научись собирать данные из API и объяснять ошибки запросов.','Сделай маленький Python-клиент публичного API с timeout, обработкой 200/404/429/500 и выводом только необходимых полей.',['Есть timeout и понятные сообщения об ошибках','Отдельно обрабатывается 429','Ни одного секретного ключа в публичном коде'],'openai','api'],
 ['llm-app','LLM-приложение','Научись отделять запрос, модель, формат ответа и проверку.','Создай простую обёртку над LLM API или локальной моделью: запрос → структурированный ответ → валидация → лог.',['Данные ответа валидируются','Ошибки API и пустые ответы обработаны','Есть минимум 5 тестовых запросов'],'microsoft','llm'],
 ['rag-build','RAG и поиск знаний','Собери маленький поисковый пайплайн с проверкой достоверности.','Сделай прототип поиска по 5 документам: извлечение → ранжирование → ответ со ссылками → набор из 5 проверочных вопросов.',['Ответ ссылается на найденные документы','Есть тестовый вопрос без ответа в базе','Сравнено качество по 5 тестовым запросам'],'microsoft','rag'],
 ['agent-build','Инструменты, агенты и MCP','Спроектируй агента с правами доступа и контролем шагов.','Создай агента с одним безопасным инструментом и ограничением шагов. Запиши 3 успешных и 2 ошибочных сценария.',['Инструмент имеет понятную схему входа','Ошибка инструмента не ломает весь процесс','Есть лимит действий и журнал результатов'],'agents','agents'],
 ['security','Безопасность AI-систем','Научись распознавать инъекции и отделять данные от команд.','Возьми 5 тестовых недоверенных фрагментов и проверь, что агент не выполняет команды из найденного текста.',['Недоверенный текст не повышает права','Проверены разрешённые действия','Сохранены негативные тест-кейсы'],'microsoft','agents'],
 ['shipping','Пайплайны и выпуск в прод','Собери проверяемую цепочку от кода до работающего релиза.','Добавь тесты, короткую инструкцию запуска, CI-проверку и мини-чеклист выпуска к одному из своих учебных проектов.',['Есть команда запуска тестов','Сборка и проверка работают без ручной магии','Релиз можно открыть и проверить после деплоя'],'evals','git'],
];
export const DEVELOPER_PATH=dev.map(([id,title,summary,task,checks,source,skill],i)=>({id,index:i,title,summary,task,checks,skill,source:OFFICIAL_COURSES.find(s=>s.id===source)?.url||OFFICIAL_COURSES[0].url,sourceName:OFFICIAL_COURSES.find(s=>s.id===source)?.name||'Курс'}));

const simple={
 'engineer/python': ['Реализуй функцию определения порога качества и проверь 7 крайних значений.',['Есть return','Проходят 7 assert'],'python'],
 'engineer/api':['Собери скрипт обращения к API с обработкой ошибок и таймаутом.',['Выводится HTTP статус','Ключи не в коде'],'openai'],
 'engineer/rag':['Проведи сравнительный тест retrieval на 5 запросах.',['Есть источники','Есть таблица ошибок'],'microsoft'],
 'expert/prompts':['Создай 5 тестовых промптов и оцени ответы по единым критериям.',['Указаны критерии','Одинаковые входные данные'],'microsoft'],
 'expert/modelchoice':['Сравни две модели на 10 одинаковых задачах по цене, задержке и точности.',['Есть таблица замеров','Даны выводы и ограничения'],'eng'],
 'expert/workflows':['Составь пайплайн с шагами, проверками и запасным сценарием на ошибку.',['Есть критерии приёмки','Описан откат'],'eng'],
 'agent/loop':['Нарисуй агентный цикл и реализуй одну итерацию без LLM: выбор → инструмент → результат.',['Есть лог инструмента','Лимит шагов задан'],'hf'],
 'agent/tools':['Создай инструмент с чёткой JSON-схемой и обработкой ошибок доступа.',['Входы валидируются','Нет избыточных разрешений'],'mcp'],
 'agent/memory':['Построй набор из 5 проверок восстановления состояния агента.',['Есть журнал шагов','Ошибки воспроизводятся'],'agents'],
 'ml/ml-basics':['Обучи простейший линейный регрессор на маленьких данных и сравни прогноз.',['Есть обучающая выборка','Есть оценка ошибки'],'ml'],
 'ml/data':['Раздели датасет на train/test и объясни риск утечки.',['Тест не входит в обучение','Даны примеры утечки'],'ml'],
 'ml/metrics':['Вычисли precision, recall и accuracy для одной confusion matrix.',['Правильно посчитаны TP/FP/FN','Показан компромисс метрик'],'ml'],
};
export const LABS={};
for(const step of DEVELOPER_PATH){LABS[`builder/${step.id}`]={title:step.title,task:step.task,checks:step.checks,source:step.source,sourceName:step.sourceName,skill:step.skill,estimatedMinutes:step.index>4?45:25};}
for(const [key,[task,checks,sourceId]] of Object.entries(simple)){
 const src=OFFICIAL_COURSES.find(x=>x.id===sourceId);
 LABS[key]={title:key.split('/')[1],task,checks,source:src.url,sourceName:src.name,skill:'',estimatedMinutes:25};
}
export function skillForModule(track,module){return LABS[`${track}/${module}`]?.skill||({python:'python',api:'api',rag:'rag',debug:'git',scope:'scoping',shipping:'git',loop:'agents',tools:'agents',memory:'agents',prompts:'llm',modelchoice:'llm',workflows:'scoping',data:'python',metrics:'python'})[module]||'llm';}
export function analyzePlacement(answers=[],track='builder'){
 const skills=Object.fromEntries(SKILLS.map(s=>[s.id,0]));let correct=0;
 DIAGNOSTIC.forEach((q,i)=>{if(answers[i]===q.answer){correct++;skills[q.skill]+=50}});
 const roadmap=findTrack(track)?.modules||findTrack('builder').modules;
 let recommended=0;
 if(track==='builder'){
  const seq=['scoping','python','git','api','llm','rag','agents','agents','git'];
  recommended=seq.findIndex(s=>skills[s]<75);
  if(recommended===-1)recommended=Math.min(roadmap.length-1,seq.length-1);
 }else{
  recommended=correct>=12?Math.min(2,roadmap.length-1):correct>=8?Math.min(1,roadmap.length-1):0;
 }
 return {track,correct,total:DIAGNOSTIC.length,skills,recommended:Math.min(roadmap.length-1,Math.max(0,recommended)),date:new Date().toISOString().slice(0,10),notes:'предварительная оценка по короткому тесту, не подтверждение практических навыков'};
}
export function normalizeCoach(raw){
 const x={version:2,placement:null,skills:Object.fromEntries(SKILLS.map(s=>[s.id,0])),labs:{},skillSamples:{}};
 if(!raw||typeof raw!=='object')return x;
 for(const s of SKILLS){const n=Number(raw.skills?.[s.id]);if(Number.isFinite(n))x.skills[s.id]=Math.min(100,Math.max(0,Math.round(n)));const t=Number(raw.skillSamples?.[s.id]);if(Number.isInteger(t)&&t>=0&&t<=10000)x.skillSamples[s.id]=t;}
 if(raw.placement&&typeof raw.placement==='object'&&Number.isInteger(raw.placement.recommended)&&raw.placement.recommended>=0&&raw.placement.recommended<=8){
  x.placement={...raw.placement,skills:Object.fromEntries(SKILLS.map(s=>[s.id,Math.min(100,Math.max(0,Number(raw.placement.skills?.[s.id])||0))]))};
 }
 if(raw.labs&&typeof raw.labs==='object')for(const [key,l] of Object.entries(raw.labs))if(LABS[key]&&l&&typeof l.note==='string'&&l.note.length>=12&&l.note.length<=2500){x.labs[key]={note:l.note.slice(0,2500),date:String(l.date||'').slice(0,10),verified:false};}
 return x;
}
export function applyPracticeEvidence(coach,{track,module,note}){
 const key=`${track}/${module}`;
 if(!LABS[key])throw new Error('Неизвестная практическая работа');
 if(typeof note!=='string'||note.trim().length<12)throw new Error('Добавь краткое описание результата (от 12 символов)');
 const x=normalizeCoach(coach);
 x.labs[key]={note:note.trim().slice(0,2500),date:new Date().toISOString().slice(0,10),verified:false};
 return x;
}
export function hasPracticeEvidence(coach,track,module){return !!coach?.labs?.[`${track}/${module}`]?.note;}
export function updateSkillSignals(coach,{questions,answers}){
 const x=normalizeCoach(coach);
 if(!Array.isArray(questions))return x;
 for(let i=0;i<questions.length;i++){
  const q=questions[i];const skill=skillForModule(q.track,q.module);
  if(!SKILLS.some(s=>s.id===skill))continue;
  const correct=answers[i]===q.answer?100:0;
  const n=x.skillSamples[skill]||0;
  // Conservative running estimate; quiz signals never certify hands-on skill.
  x.skills[skill]=Math.round((x.skills[skill]*n+correct)/(n+1));
  x.skillSamples[skill]=n+1;
 }
 return x;
}
export function recommendNext(progress,coach){
 const t=findTrack(progress.track)||findTrack('builder');
 const unlocked=Math.min(t.modules.length-1,Math.max(0,Number(progress.unlocked)||0));
 const suggested=coach?.placement?.track===t.id?Number(coach.placement.recommended):unlocked;
 const index=Number.isInteger(suggested)&&suggested>unlocked?Math.min(t.modules.length-1,suggested):unlocked;
 const module=t.modules[index].id;
 const fastTrack=index>unlocked;
 if(fastTrack)return {module,action:'learn',index,reason:'Твой старт по диагностике — изучи тему и подтверди уровень тестом'};
 if(!hasPracticeEvidence(coach,t.id,module))return {module,action:'lab',index,reason:'Практика превращает теорию в результат'};
 if((progress.best?.[`${t.id}/${module}`]||0)<80)return {module,action:'quiz',index,reason:'Проверь знания на 8 из 10'};
 return {module,action:'learn',index,reason:'Следующий навык'};
}
