import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
test('abas e navegação estão presentes',()=>{for(const tab of ['inicio','leis','edital','questoes','revisoes'])assert.match(html,new RegExp(`'${tab}'`))});
test('PWA tem manifesto, ícones e service worker',()=>{assert.match(html,/rel="manifest"/);assert.match(html,/serviceWorker.register/);assert.equal(manifest.display,'standalone');for(const icon of manifest.icons)assert.ok(existsSync(new URL('..'+icon.src.slice(1),import.meta.url)));assert.match(sw,/CACHE_NAME/)});
test('há conteúdo de demonstração e aviso de limitações',()=>{assert.match(html,/const ARTICLES=/);assert.match(html,/const QUESTIONS=/);assert.match(html,/protótipo funcional e limitado/i)});
test('não há chave API aparente nos arquivos do app',()=>{assert.doesNotMatch(html,/(sk_live_|sk_test_|SUPABASE_SERVICE_ROLE_KEY|BEGIN PRIVATE KEY)/)});

test('manifesto identifica o LeiLab sem conflito de escopo',()=>{
  assert.equal(manifest.id,'/leilab/');
  assert.equal(manifest.start_url,'/leilab/');
  assert.equal(manifest.scope,'/leilab/');
  assert.match(html,/Versão demonstrativa 0\.5\.2/);
});

test('biblioteca e voz configurável estão presentes',()=>{
  assert.match(html,/LEILAB_EXTRA_ARTICLES/);
  assert.match(html,/setVoiceChoice/);
  assert.match(html,/getPortugueseVoices/);
  assert.match(html,/toggleSpeechPause/);
  assert.match(sw,/laws-extra\.js/);
  assert.ok(existsSync(new URL('../laws-extra.js',import.meta.url)));
});

test('fluxos Replica e cache offline da nova versão',()=>{
  for(const item of ['function openQuestionsFor','function openDaily','function openSimulation','function flashcardsPanel','function editalEnhancements','function importEditalText','wordmasked','hiddenWords'])assert.ok(html.includes(item),'Ausente: '+item);
  assert.match(html,/replica-core\.js/);
  assert.match(sw,/replica-core\.js/);
  assert.ok(existsSync(new URL('../replica-core.js',import.meta.url)));
});

test('detecção de versão e atualização preserva armazenamento local',()=>{
  assert.match(html,/const APP_VERSION='0\.5\.2'/);
  assert.match(html,/checkForUpdates\(true\)/);
  assert.match(html,/updateBanner/);
  assert.match(html,/version\.json/);
  assert.match(sw,/version\.json/);
  assert.match(sw,/leilab-shell-v10/);
  assert.ok(existsSync(new URL('../version.json',import.meta.url)));
});

test('aquecimento diário mantém tentativas independentes e permite reiniciar',()=>{
 assert.match(html,/dailyAnswers/);
 assert.match(html,/function restartDaily/);
 assert.match(html,/questionMode==='daily'\?\(app\.dailyAnswers/);
 assert.match(html,/Aquecimento de hoje/);
});

test('biblioteca oficial com navegação e versão 0.5',()=>{
 assert.match(html,/official-articles\.js/);
 assert.match(html,/lawchapter/);
 assert.match(html,/Texto integral do artigo selecionado/);
 assert.match(html,/const OFFICIAL=/);
 assert.match(sw,/official-articles\.js/);
 assert.ok(existsSync(new URL('../official-articles.js',import.meta.url)));
});

test('leitor acessível no celular com retorno às questões e tamanho ajustável',()=>{
  assert.match(html,/function readFromQuestion/);
  assert.match(html,/function returnToQuestions/);
  assert.match(html,/function changeReaderSize/);
  assert.match(html,/id="readerContent"/);
  assert.match(html,/Voltar às questões/);
  assert.match(html,/reader-loc|reading-header/);
});

test('cabeçalho do leitor não deixa texto vazar durante a rolagem',()=>{
 const css=html.match(/\.reading-header\{([^}]*)\}/)?.[1]||'';
 assert.match(css,/position:sticky/);
 assert.match(css,/background:#fff/);
 assert.doesNotMatch(css,/rgba\(/);
 assert.match(css,/isolation:isolate/);
});
