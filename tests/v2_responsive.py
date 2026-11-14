from playwright.sync_api import sync_playwright
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT.parent/'loop-ai-standalone.html').read_text()
SEED={'version':1,'profile':{'name':'Демо','track':'builder','level':'beginner','minutes':15},'selectedTrack':'builder','unlocked':{'builder':0},'best':{},'wrongs':{},'history':[],'dailyDays':[],'stats':{'sessions':0,'answered':0,'correct':0,'xp':0},'settings':{'sound':False,'reduceMotion':False}}
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(320,568),(360,640),(390,844),(412,915)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,device_scale_factor=1)
  page=ctx.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.evaluate('''(seed)=>{const db={'loop-ai-v1':JSON.stringify(seed)};Object.defineProperty(window,'localStorage',{configurable:true,get:()=>({getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k]})})}''',SEED)
  page.set_content(HTML,wait_until='load')
  assert page.locator('.hero-v2').count()==1
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+2'),(width,'horizontal overflow home')
  page.locator('[data-act="start"][data-mode="daily"]').first.click()
  page.wait_for_timeout(350)
  btns=page.locator('.answer-opt')
  assert btns.count()==3
  box=btns.last.bounding_box()
  print('game',width,height,'third-answer-bottom',int(box['y']+box['height']),'viewport',height)
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+2'),(width,'horizontal overflow game')
  page.screenshot(path=str(ROOT/f'preview-v2-game-{width}.png'),full_page=False)
  assert not errs,errs
  ctx.close()
 browser.close()
