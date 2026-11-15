import test from 'node:test';
import assert from 'node:assert/strict';
import {SPEC_STEPS,safeSpecStep,specStepStatus} from '../spec-flow.mjs';
test('beginner workbench reveals five individual questions, not a long questionnaire',()=>{
 assert.equal(SPEC_STEPS.length,5);
 assert.deepEqual(SPEC_STEPS.map(x=>x.key),['title','goal','scenarios','constraints','criteria']);
 assert.ok(SPEC_STEPS.every(x=>x.help&&x.sample&&x.title));
});
test('step index never points outside the wizard',()=>{
 assert.equal(safeSpecStep(-7),0);assert.equal(safeSpecStep(999),4);
 assert.equal(safeSpecStep('3'),3);assert.equal(safeSpecStep('bad'),0);
});
test('draft status cannot certify competence',()=>{
 assert.equal(specStepStatus(1,{goal:''}),'empty');
 assert.equal(specStepStatus(1,{goal:'Я хочу помочь футболистам улучшать игру.'}),'started');
 assert.equal(specStepStatus(1,{goal:'[Что делает]'}),'placeholder');
});
