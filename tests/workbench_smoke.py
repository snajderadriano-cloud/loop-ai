from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=Path(__file__).resolve().parents[1]
html=(base.parent/'loop-ai-standalone.html').read_text()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for width in [320,390,412]:
   ctx=browser.new_context(viewport={'width':width,'height':800},device_scale_factor=1)
   
   page=ctx.new_page();page.set_default_timeout(3000);errs=[]
   page.on('pageerror',lambda e:errs.append(str(e)))
   page.evaluate('''() => { const saved={'loop-ai-v1': JSON.stringify({version:1, profile:{name:'Tester',track:'builder',level:'some',minutes:15},selectedTrack:'builder'})}; window.__saved=saved; Object.defineProperty(window, 'localStorage',{configurable:true,value:{getItem:k=>saved[k]??null,setItem:(k,v)=>saved[k]=String(v),removeItem:k=>delete saved[k],clear:()=>{Object.keys(saved).forEach(k=>delete saved[k])}}}); }''');page.set_content(html,wait_until='load')
   print('page refreshed',width,flush=True)
   page.locator('[data-act="open-lesson"]').first.click()
   page.locator('[data-act="open-lab"]').first.click()
   expect(page.locator('[data-act="workbench-open"]')).to_be_visible()
   page.locator('[data-act="workbench-open"]').click()
   expect(page.locator('#wb-editor')).to_be_visible()
   assert page.locator('.wb-filebar b').inner_text()=='SPEC.md'
   page.locator('[data-act="wb-check"]').click()
   expect(page.locator('#wb-output')).to_contain_text('Заполни отмеченные разделы')
   src=page.locator('#wb-editor').input_value();
   page.locator('#wb-editor').fill(src+'\nЗаметка пользователя: это мой черновик!')
   page.locator('[data-act="workbench-switch"][data-kind="python"]').click()
   expect(page.locator('.wb-filebar b')).to_have_text('checker.py')
   assert 'def check_answer' in page.locator('#wb-editor').input_value()
   page.locator('[data-act="workbench-switch"][data-kind="spec"]').click()
   assert 'Заметка пользователя' in page.locator('#wb-editor').input_value()
   assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),f'overflow {width}'
   (base/f'workbench-{width}.png').write_bytes(page.screenshot(full_page=True))
   page.locator('[data-act="workbench-back"]').click()
   page.locator('[data-act="workbench-open"]').click()
   assert 'Заметка пользователя' in page.locator('#wb-editor').input_value(),'draft lost on reload'
   assert not errs,errs
   ctx.close()
   print(f'Workbench mobile UI OK at {width}px: editor, persistence, navigation, no JS errors',flush=True)
  browser.close()
finally: pass
