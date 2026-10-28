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
  assert.match(html,/Versão demonstrativa 0\.2/);
});
