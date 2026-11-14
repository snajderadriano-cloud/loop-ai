// Runs user-authored Python in an isolated browser worker with Pyodide.
// Requires initial CDN download. This is NOT a general shell or a secure multi-user code sandbox.
const PYODIDE='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs';
const CHECKS=`cases = [
    (-0.2, "Ошибка"),
    (0.30, "Отклонён"),
    (0.50, "Нужна проверка"),
    (0.72, "Нужна проверка"),
    (0.80, "Принят"),
    (0.95, "Принят"),
    (1.5, "Ошибка"),
]
__loop_passed = 0
for value, expected in cases:
    try:
        actual = check_answer(value)
        if actual == expected:
            __loop_passed += 1
            print(f"✓ {value}: {actual}")
        else:
            print(f"✗ {value}: ожидалось {expected!r}, получено {actual!r}")
    except Exception as exc:
        print(f"✗ {value}: ошибка {type(exc).__name__}: {exc}")
print(f"Тесты: {__loop_passed}/7")
`;
let pythonPromise=null;
async function ensurePython(){if(!pythonPromise)pythonPromise=(async()=>{const {loadPyodide}=await import(PYODIDE);return loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});})();return pythonPromise;}
self.onmessage=async ({data})=>{
 if(data?.type!=='run')return;
 const source=String(data.source||'').slice(0,25000);
 const verify=data.verify===true;
 const out=[];
 const emit=s=>{if(out.join('\n').length<8000)out.push(String(s));};
 try{
   self.postMessage({type:'status',message:'Загружаем Python в браузере… Первый запуск может быть долгим.'});
   const py=await ensurePython();
   py.setStdout({batched:emit});py.setStderr({batched:emit});
   self.postMessage({type:'ready'});
   py.globals.set('__loop_user_source',source);
   py.runPython("__loop_scope = {'__name__': '__main__'}");
   try{
     await py.runPythonAsync("exec(compile(__loop_user_source,'editor.py','exec'), __loop_scope)");
   }catch(e){emit(`${e.name||'PythonError'}: ${e.message||String(e)}`);self.postMessage({type:'result',passed:0,total:verify?7:0,verified:verify,output:out.join('\n'),error:true});return;}
   if(!verify){self.postMessage({type:'result',passed:0,total:0,verified:false,output:out.join('\n')||'Программа завершилась без вывода. Добавь print(...), чтобы увидеть результат.',error:false});return;}
   emit('\n--- Проверка задания ---');
   let passed=0;
   try{
      py.globals.set('__loop_checks',CHECKS);
      await py.runPythonAsync("exec(__loop_checks, __loop_scope)");
      passed=Number(py.runPython("__loop_scope.get('__loop_passed', 0)"))||0;
   }catch(e){emit(`${e.name||'PythonError'}: ${e.message||String(e)}`);}
   self.postMessage({type:'result',passed,total:7,verified:true,output:out.join('\n'),error:false});
 }catch(e){self.postMessage({type:'error',message:'Python не загрузился: '+String(e?.message||e)+'. Проверь соединение и попробуй ещё раз.'});}
};
