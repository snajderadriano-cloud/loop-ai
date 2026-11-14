from pathlib import Path
from playwright.sync_api import sync_playwright, expect
root=Path(__file__).resolve().parents[1]
html=(root.parent/'loop-ai-standalone.html').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (320,390,412):
  ctx=browser.new_context(viewport={'width':width,'height':820},device_scale_factor=1)
  page=ctx.new_page();page.set_default_timeout(5000);errors=[]
  page.on('pageerror',lambda err: errors.append(str(err)))
  page.evaluate('''() => {const saved={'loop-ai-v1':JSON.stringify({version:1,profile:{name:'Tester',track:'builder',level:'some',minutes:15},selectedTrack:'builder'})};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>saved[k]??null,setItem:(k,v)=>saved[k]=String(v),removeItem:k=>delete saved[k],clear:()=>{}}});}''')
  page.set_content(html,wait_until='load')
  page.locator('[data-act="open-lesson"]').first.click()
  page.locator('[data-act="open-lab"]').first.click()
  page.locator('[data-act="workbench-open"]').click()
  expect(page.locator('[data-spec-field="goal"]')).to_be_visible()
  assert page.locator('[data-spec-field]').count()==5
  page.locator('[data-spec-field="title"]').fill('AI Notes')
  page.locator('[data-spec-field="goal"]').fill('Хочу построить простую систему поиска по заметкам, которая отвечает с проверяемыми ссылками на источники.')
  page.locator('[data-spec-field="scenarios"]').fill('1. Пользователь загружает три заметки и видит их названия.\n2. Пользователь задаёт вопрос и получает ответ с цитатой.\n3. Если ответа нет, система сообщает что ответа в данных нет.')
  page.locator('[data-spec-field="constraints"]').fill('- Входные данные остаются на устройстве, пока пользователь их не отправит.\n- Прототип работает без платных API сервисов.')
  page.locator('[data-spec-field="criteria"]').fill('1. При загрузке трёх файлов отображаются ровно три карточки.\n2. По запросу виден фрагмент исходного файла со ссылкой.\n3. При отсутствии ответа выводится честное сообщение.\n4. После обновления страницы список заметок сохраняется.')
  page.locator('[data-act="wb-check"]').click()
  expect(page.locator('#wb-output')).to_contain_text('Структура заполнена')
  page.locator('[data-act="wb-spec-mode"][data-mode="source"]').click()
  expect(page.locator('#wb-editor')).to_contain_text('Хочу построить простую систему')
  page.locator('[data-act="workbench-switch"][data-kind="python"]').click()
  expect(page.locator('#wb-editor')).to_be_visible()
  expect(page.locator('[data-act="wb-test"]')).to_be_visible()
  expect(page.locator('[data-act="wb-run"]')).to_be_visible()
  page.locator('#wb-editor').fill('print(2 + 3 * 4)')
  page.locator('[data-act="wb-key"][data-value="    "]').click()
  assert '    ' in page.locator('#wb-editor').input_value()
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),f'overflow {width}: {page.evaluate("document.documentElement.scrollWidth")} px'
  page.screenshot(path=str(root/f'preview-v5-{width}.png'),full_page=True)
  page.locator('[data-act="workbench-switch"][data-kind="spec"]').click()
  page.locator('[data-act="wb-spec-mode"][data-mode="guided"]').click()
  expect(page.locator('[data-spec-field="goal"]')).to_have_value('Хочу построить простую систему поиска по заметкам, которая отвечает с проверяемыми ссылками на источники.')
  assert not errors,errors
  print('ok',width,'editor, guided form, code tools, persistence, no JS errors')
  ctx.close()
 browser.close()
