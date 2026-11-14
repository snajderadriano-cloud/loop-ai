from playwright.sync_api import sync_playwright
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:8765/'
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='ru-RU')
 page=ctx.new_page()
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.evaluate("""() => {const db={};Object.defineProperty(window,'localStorage',{configurable:true,get:()=>({getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k],clear:()=>{for(const k of Object.keys(db))delete db[k]},key:i=>Object.keys(db)[i]??null})})}""");page.set_content((ROOT.parent/'loop-ai-standalone.html').read_text(),wait_until='load')
 print('onboarding',page.locator('h1').first.inner_text())
 assert page.get_by_text('Учись.',exact=False).count()>0
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-onboard.png'),full_page=True)
 page.locator('[data-act="onb-next"]').click(); print('tracks',page.locator('.path-card').count())
 page.locator('[data-act="choose-onb"][data-track="builder"]').click()
 page.locator('[data-act="onb-next"]').click()
 page.locator('#nick').fill('Тест')
 page.locator('[data-act="finish-onb"]').click()
 assert page.locator('.diagnostic-q').count()==1
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-diagnostic.png'),full_page=True)
 for i in range(14):
  assert page.locator('.diagnostic-opts .answer-opt').count()==3
  page.locator('.diagnostic-opts .answer-opt').nth(i%3).click()
  page.locator('[data-act="diagnostic-next"]').click()
 assert page.locator('.diagnostic-result').count()==1
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-result.png'),full_page=True)
 page.locator('[data-act="go-recommended"]').click()
 assert page.locator('.lesson-concept').count()==1
 page.locator('[data-act="back"]').click()
 assert page.locator('.timeline-row').count()==9
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-path.png'),full_page=True)
 page.locator('[data-act="open-lesson"]').first.click()
 assert page.locator('.lesson-concept').count()==1
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-lesson.png'),full_page=True)
 page.locator('[data-act="open-lab"]').first.click()
 assert page.locator('.lab-v2').count()==1
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-lab.png'),full_page=True)
 page.locator('[data-act="lab-save"]').click()
 print('empty lab error',page.locator('.toast').inner_text())
 page.locator('#lab-note').fill('Написал SPEC.md; проверил 4 критерия приёмки вручную, приложил ссылку.')
 page.locator('[data-act="lab-save"]').click()
 assert 'Практика записана' in page.locator('.toast').inner_text()
 page.locator('[data-act="start"][data-mode="level"]').click()
 assert page.locator('.answer-opt').count()==3
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-game.png'),full_page=True)
 for i in range(10):
  page.locator('.answer-opt').first.click()
  page.wait_for_timeout(810)
 assert page.locator('.view.results').count()==1
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-round.png'),full_page=True)
 page.locator('[data-act="go-home"]').click()
 assert page.locator('.hero-v2').count()==1
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-home.png'),full_page=True)
 page.locator('[data-act="nav"][data-to="courses"]').first.click()
 assert page.locator('.course-card-v2').count()>=9
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-courses.png'),full_page=True)
 page.locator('[data-act="back"]').click()
 page.locator('.bottomnav [data-act="nav"][data-to="stats"]').click()
 page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'preview-v2-stats.png'),full_page=True)
 # reload should persist profile and placement and lab, not reset
 saved=page.evaluate("() => Object.fromEntries(['loop-ai-v1','loop-ai-coach-v2'].map(k=>[k,localStorage.getItem(k)]))");page.close();page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.evaluate("""(d) => {const db={...d};Object.defineProperty(window,'localStorage',{configurable:true,get:()=>({getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k],clear:()=>{for(const k of Object.keys(db))delete db[k]},key:i=>Object.keys(db)[i]??null})})}""", saved);page.set_content((ROOT.parent/'loop-ai-standalone.html').read_text(),wait_until='load');page.locator('.bottomnav [data-act=\"nav\"][data-to=\"stats\"]').click();assert page.locator('.skill-panel').count()==1
 assert page.locator('.portfolio-card').count()==1
 assert not errors,errors
 print('SMOKE_SUCCESS',{'screenshots':len(list(ROOT.glob('preview-v2-*.png'))),'errors':errors})
 browser.close()
