import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../replica-core.js',import.meta.url),'utf8');
const window={};
vm.runInNewContext(source,{window});
const api=window.LEILAB_REPLICA,bank=window.LEILAB_REPLICA_QUESTIONS;
const catalog=[{name:'Constituição Federal'},{name:'Código Penal'},{name:'Código Civil'},{name:'Código de Processo Civil'}];
test('reconhece leis do edital e marca leis externas não cadastradas',()=>{
 const result=api.detectEdital('Constituição Federal\nCódigo Penal\nLei 10.406/2002\nLei 8.112/1990',catalog);
 assert.ok(result.found.includes('Constituição Federal'));
 assert.ok(result.found.includes('Código Penal'));
 assert.ok(result.found.includes('Código Civil'));
 assert.ok(result.missing.some(x=>x.includes('8.112')));
});
test('questões autorais são relacionadas a artigos sem IDs repetidos',()=>{
 assert.equal(bank.length,11);
 assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
 assert.ok(bank.every(q=>['boolean','undefined'].includes(typeof q.answer)&&typeof q.why==='string'&&q.why.length>20));
});
test('aquecimento diário retorna no máximo cinco questões',()=>{
 const ids=api.dailyQuestionIds(bank,['cp1','cp2'],'2026-10-28');
 assert.ok(ids.length<=5&&ids.length>0);
 assert.deepEqual(Array.from(ids),Array.from(api.dailyQuestionIds(bank,['cp1','cp2'],'2026-10-28')));
 assert.ok(ids.every(id=>bank.find(q=>q.id===id)?.article.startsWith('cp')));
});
test('progresso por matéria soma artigos lidos corretamente',()=>{
 const stats=api.subjectStats([{id:'a',subject:'Penal'},{id:'b',subject:'Penal'},{id:'c',subject:'Civil'}],{a:true});
 const p=stats.find(x=>x.subject==='Penal');
 assert.equal(p.total,2);assert.equal(p.read,1);
});
test('dados antigos permanecem legíveis pelo modelo novo',()=>{
 assert.ok(api.cardText({text:'Art. 1º. Direitos e deveres.'}).includes('Art.'));
});
