from pathlib import Path
from playwright.sync_api import sync_playwright, expect
html=Path('/mnt/data/loop-ai-standalone.html').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (320,390,412):
  context=browser.new_context(viewport={'width':width,'height':830},device_scale_factor=1)
  page=context.new_page();page.set_default_timeout(6000);errors=[]
  page.on('pageerror',lambda e: errors.append(str(e)))
  page.evaluate('''() => {const mem={'loop-ai-v1':JSON.stringify({version:1,profile:{name:'Student',track:'builder',level:'some',minutes:15},selectedTrack:'builder'})}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=v,removeItem:k=>delete mem[k]}})}''')
  page.set_content(html,wait_until='load')
  page.locator('[data-act="open-lesson"]').first.click()
  page.locator('[data-act="open-lab"]').first.click()
  page.locator('[data-act="workbench-open"]').click()
  expect(page.locator('.wb-focus h2')).to_have_text('Как назовём проект?')
  assert page.locator('[data-spec-field]').count()==1
  assert page.locator('#wb-output').count()==0
  page.locator('#wb-one-answer').fill('Футбол AI')
  names=['goal','scenarios','constraints','criteria']
  answers=['Помогать игроку составить понятный недельный план тренировок на основе его позиции и цели.',
   '1. Игрок выбирает цель и позицию, получает подсказку.\n2. Игрок получает несколько тренировок на неделю.\n3. Если цель не выбрана, приложение просит её уточнить.',
   '- План можно создать без платных API и регистрации.\n- Не собираем медицинские данные без согласия.',
   '1. При выборе позиции появляется план.\n2. План содержит не меньше трёх занятий.\n3. Если цель пустая, появляется подсказка.\n4. После перезагрузки список занятий сохраняется.']
  for key,answer in zip(names,answers):
   page.locator('[data-act="wb-next"]').click()
   assert page.locator('[data-spec-field]').count()==1
   assert page.locator('[data-spec-field]').get_attribute('data-spec-field')==key
   # no old task placeholder shown as actual input
   assert '[' not in page.locator('#wb-one-answer').input_value()
   page.locator('#wb-one-answer').fill(answer)
  page.locator('[data-act="wb-next"]').click()
  expect(page.locator('.wb-focus h2')).to_have_text('Твой первый SPEC.md')
  expect(page.locator('.wb-focus-results')).to_contain_text('Цель приложения')
  page.locator('[data-act="wb-check"]').click()
  expect(page.locator('#wb-output')).to_contain_text('Структура заполнена')
  page.locator('[data-act="wb-prev"]').click()
  assert page.locator('#wb-one-answer').input_value()==answers[-1]
  page.locator('.wb-advanced summary').first.click()
  page.locator('[data-act="workbench-switch"][data-kind="python"]').click()
  assert page.locator('#wb-editor').count()==1
  assert page.locator('[data-act="wb-run"]').count()==1
  assert page.locator('[data-act="wb-test"]').count()==1
  assert not errors, errors
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),width
  page.screenshot(path=f'/mnt/data/loop-v6/focus-{width}.png',full_page=True)
  print('PASS',width)
  context.close()
 browser.close()
