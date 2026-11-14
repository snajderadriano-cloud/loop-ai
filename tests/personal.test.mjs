import test from 'node:test';
import assert from 'node:assert/strict';
import {STEPS,FOCUSES,normalizePersonal,selectCurrentStep,submitEvidence,makeDailyPlan,sourceForStep} from '../personal.mjs';

test('learning stages are verifiable with real primary study sources',()=>{
 assert.ok(STEPS.length>=8);
 for(const step of STEPS){assert.match(step.source,/^https:\/\//);assert.ok(step.deliverable.length>12);assert.ok(step.checks.length>=2);assert.ok(step.task.length>20)}
 assert.equal(new Set(STEPS.map(s=>s.id)).size,STEPS.length);
});
test('profile defaults never infer mastery from a quiz',()=>{
 const p=normalizePersonal(null);assert.equal(p.focus,'products');assert.equal(p.completed.length,0);assert.equal(selectCurrentStep(p).id,'python');assert.equal(p.minutes,25);
});
test('cannot submit empty or shallow proof',()=>{
 assert.throws(()=>submitEvidence(normalizePersonal(null),'python','готово'),/описан/i);
 assert.throws(()=>submitEvidence(normalizePersonal(null),'wat','Тесты и код, файл app.py. Команда python app.py возвращает успешный результат.'),/этап/i);
});
test('self-reported evidence advances but remains marked as self-report',()=>{
 const p=normalizePersonal(null);
 const n=submitEvidence(p,'python','Файл checker.py: функция return и 7 assert. Запустил python checker.py, все тесты прошли.');
 assert.equal(n.completed.length,1);assert.equal(n.completed[0].verified,false);
 assert.equal(selectCurrentStep(n).id,'git');assert.equal(p.completed.length,0);
});
test('restores profile, filters malformed external data, retains focus',()=>{
 const p=normalizePersonal({focus:'agents',minutes:45,completed:[{id:'python',note:'Мой рабочий тест'},{id:'other',note:'bad'}]});
 assert.equal(p.focus,'agents');assert.equal(p.minutes,45);assert.deepEqual(p.completed.map(x=>x.id),['python']);
 assert.equal(normalizePersonal({focus:'invalid',minutes:666}).focus,'products');
});
test('daily plan fits time constraint and has a practice segment',()=>{
 for(const m of [15,25,45]){const plan=makeDailyPlan(m);assert.equal(plan.reduce((s,x)=>s+x.minutes,0),m);assert.ok(plan[2].minutes>=7)}
 assert.ok(FOCUSES.some(x=>x.id==='agents'));
 assert.ok(sourceForStep('python').includes('python.org'));
});
