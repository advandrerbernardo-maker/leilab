import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
function session(saved){
 const records=new Map(saved?Object.entries(saved):[]);
 const elements=new Map();
 const get=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',value:'',textContent:'',style:{},hidden:false});return elements.get(id)};
 const scope={
  window:{scrollTo(){},scrollY:0},
  document:{getElementById:get,body:{appendChild(){}},createElement:()=>({style:{},click(){}})},
  navigator:{},console,confirm:()=>true,setTimeout:()=>1,clearTimeout:()=>{},
  localStorage:{getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)}
 };
 vm.createContext(scope);
 for(const file of ['laws-extra.js','replica-core.js','official-articles.js','library-expansion.js'])vm.runInContext(read(file),scope,{filename:file});
 vm.runInContext(script,scope,{filename:'index-inline.js'});
 return {scope,records,get,app:()=>vm.runInContext('app',scope),articles:()=>vm.runInContext('ARTICLES',scope),questions:()=>vm.runInContext('QUESTIONS',scope)};
}
test('textos oficiais têm fonte, identificação e IDs únicos',()=>{
 const s=session(),a=s.articles(),q=s.questions();
 assert.equal(a.length,49);
 assert.equal(q.length,55);
 assert.equal(new Set(a.map(x=>x.id)).size,a.length);
 assert.equal(new Set(q.map(x=>x.id)).size,q.length);
 assert.ok(q.every(x=>a.some(y=>y.id===x.article)));
 const official=a.filter(x=>x.textStatus==='integral');
 assert.equal(official.length,47);
 for(const x of official){
  assert.ok(x.source.startsWith('https://'));
  assert.equal(x.verifiedAt,'2026-10-28');
  assert.ok(x.text.includes('Art.'));
 }
 assert.equal(a.find(x=>x.id==='cf37').textStatus,'caput');
 assert.equal(a.find(x=>x.id==='cf5').textStatus,'resumo');
});
test('Código Civil, CP e CPC mostram texto legal, não resumo',()=>{
 const s=session();
 const ids=['cp1','cp2','cp3','cp4','cc1','cc2','cc3','cc4','cpc1','cpc2','cpc3','cpc4','cpc5','cpc6','cpc7','cpc8'];
 for(const id of ids)assert.equal(s.articles().find(a=>a.id===id)?.textStatus,'integral');
 const cpc=s.articles().find(a=>a.id==='cpc3').text;
 assert.match(cpc,/§ 3º A conciliação/);
 assert.match(s.articles().find(a=>a.id==='cp2').text,/Parágrafo único/);
 assert.match(s.articles().find(a=>a.id==='cc4').text,/IV - os pródigos/);
});
test('leitor navega artigos do mesmo código e permite questões relacionadas',()=>{
 const s=session();s.scope.navigate('leis','cpc3');
 const view=s.get('view').innerHTML;
 assert.match(view,/Texto integral do artigo selecionado/);
 assert.match(view,/cpc2/);
 assert.match(view,/cpc4/);
 assert.match(view,/Questões \(/);
 s.scope.openQuestionsFor('cc4');
 assert.match(s.get('view').innerHTML,/incapazes/);
});
test('anotações e questões antigas continuam presentes após migração',()=>{
 const storage={'leilab_demo_01':JSON.stringify({notes:{cp1:'Minha nota antiga'},answered:7,hits:5,attempts:{q1:{selection:true,correct:true}},errors:{q5:true},editals:['cf1','cp1'],highlights:{}})};
 const s=session(storage);
 assert.equal(s.app().notes.cp1,'Minha nota antiga');
 assert.equal(s.app().answered,7);
 assert.equal(s.app().hits,5);
 assert.equal(s.app().errors.q5,true);
 s.scope.navigate('leis','cp1');
 assert.match(s.get('view').innerHTML,/Minha nota antiga/);
 assert.equal(s.app().read.cp1,undefined);
});
