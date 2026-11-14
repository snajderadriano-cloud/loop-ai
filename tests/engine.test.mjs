import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_STATE, validateProfile, buildRound, gradeRound, updateProgress, getStreak, normalizeState, pickNextReview, shouldUnlock, localDay, parseBackup, uniqueQuestions, restoreQuestion } from '../engine.mjs';
import {TRACKS, QUESTION_BANK, findTrack, findModule, getQuestionsForModule } from '../content.mjs';

const now = new Date('2026-11-14T19:00:00+02:00');
test('five coherent paths and valid linked question bank', () => {
  assert.equal(TRACKS.length, 5);
  assert.ok(TRACKS.every(t => t.modules.length >= 3));
  assert.ok(QUESTION_BANK.length >= 75);
  for (const t of TRACKS) for (const m of t.modules) {
    const arr = getQuestionsForModule(t.id,m.id);
    assert.ok(arr.length >= 6, `${t.id}/${m.id}`);
    assert.ok(arr.every(q => q.options.length === 3 && q.answer >= 0 && q.answer < 3 && q.explanation.length > 22));
  }
  assert.equal(new Set(QUESTION_BANK.map(q=>q.id)).size, QUESTION_BANK.length);
});
test('profile validation accepts display name and a valid path', () => {
  assert.equal(validateProfile({name:'Ира',track:'agent',level:'beginner',minutes:10}).ok,true);
  assert.equal(validateProfile({name:'',track:'agent',level:'beginner',minutes:10}).ok,false);
  assert.equal(validateProfile({name:'Ира',track:'unknown',level:'beginner',minutes:10}).ok,false);
});
test('level round selects ten distinct questions from selected module plus foundations', () => {
  for(const t of TRACKS) for(const m of t.modules){
    const qs=buildRound({track:t.id,module:m.id,mode:'level',state:INITIAL_STATE});
    assert.equal(qs.length,10);
    assert.equal(new Set(qs.map(q=>q.id)).size,10);
    assert.ok(qs.filter(q=>q.track===t.id && q.module===m.id).length===6);
  }
});
test('daily mode mixes review and current level while never duplicating IDs',()=>{
  const state = structuredClone(INITIAL_STATE);
  state.wrongs={'core-1':{count:2,updated:'2026-11-12'}};
  const qs=buildRound({track:'engineer',module:'python',mode:'daily',state});
  assert.equal(qs.length,6);
  assert.equal(uniqueQuestions(qs).length,6);
  assert.ok(qs.some(q=>q.id==='core-1'));
});
test('sprint has enough varied questions and no duplicates',()=>{
  const qs=buildRound({track:'ml',module:'ml-basics',mode:'sprint',state:INITIAL_STATE});
  assert.ok(qs.length>=12);
  assert.equal(uniqueQuestions(qs).length,qs.length);
});
test('grade round handles incorrect, missed, and valid answers',()=>{
  const qs=buildRound({track:'engineer',module:'python',mode:'level',state:INITIAL_STATE});
  const answers=qs.map((q,i)=>i===0?null:i===1?(q.answer+1)%3:q.answer);
  const graded=gradeRound(qs,answers);
  assert.equal(graded.correct,8);assert.equal(graded.total,10);
  assert.equal(graded.accuracy,80);
  assert.equal(graded.review.length,2);
});
test('level unlocks only when at least 8/10 correct',()=>{
  assert.equal(shouldUnlock(8,10),true);
  assert.equal(shouldUnlock(7,10),false);
});
test('progress saves unlocked chapter, wrong answers, total XP and streak',()=>{
  const qs=buildRound({track:'engineer',module:'python',mode:'level',state:INITIAL_STATE});
  const answers=qs.map(q=>q.answer);
  let s=updateProgress(INITIAL_STATE,{track:'engineer',module:'python',mode:'level',questions:qs,answers,durationSec:70,now});
  assert.equal(s.unlocked.engineer,1);assert.equal(s.stats.sessions,1);assert.equal(s.stats.correct,10);
  assert.ok(s.stats.xp>0);
  assert.equal(s.history.length,1);
  assert.equal(s.history[0].accuracy,100);
  assert.equal(s.dailyDays.length,1);
  const wrong=qs.map((q,i)=>i===0?(q.answer+1)%3:q.answer);
  s=updateProgress(s,{track:'engineer',module:'python',mode:'daily',questions:qs,answers:wrong,durationSec:70,now});
  assert.ok(s.wrongs[qs[0].id]);
  assert.equal(s.stats.correct,19);
});
test('local day and daily streak are timezone-independent strings',()=>{
  assert.equal(localDay(new Date('2026-11-14T17:00:00Z'),120),'2026-11-14');
  const s=structuredClone(INITIAL_STATE);
  s.dailyDays=['2026-11-11','2026-11-12','2026-11-13'];
  assert.equal(getStreak(s,new Date('2026-11-14T10:00:00Z'),0),3);
  s.dailyDays.push('2026-11-14');
  assert.equal(getStreak(s,new Date('2026-11-14T10:00:00Z'),0),4);
});
test('malformed local data or imported backup does not break the app',()=>{
  assert.equal(normalizeState(null).stats.sessions,0);
  assert.equal(normalizeState({stats:{sessions:'bad'},unlocked:{bad:100}}).stats.sessions,0);
  assert.throws(()=>parseBackup('{"foo":12}'),/резервн/i);
  const valid=structuredClone(INITIAL_STATE); valid.profile={name:'Тест',track:'engineer',level:'beginner',minutes:10};
  const bk=JSON.stringify({app:'loop-ai',version:1,state:valid});
  assert.ok(parseBackup(bk).stats);
});
test('wrong answers are reviewable and correct on review removes them',()=>{
  const qs=buildRound({track:'agent',module:'loop',mode:'level',state:INITIAL_STATE});
  let s=updateProgress(INITIAL_STATE,{track:'agent',module:'loop',mode:'level',questions:qs,answers:qs.map((q,i)=>i===0?-1:q.answer),durationSec:70,now});
  assert.equal(pickNextReview(s,'agent').length,1);
  s=updateProgress(s,{track:'agent',module:'loop',mode:'review',questions:[qs[0]],answers:[qs[0].answer],durationSec:5,now});
  assert.equal(pickNextReview(s,'agent').length,0);
});

test('answer positions are shuffled without changing the correct answer or resume state',()=>{
 const positions=new Set();
 for(let i=0;i<30;i++){
  const [q]=buildRound({track:'engineer',module:'python',mode:'level',state:INITIAL_STATE});
  const restored=restoreQuestion(q.id,q.order);
  assert.deepEqual(restored.options,q.options);
  assert.equal(restored.answer,q.answer);
  positions.add(q.answer);
 }
 assert.ok(positions.size>=2);
 assert.equal(restoreQuestion('core-1',[0,0,1]),null);
});

test('selected experience affects daily curriculum without losing track identity',()=>{
 const novice=structuredClone(INITIAL_STATE); novice.profile={name:'Тест',track:'ml',level:'beginner',minutes:5};
 const confident=structuredClone(INITIAL_STATE); confident.profile={name:'Тест',track:'ml',level:'confident',minutes:5};
 const a=buildRound({track:'ml',module:'ml-basics',mode:'daily',state:novice});
 const b=buildRound({track:'ml',module:'ml-basics',mode:'daily',state:confident});
 assert.ok(a.filter(q=>q.track==='core').length>=1);
 assert.ok(b.every(q=>q.track==='ml'));
});
