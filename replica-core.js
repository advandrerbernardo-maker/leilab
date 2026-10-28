/* LeiLab / Replica 0.4. Conteúdo e lógica originais, sem código ou dados privados de terceiros. */
(function(root){
'use strict';
const aliases=[
 ['Constituição Federal',['constituição federal','cf/88','constituição da república']],
 ['Código Penal',['código penal','decreto-lei 2848','decreto lei 2848']],
 ['Código Civil',['código civil','lei 10406','lei 10.406']],
 ['Código de Processo Civil',['código de processo civil','lei 13105','lei 13.105']],
 ['Código de Processo Penal',['código de processo penal','decreto-lei 3689']],
 ['Código de Trânsito Brasileiro',['código de trânsito brasileiro','lei 9503','lei 9.503','ctb']],
 ['Estatuto da Criança e do Adolescente',['estatuto da criança e do adolescente','lei 8069','lei 8.069']],
 ['Código de Defesa do Consumidor',['código de defesa do consumidor','lei 8078','lei 8.078']]
];
function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/(\d)[.\s](?=\d)/g,'$1').replace(/\s+/g,' ').trim()}
function detectEdital(text,catalog){
 const input=String(text||'').slice(0,20000),normalized=normalize(input),found=[];
 const names=(catalog||[]).map(c=>c.name);
 for(const [law,keywords] of aliases){
  if(!names.includes(law))continue;
  if([law,...keywords].some(a=>normalized.includes(normalize(a))))found.push(law);
 }
 const missing=[];
 for(const match of input.matchAll(/(?:lei(?:\s+(?:complementar|federal|estadual|municipal))?|decreto(?:-lei)?|lc)\s*(?:n[º°.]?\s*)?(\d{1,6}(?:[.\s]\d{3})?(?:\/\d{2,4})?)/gi)){
  const ref=match[0].trim(),num=normalize(match[1]).replace(/\/\d{2,4}$/,'');
  const known=aliases.some(([law,terms])=>found.includes(law)&&terms.some(t=>normalize(t).replace(/\D/g,'')===num));
  if(!known&&!missing.includes(ref))missing.push(ref);
 }
 return {found,missing:missing.slice(0,30),hasInput:!!normalized};
}
function dailyQuestionIds(questions,selected,date){
 const pool=questions.filter(q=>!selected||!selected.length||selected.includes(q.article));
 const use=pool.length?pool:questions;
 const day=String(date||'').split('').reduce((n,s)=>(n*31+s.charCodeAt(0))>>>0,7);
 const rank=id=>id.split('').reduce((n,s)=>(n*33+s.charCodeAt(0))>>>0,day)%997;
 return use.slice().sort((a,b)=>rank(a.id)-rank(b.id)||a.id.localeCompare(b.id)).slice(0,5).map(q=>q.id);
}
function subjectStats(articles,read){
 const rows=new Map();
 for(const a of articles){const key=a.subject,row=rows.get(key)||{subject:key,read:0,total:0};row.total++;if(read[a.id])row.read++;rows.set(key,row)}
 return Array.from(rows.values()).sort((a,b)=>a.subject.localeCompare(b.subject,'pt-BR'));
}
function cardText(article){const clean=String(article?.text||'').replace(/\s+/g,' ').trim();return clean.length>280?clean.slice(0,277)+'…':clean}
const questions=[
 {id:'cpq1',article:'cp1',text:'A criação de crime e a cominação de pena dependem de lei anterior ao fato.',answer:true,why:'Correto. Legalidade e anterioridade penal, conforme o art. 1º do Código Penal.'},
 {id:'cpq2',article:'cp1',text:'O costume pode criar crime e pena mesmo sem previsão em lei.',answer:false,why:'Errado. Somente lei anterior define crime e prevê pena.'},
 {id:'cpq3',article:'cp2',text:'Uma lei posterior que deixe de considerar o fato criminoso afasta a execução da pena relativa a esse fato.',answer:true,why:'Correto. A lei penal descriminalizadora retroage, conforme o art. 2º do Código Penal.'},
 {id:'cpq4',article:'cp4',text:'O tempo do crime, no Código Penal, é sempre o momento em que surge o resultado.',answer:false,why:'Errado. O art. 4º considera o momento da ação ou omissão.'},
 {id:'ccq1',article:'cc1',text:'Toda pessoa é capaz de direitos e deveres na ordem civil.',answer:true,why:'Correto, conforme o art. 1º do Código Civil.'},
 {id:'ccq2',article:'cc2',text:'Os direitos do nascituro só ficam resguardados depois do nascimento com vida.',answer:false,why:'Errado. O art. 2º resguarda seus direitos desde a concepção.'},
 {id:'ccq3',article:'cc3',text:'Menores de dezesseis anos são absolutamente incapazes de exercer pessoalmente os atos da vida civil.',answer:true,why:'Correto, conforme o art. 3º do Código Civil.'},
 {id:'cpcq1',article:'cpc1',text:'As normas fundamentais da Constituição orientam a interpretação e a aplicação do processo civil.',answer:true,why:'Correto. É o sentido do art. 1º do CPC.'},
 {id:'cpcq2',article:'cpc2',text:'O processo civil sempre começa de ofício, independentemente de iniciativa da parte.',answer:false,why:'Errado. Em regra, começa por iniciativa da parte, conforme o art. 2º do CPC.'},
 {id:'cpcq3',article:'cpc3',text:'A lei pode excluir do Judiciário toda ameaça a direito quando houver alternativa administrativa.',answer:false,why:'Errado. O art. 3º do CPC preserva a apreciação de lesão ou ameaça a direito.'},
 {id:'cfq5',article:'cf5',text:'Igualdade, liberdade e segurança estão entre as garantias tratadas no art. 5º da Constituição.',answer:true,why:'Correto. O art. 5º trata de direitos e garantias fundamentais.'}
];
root.LEILAB_REPLICA={normalize,detectEdital,dailyQuestionIds,subjectStats,cardText};
root.LEILAB_REPLICA_QUESTIONS=questions;
})(window);
