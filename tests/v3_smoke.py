from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[2] / 'loop-ai-standalone.html'
shots=Path(__file__).resolve().parents[1] / 'previews';shots.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    for width,height in [(390,844)]:
      context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=True,has_touch=True)
      page=context.new_page();page.set_default_timeout(6500);errs=[]
      page.on('pageerror',lambda e:errs.append(str(e)))
      page.evaluate("""() => {const db={};Object.defineProperty(window,'localStorage',{configurable:true,get:()=>({getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k],clear:()=>{for(const k of Object.keys(db))delete db[k]}})})}""");page.set_content(ROOT.read_text(),wait_until='load');expect(page.get_by_text('Учись.',exact=False).first).to_be_visible()
      page.locator('[data-act=onb-next]').click();page.locator('[data-track=builder]').first.click();page.locator('[data-act=onb-next]').click();page.locator('#nick').fill('Тест');page.locator('[data-act=finish-onb]').click()
      expect(page.get_by_text('SKILL CHECK',exact=False)).to_be_visible(timeout=5000)
      print('AUDIT',width,flush=True);page.screenshot(path=str(shots/f'audit-{width}.png'),full_page=True)
      for i in range(12):
        if page.locator('#audit-input').count():page.locator('#audit-input').fill('1234')
        else: page.locator('[data-act=audit-choice]').first.click()
        page.locator('[data-act=audit-confidence][data-value=guess]').click()
        page.locator('[data-act=audit-submit]').click()
      expect(page.get_by_text('Доказанная уверенность в ответах')).to_be_visible()
      page.locator('[data-act=go-home]').first.click()
      expect(page.locator('.studio-hero')).to_be_visible()
      print('HOME',width,flush=True);page.screenshot(path=str(shots/f'home-{width}.png'),full_page=True)
      assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'), 'horizontal overflow home'
      page.locator('[data-act=dojo-start]').first.click();expect(page.locator('[data-dojo-time]')).to_be_visible()
      print('DOJO',width,flush=True);page.screenshot(path=str(shots/f'dojo-{width}.png'),full_page=True)
      page.locator('[data-act=dojo-answer]').first.click();expect(page.locator('.dojo-feedback')).to_be_visible();page.locator('[data-act=dojo-next]').click();page.locator('[data-act=dojo-exit]').click()
      page.locator('[data-act=clinic-open]').first.click();expect(page.locator('#clinic-note')).to_be_visible()
      print('CLINIC',width,flush=True);page.screenshot(path=str(shots/f'clinic-{width}.png'),full_page=True)
      page.locator('#clinic-note').fill('Цель: добавить импорт данных без изменения других экранов. Подтвердить через тесты JSON, ошибки, показ diff, затем smoke test. Не трогать секретные ключи. ')
      page.locator('[data-act=clinic-review]').click();expect(page.locator('.clinic-rubric')).to_be_visible()
      page.locator('.clinic-check').first.check();page.locator('.clinic-check').nth(1).check();page.locator('.clinic-check').nth(2).check();page.locator('.clinic-check').nth(3).check()
      page.locator('[data-act=clinic-finish]').click()
      page.locator('[data-act=back]').first.click();page.locator('[data-act=nav][data-to=library]').last.click();expect(page.locator('.studio-module')).to_have_count(9)
      print('PATH',width,flush=True);page.screenshot(path=str(shots/f'path-{width}.png'),full_page=True)
      assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'), 'horizontal overflow path'
      page.locator('[data-act=nav][data-to=courses]').first.click() if page.locator('[data-act=nav][data-to=courses]').count() else None
      assert not errs, f'js errors {width}: {errs}'
      print(f'PASS {width}x{height}: audit, home, sprint, clinic, 9 modules, no runtime error')
      context.close()
    browser.close()
