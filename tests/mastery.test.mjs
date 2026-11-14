import test from 'node:test';
import assert from 'node:assert/strict';
import { PROBES, buildAssessment, gradeAttempt, analyzeAssessment, scheduleReview, selectDailyDrill, MODULE_GUIDES } from '../mastery.mjs';

test('new assessment samples varied applied questions by skill and has valid answers',()=>{
  const a=buildAssessment(231); const b=buildAssessment(232);
  assert.equal(a.length,12);
  assert.equal(new Set(a.map(q=>q.id)).size,12);
  assert.notDeepEqual(a.map(q=>q.id),b.map(q=>q.id));
  assert.ok(a.filter(q=>q.type==='short').length>=3);
  for(const q of a) {assert.ok(q.explanation?.length>=35);assert.ok(q.source?.startsWith('https://'));assert.ok(['short','choice'].includes(q.type)); if(q.type==='choice'){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<=3)}else assert.ok(q.accept?.length>=1)}
  assert.equal(new Set(a.map(q=>q.domain)).size,6);
});
test('answer guessing never equals demonstrated mastery and dont-know is not falsely correct',()=>{
 const q=PROBES.find(q=>q.type==='choice');
 assert.equal(gradeAttempt(q,{value:q.answer,confidence:'sure'}).points,1);
 assert.ok(gradeAttempt(q,{value:q.answer,confidence:'guess'}).points<=.25);
 assert.equal(gradeAttempt(q,{value:null,confidence:'sure'}).points,0);
 assert.equal(gradeAttempt(q,{value:(q.answer+1)%4,confidence:'sure'}).points,0);
});
test('short output checked exactly without answer leakage, benign whitespace normalized',()=>{
 const q=PROBES.find(q=>q.type==='short');
 const value=q.accept[0];
 assert.equal(gradeAttempt(q,{value:` ${value} \n`,confidence:'sure'}).correct,true);
 assert.equal(gradeAttempt(q,{value:'not-a-correct-answer',confidence:'sure'}).correct,false);
});
test('placement never labels high quiz scores as applied competence',()=>{
 const questions=buildAssessment(1234);
 const high=analyzeAssessment(questions,questions.map(q=>({value:q.type==='choice'?q.answer:q.accept[0],confidence:'sure'})));
 assert.equal(high.correct,12);assert.equal(high.qualification,'не подтверждена');assert.ok(high.recommendation);
 const guessed=analyzeAssessment(questions,questions.map(q=>({value:q.type==='choice'?q.answer:q.accept[0],confidence:'guess'})));
 assert.ok(guessed.score<high.score);assert.ok(guessed.score<=25);
});
test('adaptive daily selection prioritizes due/repeatedly weak concepts; rotation is deterministic per day',()=>{
 const now='2026-11-14';const weak={'rag':20,'api':85,'python':80};
 const a=selectDailyDrill({day:now,weakness:weak,history:{}});
 const b=selectDailyDrill({day:now,weakness:weak,history:{}});
 assert.equal(a.length,5);assert.deepEqual(a.map(q=>q.id),b.map(q=>q.id));
 assert.ok(a.some(q=>q.domain==='rag'));
 const review=scheduleReview({id:'foo',correct:false,old:null,day:'2026-11-14'});
 assert.equal(review.due,'2026-11-15');assert.equal(review.streak,0);
 const next=scheduleReview({id:'foo',correct:true,old:review,day:'2026-11-15'});
 assert.ok(next.due>'2026-11-15');
});
test('curriculum has sourced practical checkpoints for every AI developer module',()=>{
 const ids=['scope','python-build','debug','api-build','llm-app','rag-build','agent-build','security','shipping'];
 for(const id of ids){const d=MODULE_GUIDES[id];assert.ok(d,`${id}`);assert.ok(d.sources.length>=1);assert.ok(d.sources.every(x=>x.url.startsWith('https://')&&x.title));assert.ok(d.deliverable.length>30);assert.ok(d.gates.length>=3);}
});
test('all practice questions include a source and unambiguous valid answer',()=>{
 assert.ok(PROBES.length>=30);
 assert.equal(new Set(PROBES.map(q=>q.id)).size,PROBES.length);
 for(const q of PROBES){
  assert.ok(q.source.startsWith('https://'),q.id);
  assert.ok(q.explanation.length>35,q.id);
  assert.ok(q.type==='choice'||q.type==='short');
  if(q.type==='choice'){
   assert.equal(q.options.length,4,q.id);
   assert.equal(new Set(q.options).size,4,q.id);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
  }else{assert.ok(q.accept?.length>=1,q.id)}
 }
});
