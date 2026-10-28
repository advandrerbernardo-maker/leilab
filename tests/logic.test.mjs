import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Script principal deve existir');
function createDemo(){
  const elements = new Map();
  const stored=new Map();
  const element=id => {
    if(!elements.has(id)) elements.set(id,{innerHTML:'',value:''});
    return elements.get(id);
  };
  const scope={
    console,
    navigator:{},
    window:{scrollTo(){}},
    document:{getElementById:element},
    localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},
    confirm:()=>true,
  };
  vm.createContext(scope);
  vm.runInContext(script,scope,{filename:'index-inline.js'});
  return {scope,stored,element,get:()=>vm.runInContext('app',scope)};
}
test('script principal carrega e mostra a aba inicial',()=>{
  const demo=createDemo();
  assert.match(demo.element('view').innerHTML,/Estude a lei/);
  assert.match(demo.element('mobilenav').innerHTML,/Questões/);
});
test('concluir artigo agenda revisão D+1',()=>{
  const demo=createDemo();
  demo.scope.completeArticle('cf1');
  assert.equal(demo.get().read.cf1,true);
  assert.equal(demo.get().reviews.cf1.stage,0);
  assert.match(demo.get().reviews.cf1.due,/^\d{4}-\d{2}-\d{2}$/);
});
test('responder questão salva tentativa e conta acerto',()=>{
  const demo=createDemo();
  demo.scope.answerQ('q1',true);
  assert.equal(demo.get().answered,1);
  assert.equal(demo.get().hits,1);
  assert.equal(demo.get().attempts.q1.correct,true);
  assert.equal(demo.stored.has('leilab_demo_01'),true);
});
test('anotação salva ao digitar, sem esperar botão',()=>{
  const demo=createDemo();
  demo.scope.saveNoteDraft('cf1','Minha anotação');
  assert.equal(demo.get().notes.cf1,'Minha anotação');
  assert.ok(JSON.parse(demo.stored.get('leilab_demo_01')).notes.cf1);
});

test('trocar resposta de uma questão não infla estatísticas',()=>{
  const demo=createDemo();
  demo.scope.answerQ('q1',true);
  demo.scope.answerQ('q1',true);
  assert.equal(demo.get().answered,1);
  assert.equal(demo.get().hits,1);
  demo.scope.answerQ('q1',false);
  assert.equal(demo.get().answered,1);
  assert.equal(demo.get().hits,0);
  assert.equal(demo.get().errors.q1,true);
  demo.scope.answerQ('q1',true);
  assert.equal(demo.get().answered,1);
  assert.equal(demo.get().hits,1);
  assert.ok(!demo.get().errors.q1);
});
