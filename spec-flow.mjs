// The beginner path reveals exactly one question at a time.
// The underlying SPEC.md remains the source of truth; no automatic claims of mastery.
export const SPEC_STEPS = Object.freeze([
  {key:'title',title:'Как назовём проект?',help:'Любое рабочее название. Его можно поменять позже.',sample:'Например: AI-помощник для футбольных тренировок',rows:1},
  {key:'goal',title:'Кому он помогает и зачем?',help:'Одно-два предложения. Какая проблема и что получит человек?',sample:'Помогаю игроку планировать тренировки: он выбирает цель, а приложение предлагает план на неделю.',rows:3},
  {key:'scenarios',title:'Что человек сможет сделать?',help:'Опиши три действия по одной строке. Не нужно писать код.',sample:'1. Игрок выбирает позицию и цель на неделю.\n2. Получает простой план тренировок.\n3. Если данных мало, приложение просит уточнить цель.',rows:5},
  {key:'constraints',title:'Какие будут ограничения?',help:'Два важных условия: например, бюджет, безопасность или интернет.',sample:'- Не требовать платного API на первом этапе.\n- Не хранить личные данные без разрешения.',rows:3},
  {key:'criteria',title:'Как проверишь, что всё работает?',help:'Четыре небольшие проверки: «Если сделать X, появится Y».',sample:'1. После выбора цели появляется план.\n2. План содержит минимум три упражнения.\n3. При пустом выборе показывается подсказка.\n4. После перезагрузки выбранная цель сохраняется.',rows:5},
]);
export function safeSpecStep(value){const i=Number(value);return Number.isInteger(i)?Math.max(0,Math.min(SPEC_STEPS.length-1,i)):0;}
export function specStepStatus(index, fields){
 const step=SPEC_STEPS[safeSpecStep(index)]; const text=String(fields?.[step.key]??'').trim();
 if(!text) return 'empty';
 if(/^\[[^\]]+\]$/.test(text)||/^(?:\d+[.)]\s*\[[^\]]+\]\s*)+$/m.test(text)) return 'placeholder';
 return 'started'; // Quality is checked by inspectSpec, not by this UI helper.
}
