from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
HTML=(Path(__file__).resolve().parents[2] / 'loop-ai-standalone.html').read_text()
root=Path(__file__).resolve().parents[1]
payload={"version":1,"profile":{"name":"Проверка","track":"builder","level":"some","minutes":15},"selectedTrack":"builder","unlocked":{"engineer":0,"expert":0,"agent":0,"ml":0,"builder":1},"stats":{"sessions":2,"answered":14,"correct":13,"xp":200},"history":[],"settings":{"sound":False,"reduceMotion":False}}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(320,568),(360,740),(390,844),(412,915)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=True,has_touch=True)
  page=ctx.new_page();page.set_default_timeout(6000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def load(existing=None):
   state=existing or {'loop-ai-v1':json.dumps(payload)}
   page.evaluate("(records) => {const db={...records};Object.defineProperty(window,'localStorage',{configurable:true,get:()=>({getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k],clear:()=>{for(const k of Object.keys(db))delete db[k]}})})}",state)
   page.set_content(HTML,wait_until='load')
  load();assert page.locator('.studio-hero').count()==1
  assert 'Уметь создавать' in page.locator('.studio-intro').inner_text()
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
  # Should preserve old XP and profile on v3 load.
  assert '200 XP' in page.locator('.xp-capsule').inner_text()
  page.locator('[data-act=audit-start]').first.click()
  assert page.locator('.audit-opt').count()==4 or page.locator('#audit-input').count()==1
  page.locator('[data-act=audit-skip]').click();page.locator('[data-act=audit-skip]').click()
  assert page.get_by_text('03 / 12').count()==1
  records=page.evaluate("() => Object.fromEntries(['loop-ai-v1','loop-mastery-v3','loop-ai-coach-v2'].map(k=>[k,localStorage.getItem(k)]))")
  page.close();page=ctx.new_page();page.set_default_timeout(6000);page.on('pageerror',lambda e:errors.append(str(e)))
  load(records);assert page.locator('.studio-hero').count()==1
  page.locator('[data-act=audit-start]').first.click()
  assert page.get_by_text('03 / 12').count()==1, 'audit draft not restored'
  page.locator('[data-act=audit-exit]').click()
  page.locator('[data-act=nav][data-to=library]').last.click()
  assert page.locator('.studio-module').count()==9
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
  page.locator('.studio-module [data-act=open-lesson]').first.click()
  assert page.locator('.lesson-concept').count()==1
  page.locator('[data-act=back]').click()
  page.locator('[data-act=nav][data-to=stats]').last.click()
  assert page.locator('.studio-skill-counters').count()==1
  assert page.get_by_text('Портфолио').count()==1
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
  page.locator('[data-act=nav][data-to=home]').last.click()
  page.locator('[data-act=dojo-start]').first.click()
  for i in range(5):
   page.locator('[data-act=dojo-answer]').first.click();page.locator('[data-act=dojo-next]').click()
  assert page.get_by_text('РАЗМИНКА ЗАВЕРШЕНА').count()==1
  page.locator('[data-act=go-home]').first.click()
  page.locator('[data-act=nav][data-to=stats]').last.click()
  assert '1' in page.locator('.studio-skill-counters').inner_text()
  assert not errors, (width,errors)
  print(f'REGRESSION OK {width}x{height}: v2 migration, audit resume, path, lessons, stats, 5-step sprint',flush=True)
  ctx.close()
 browser.close()
