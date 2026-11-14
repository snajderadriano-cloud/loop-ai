import { TRACKS, QUESTION_BANK, getQuestionsForModule, getQuestion, findTrack } from './content.mjs';
export const INITIAL_STATE={version:1,profile:null,selectedTrack:null,unlocked:{engineer:0,expert:0,agent:0,ml:0,builder:0},best:{},wrongs:{},history:[],dailyDays:[],stats:{sessions:0,answered:0,correct:0,xp:0},settings:{sound:false,reduceMotion:false}};
export function validateProfile(p){return {ok: !!(p && typeof p.name==='string' && p.name.trim().length>=1 && p.name.trim().length<=28 && findTrack(p.track) && ['beginner','some','confident'].includes(p.level) && [5,10,15].includes(Number(p.minutes)))};}
export function localDay(date=new Date(), offsetMinutes=-date.getTimezoneOffset()){const x=new Date(date.getTime()+offsetMinutes*60000);return x.toISOString().slice(0,10);}
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function uniqueQuestions(questions){return [...new Map(questions.map(q=>[q.id,q])).values()];}
export function pickNextReview(state,track){return Object.entries(state?.wrongs||{}).filter(([id,v])=>v && v.count>0 && (getQuestion(id)?.track===track || getQuestion(id)?.track==='core')).sort((a,b)=>b[1].count-a[1].count).map(([id])=>getQuestion(id)).filter(Boolean);}
export function restoreQuestion(id, order=[0,1,2]){
 const base=getQuestion(id);if(!base)return null;
 if(!Array.isArray(order)||order.length!==3||order.some(x=>![0,1,2].includes(x))||new Set(order).size!==3)return null;
 return {...base,order:[...order],options:order.map(i=>base.options[i]),answer:order.indexOf(base.answer)};
}
function withShuffledOptions(list){return list.map(q=>restoreQuestion(q.id,shuffle([0,1,2])));}
export function buildRound({track,module,mode,state=INITIAL_STATE}){
 const pool=getQuestionsForModule(track,module);
 if(!findTrack(track)||!pool.length)return [];
 if(mode==='level')return withShuffledOptions(uniqueQuestions([...shuffle(pool).slice(0,6),...shuffle(QUESTION_BANK.filter(q=>q.track==='core')).slice(0,4)]));
 if(mode==='learn')return withShuffledOptions(shuffle(pool).slice(0,10));
 if(mode==='review')return withShuffledOptions(shuffle(pickNextReview(state,track)).slice(0,10));
 const wrongs=pickNextReview(state,track);
 const core=QUESTION_BANK.filter(q=>q.track==='core');
 if(mode==='daily'){
  const level=state.profile?.level||'beginner';
  const coreCount=level==='confident'?0:level==='some'?1:2;
  const review=shuffle(wrongs).slice(0,2);
  const picks=uniqueQuestions([...review,...shuffle(pool).slice(0,6-coreCount),...shuffle(core),...shuffle(pool)]).slice(0,6);
  return withShuffledOptions(picks);
 }
 if(mode==='sprint'){
   const n=Math.max(1,Math.min(3,(state.unlocked?.[track]??0)+1));
   const unlocked=TRACKS.find(t=>t.id===track).modules.slice(0,n).flatMap(m=>getQuestionsForModule(track,m.id));
   return withShuffledOptions(shuffle(uniqueQuestions([...unlocked,...core])));
 }
 return withShuffledOptions(shuffle(pool));
}
export function gradeRound(questions,answers){const correct=questions.reduce((sum,q,i)=>sum+(answers[i]===q.answer?1:0),0);const total=questions.length;return {correct,total,accuracy:total?Math.round(correct/total*100):0,review:questions.filter((q,i)=>answers[i]!==q.answer)};}
export function shouldUnlock(correct,total){return total>0 && correct/total>=0.8;}
export function normalizeState(data){
 const s=structuredClone(INITIAL_STATE);if(!data||typeof data!=='object')return s;
 if(data.profile&&validateProfile(data.profile).ok)s.profile={name:data.profile.name.trim(),track:data.profile.track,level:data.profile.level,minutes:Number(data.profile.minutes)};
 s.selectedTrack=findTrack(data.selectedTrack)?data.selectedTrack:s.profile?.track||null;
 for(const t of TRACKS){const i=Number(data.unlocked?.[t.id]);s.unlocked[t.id]=Number.isInteger(i)&&i>=0?Math.min(t.modules.length-1,i):0;}
 if(data.best&&typeof data.best==='object')for(const [k,v] of Object.entries(data.best)){if(Number.isInteger(v)&&v>=0&&v<=100)s.best[k]=v;}
 if(data.wrongs&&typeof data.wrongs==='object')for(const [id,v] of Object.entries(data.wrongs)){if(getQuestion(id)&&v&&Number.isInteger(v.count)&&v.count>0&&v.count<1000)s.wrongs[id]={count:v.count,updated:String(v.updated||'').slice(0,10)};}
 for(const k of Object.keys(s.stats)){const n=data.stats?.[k];if(Number.isFinite(n)&&n>=0)s.stats[k]=Math.floor(n);}
 if(Array.isArray(data.history))s.history=data.history.filter(h=>h&&typeof h==='object'&&['level','daily','sprint','learn','review'].includes(h.mode)&&typeof h.track==='string').slice(0,200);
 if(Array.isArray(data.dailyDays))s.dailyDays=[...new Set(data.dailyDays.filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)))].sort().slice(-366);
 s.settings.sound=data.settings?.sound===true;s.settings.reduceMotion=data.settings?.reduceMotion===true;
 return s;
}
export function updateProgress(state,{track,module,mode,questions,answers,durationSec=0,now=new Date()}){
 const s=normalizeState(state);const {correct,total,accuracy}=gradeRound(questions,answers);if(!total)return s;
 const day=localDay(now);
 s.stats.sessions++;s.stats.answered+=total;s.stats.correct+=correct;
 const xp=correct*12+(mode==='daily'?15:0)+(mode==='level'&&shouldUnlock(correct,total)?25:0);
 s.stats.xp+=xp;
 if(!s.dailyDays.includes(day))s.dailyDays.push(day);
 s.dailyDays.sort();
 for(let i=0;i<questions.length;i++){
   const q=questions[i];if(answers[i]===q.answer)delete s.wrongs[q.id];
   else {const prev=s.wrongs[q.id]?.count||0;s.wrongs[q.id]={count:prev+1,updated:day};}
 }
 const key=`${track}/${module}`;
 if(mode==='level'){
   s.best[key]=Math.max(s.best[key]||0,accuracy);
   if(shouldUnlock(correct,total)){
      const t=findTrack(track);const index=t?.modules.findIndex(x=>x.id===module)??-1;
      if(index>=0)s.unlocked[track]=Math.max(s.unlocked[track]||0,Math.min(index+1,t.modules.length-1));
   }
 }
 s.history.unshift({track,module,mode,day,correct,total,accuracy,seconds:Math.max(0,Math.round(durationSec)),xp});s.history=s.history.slice(0,200);
 return s;
}
export function getStreak(state,now=new Date(),offsetMinutes=-now.getTimezoneOffset()){
 const set=new Set(state.dailyDays||[]);let cursor=new Date(now.getTime()+offsetMinutes*60000);let key=cursor.toISOString().slice(0,10);
 if(!set.has(key)){cursor.setUTCDate(cursor.getUTCDate()-1);key=cursor.toISOString().slice(0,10);if(!set.has(key))return 0;}
 let count=0;while(set.has(key)){count++;cursor.setUTCDate(cursor.getUTCDate()-1);key=cursor.toISOString().slice(0,10);if(count>400)break;}return count;
}
export function parseBackup(text){let data;try{data=JSON.parse(text);}catch{throw new Error('Некорректный файл резервной копии');}if(data?.app!=='loop-ai'||data?.version!==1||!data?.state||!validateProfile(data.state.profile).ok)throw new Error('Это не резервная копия LOOP');return normalizeState(data.state);}
