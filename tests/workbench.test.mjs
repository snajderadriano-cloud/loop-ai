import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDraft,detectDocument,inspectSpec,markRunResult,validateWorkbenchState} from '../workbench.mjs';

test('SPEC template is a real editable Markdown document',()=>{
  const v=makeDraft('spec');
  assert.match(v,/## Цель/);
  assert.match(v,/## Сценарии/);
  assert.match(v,/## Ограничения/);
  assert.match(v,/## Критерии приёмки/);
  assert.equal(inspectSpec(v).valid,false);
});
test('SPEC validator rejects placeholders and weak contents',()=>{
  assert.equal(inspectSpec('## Цель\nДа\n## Сценарии\n1. A\n2. B\n3. C\n## Ограничения\n- N\n## Критерии приёмки\n1. X\n2. Y\n3. Z\n4. W').valid,false);
});
test('SPEC validator checks goal, three user scenarios and 4 testable criteria',()=>{
  const v=`# Приложение: Smart Notes\n## Цель\nПомогать пользователю находить нужную заметку по смыслу и не придумывать информацию.\n## Сценарии\n1. Пользователь загружает три заметки, а приложение их сохраняет локально.\n2. Пользователь вводит вопрос, приложение показывает найденные заметки.\n3. Пользователь нажимает источник и видит исходный текст заметки.\n## Ограничения\n- Данные не отправляются в интернет без разрешения.\n- Работает на мобильном браузере.\n## Критерии приёмки\n1. После загрузки трёх заметок список содержит ровно три документа.\n2. При запросе с известной фразой показывается соответствующий документ.\n3. При запросе без совпадений система пишет «ничего не найдено».\n4. После перезагрузки страницы сохранённые данные доступны.`;
  const c=inspectSpec(v);
  assert.equal(c.valid,true,JSON.stringify(c));
  assert.equal(c.scenarios,3);
  assert.equal(c.criteria,4);
});
test('editor routing distinguishes SPEC, Python and generic markdown',()=>{
 assert.equal(detectDocument('builder','scope'),'spec');
 assert.equal(detectDocument('builder','python-build'),'python');
 assert.equal(detectDocument('career','python'),'python');
 assert.equal(detectDocument('builder','rag-build'),'notes');
});
test('run evidence is honest, never promotes user to verified without a test',()=>{
 const s=validateWorkbenchState({drafts:{spec:'hello',python:'print(2)',extra:'bad'},runs:{python:{passed:7,verified:true}}});
 assert.deepEqual(Object.keys(s.drafts).sort(),['python','spec']);
 const r=markRunResult(s,{passed:7,total:7,output:'7/7',kind:'python'});
 assert.equal(r.runs.python.verified,true);
 assert.equal(r.runs.python.passed,7);
});

import {splitSpecDraft,joinSpecDraft} from '../workbench.mjs';
test('mobile guided SPEC roundtrip keeps all four original sections',()=>{
 const source=makeDraft('spec');
 const parts=splitSpecDraft(source);
 assert.match(parts.title,/Мини-приложение/);
 assert.match(parts.goal,/Кому/);
 assert.match(parts.scenarios,/1\./);
 assert.match(parts.constraints,/Например/);
 assert.match(parts.criteria,/4\./);
 const restored=splitSpecDraft(joinSpecDraft(parts));
 assert.deepEqual(restored,parts);
});
test('guided form produces valid SPEC and supports every acceptance gate',()=>{
 const draft=joinSpecDraft({title:'AI Notes',goal:'Дать пользователю возможность находить точные ответы по своим заметкам и не выдумывать источники.',scenarios:'1. Пользователь загружает три заметки и видит все названия.\n2. Пользователь вводит вопрос и видит ссылку на источник.\n3. При отсутствии данных пользователь видит честный ответ.',constraints:'- Информация не покидает телефон без явного разрешения.\n- Приложение работает без платных API и регистрации.',criteria:'1. После загрузки трёх файлов отображаются три названия.\n2. Если есть фраза, её источник открывается по нажатию.\n3. Если фраза отсутствует, выводится сообщение о её отсутствии.\n4. После перезагрузки данные пользователя сохраняются.'});
 assert.equal(inspectSpec(draft).valid,true);
});
