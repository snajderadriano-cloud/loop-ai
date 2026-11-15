/* LOOP Workbench: local draft files and transparent validation, no backend claims. */
export const WORKBENCH_KEY='loop-workbench-v1';
const MAX_FILE_LENGTH=25000;
const STARTER_SPEC=`# Мини-приложение: [название]\n\n## Цель\nКому оно помогает и какую проблему решает? Напиши своими словами.\n\n## Сценарии\n1. [Что делает пользователь, когда открывает приложение?]\n2. [Что он вводит и какой результат получает?]\n3. [Что происходит при ошибке или отсутствии данных?]\n\n## Ограничения\n- [Например: приложение работает без платных API.]\n- [Например: никаких секретов в браузере.]\n\n## Критерии приёмки\n1. [Что сделать и какой конкретный результат увидеть?]\n2. [Второй проверяемый результат.]\n3. [Третий проверяемый результат.]\n4. [Как проверить ошибку или нестандартный случай?]\n`;
const STARTER_PY=`def check_answer(score):\n    # 1. Если score вне диапазона от 0 до 1 — верни «Ошибка».\n    # 2. Если score >= 0.8 — верни «Принят».\n    # 3. Если score >= 0.5 — верни «Нужна проверка».\n    # 4. Иначе верни «Отклонён».\n    # Подсказка: пригодятся if, elif, return.\n    pass\n\nprint(check_answer(0.72))\n`;
export function detectDocument(track,module){
  if(module==='scope'||module==='scoping') return 'spec';
  if(module==='python-build'||module==='python'||module==='engineer/python')return 'python';
  return 'notes';
}
export function makeDraft(kind){return kind==='spec'?STARTER_SPEC:kind==='python'?STARTER_PY:'# Мой учебный проект\n\n## Что собираю\n\n\n## Как проверю\n\n';}
const clean=s=>String(s??'').trim();
function section(text,title){const escaped=title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const r=new RegExp('^##\\s*'+escaped+'\\s*$','im');const match=r.exec(text);if(!match)return '';const rest=text.slice(match.index+match[0].length);return rest.split(/^##\s+/m)[0]||'';}
function entries(part){return part.split(/\r?\n/).map(x=>x.trim()).filter(x=>/^(?:\d+[.)]|[-*])\s+/.test(x)).map(x=>x.replace(/^(?:\d+[.)]|[-*])\s+/,'').trim()).filter(x=>x.length>=18&&!/\[[^\]]+\]|\bTODO\b|заполни|например:|\bplaceholder\b/i.test(x));}
export function inspectSpec(text){
  const body=clean(text).slice(0,MAX_FILE_LENGTH);
  const goal=clean(section(body,'Цель'));
  const scenarioLines=entries(section(body,'Сценарии'));
  const constraints=entries(section(body,'Ограничения'));
  const criteriaLines=entries(section(body,'Критерии приёмки'));
  const goodGoal=goal.length>=55&&!/\[[^\]]+\]|кому оно помогает|напиши своими словами|\bTODO\b/i.test(goal);
  const steps=[
    {label:'Цель приложения сформулирована своими словами',done:goodGoal},
    {label:'Есть три конкретных сценария пользователя',done:scenarioLines.length>=3},
    {label:'Указаны хотя бы два реальных ограничения',done:constraints.length>=2},
    {label:'Есть четыре проверяемых критерия приёмки',done:criteriaLines.length>=4},
  ];
  return {valid:steps.every(x=>x.done),steps,scenarios:scenarioLines.length,criteria:criteriaLines.length,details:'Проверена только полнота разделов и конкретность формулировок. Корректность продукта требуется оценить отдельно.'};
}
export function validateWorkbenchState(value){const x=value&&typeof value==='object'?value:{};const drafts={};for(const k of ['spec','python','notes'])if(typeof x.drafts?.[k]==='string')drafts[k]=x.drafts[k].slice(0,MAX_FILE_LENGTH);const runs={};for(const k of ['python']){const r=x.runs?.[k];if(r&&typeof r==='object'){const passed=Math.max(0,Math.min(7,Number(r.passed)||0)),total=7;runs[k]={passed,total,verified:passed===total&&r.verified===true,at:typeof r.at==='string'?r.at:'',output:String(r.output||'').slice(0,5000)};}}return {drafts,runs};}
export function markRunResult(state,{passed,total,output,kind='python'}){const s=validateWorkbenchState(state);if(kind!=='python')return s;const n=Math.max(0,Math.min(7,Number(passed)||0));return {...s,runs:{...s.runs,python:{passed:n,total:7,verified:n===7&&total===7,at:new Date().toISOString(),output:String(output||'').slice(0,5000)}}};}

// A mobile-friendly form that converts directly to the same SPEC.md draft.
// Keep the markdown draft as the single source of truth across both editor modes.
export function splitSpecDraft(source){
 const text=String(source||'');
 const matchTitle=text.match(/^#[ \t]*([^\r\n]*)$/m);
 const title=matchTitle?matchTitle[1].trim():'';
 const part=heading=>{
  const match=text.match(new RegExp('^##\\s+'+heading+'\\s*$', 'm'));
  if(!match)return '';
  const after=text.slice(match.index+match[0].length);
  return after.split(/^##\s+/m)[0].trim();
 };
 return {title,goal:part('Цель'),scenarios:part('Сценарии'),constraints:part('Ограничения'),criteria:part('Критерии приёмки')};
}
export function joinSpecDraft(fields){
 const cleanField=k=>String(fields?.[k]||'').replace(/\r/g,'').trim();
 return '# '+cleanField('title')+'\n\n## Цель\n'+cleanField('goal')+'\n\n## Сценарии\n'+cleanField('scenarios')+'\n\n## Ограничения\n'+cleanField('constraints')+'\n\n## Критерии приёмки\n'+cleanField('criteria')+'\n';
}
