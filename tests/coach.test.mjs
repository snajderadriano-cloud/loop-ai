import test from 'node:test';
import assert from 'node:assert/strict';
import {DIAGNOSTIC,SKILLS,analyzePlacement,normalizeCoach,applyPracticeEvidence,recommendNext,LABS,OFFICIAL_COURSES,updateSkillSignals,hasPracticeEvidence} from '../coach.mjs';
import {TRACKS} from '../content.mjs';

test('placement has exactly two checks for each domain, no duplicate ID or answer mismatch',()=>{
 assert.equal(DIAGNOSTIC.length,SKILLS.length*2);
 assert.equal(new Set(DIAGNOSTIC.map(x=>x.id)).size,DIAGNOSTIC.length);
 for(const s of SKILLS) assert.equal(DIAGNOSTIC.filter(x=>x.skill===s.id).length,2);
 for(const q of DIAGNOSTIC){assert.equal(q.options.length,3);assert.ok(q.answer>=0&&q.answer<3);assert.ok(q.explanation.length>20)}
});
test('placement correctly identifies missing Python/API knowledge and makes a provisional recommendation',()=>{
 const answers=DIAGNOSTIC.map(q=>['python','api'].includes(q.skill)?(q.answer+1)%3:q.answer);
 const r=analyzePlacement(answers,'builder');
 assert.equal(r.skills.python,0);assert.equal(r.skills.api,0);
 assert.ok(r.recommended>=0&&r.recommended<TRACKS.find(t=>t.id==='builder').modules.length);
 assert.ok(r.notes.includes('предварительная'));
 assert.equal(r.correct,DIAGNOSTIC.length-4);
});
test('no diagnostic response is not treated as full mastery',()=>{
 const r=analyzePlacement([], 'builder');
 assert.equal(r.correct,0);assert.equal(r.skills.python,0);assert.equal(r.recommended,0);
});
test('coach migration protects records and derives next action from weak skill, lab and unlocked level',()=>{
 const base=normalizeCoach(null);assert.equal(base.placement,null);
 const r=normalizeCoach({labs:{'builder/scope':{note:'Created a spec and acceptance tests',date:'2026-11-14'}},skills:{python:120,api:-3},placement:{recommended:999,skills:{python:-3}}});
 assert.equal(r.skills.python,100); assert.equal(r.skills.api,0);assert.equal(r.placement,null);
 const n=recommendNext({track:'builder',unlocked:0,best:{}},r);
 assert.equal(n.module,'scope');assert.equal(n.action,'quiz');
});
test('lab completion requires concrete evidence but remains self-attested, never auto-certified',()=>{
 const c=normalizeCoach(null);assert.equal(hasPracticeEvidence(c,'builder','scope'),false);
 assert.throws(()=>applyPracticeEvidence(c,{track:'builder',module:'scope',note:'ok'}),/кратк/i);
 const next=applyPracticeEvidence(c,{track:'builder',module:'scope',note:'Составил ТЗ и проверил четыре критерия'});
 assert.equal(hasPracticeEvidence(next,'builder','scope'),true);
 assert.equal(next.labs['builder/scope'].verified,false);
});
test('all modules have working lab descriptions and official or community sources',()=>{
 for(const t of TRACKS){for(const m of t.modules){
  const lab=LABS[`${t.id}/${m.id}`];assert.ok(lab,`${t.id}/${m.id}`);
  assert.ok(lab.task.length>30);
  assert.ok(lab.checks.length>=2);
  assert.ok(lab.source.startsWith('https://'));
 }}
 assert.ok(OFFICIAL_COURSES.filter(x=>x.kind==='official').length>=5);
});
test('test performance updates skill estimates but does not override diagnostic or claim hands-on skills',()=>{
 const c=normalizeCoach(null);
 const q=[{track:'builder',module:'scope',answer:2},{track:'builder',module:'scope',answer:1}];
 const d=updateSkillSignals(c,{questions:q,answers:[2,0]});
 assert.ok(d.skills.scoping>0 && d.skills.scoping<100);
 assert.equal(d.placement,null);
 assert.equal(Object.keys(d.labs).length,0);
});
