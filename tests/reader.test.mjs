import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const inline=read('index.html').match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
function session(saved){
 const elements=new Map(),stored=new Map(saved?Object.entries(saved):[]),scrolls=[];
 const get=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',style:{},hidden:false});return elements.get(id)};
 const scope={
  window:{scrollY:0,scrollTo(options){scrolls.push(options);this.scrollY=options.top||0}},
  document:{getElementById:get,body:{appendChild(){}},createElement(){return {style:{}}}},
  navigator:{},console,confirm:()=>true,setTimeout:()=>1,clearTimeout:()=>{},
  localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)}
 };
 vm.createContext(scope);
 for(const p of ['laws-extra.js','replica-core.js','official-articles.js'])vm.runInContext(read(p),scope);
 vm.runInContext(inline,scope,{filename:'index-inline.js'});
 return {scope,elements,scrolls,stored,get,app:()=>vm.runInContext('app',scope)};
}
test('abrir questão do CP art. 2 leva ao artigo exato e permite voltar',()=>{
 const s=session();
 s.scope.openQuestionsFor('cp2');
 assert.match(s.get('view').innerHTML,/Treino do dispositivo: Código Penal · Art. 2º/);
 s.scope.window.scrollY=412;
 s.scope.readFromQuestion('cp2');
 const reader=s.get('view').innerHTML;
 assert.match(reader,/Código Penal · Art. 2º/);
 assert.match(reader,/Ninguém/);
 assert.match(vm.runInContext('getArt("cp2").text',s.scope),/Ninguém pode ser punido por fato/);
 assert.doesNotMatch(reader,/A República Federativa do Brasil, formada pela união indissolúvel/);
 assert.match(reader,/Voltar às questões/);
 s.scope.returnToQuestions();
 assert.match(s.get('view').innerHTML,/Treino do dispositivo: Código Penal · Art. 2º/);
 assert.equal(s.scrolls.at(-1).top,412);
});
test('leitura oferece tamanho ajustável e persiste sem apagar notas',()=>{
 const existing={notes:{cp2:'Nota do artigo'},answered:7,hits:6,attempts:{q1:{selection:true,correct:true}}};
 const s=session({'leilab_demo_01':JSON.stringify(existing)});
 s.scope.navigate('leis','cp2');
 assert.match(s.get('view').innerHTML,/id="readerContent" style="font-size:17px"/);
 s.scope.changeReaderSize(1);
 assert.equal(s.app().readerSize,18);
 assert.equal(s.app().notes.cp2,'Nota do artigo');
 assert.equal(s.app().answered,7);
 assert.equal(s.get('readerContent').style.fontSize,'18px');
 assert.equal(JSON.parse(s.stored.get('leilab_demo_01')).readerSize,18);
 s.scope.changeReaderSize(20);
 assert.equal(s.app().readerSize,22);
 s.scope.changeReaderSize(-20);
 assert.equal(s.app().readerSize,15);
});
test('marcadores preservam a posição de leitura',()=>{
 const s=session();
 s.scope.navigate('leis','cf1');
 s.scope.window.scrollY=600;
 s.scope.setMarker('green');
 assert.equal(s.scrolls.at(-1).top,600);
 assert.equal(s.app().notes.cf1??'','');
});
