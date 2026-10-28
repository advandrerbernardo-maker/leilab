import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../laws-extra.js',import.meta.url),'utf8');
const scope={window:{}};vm.createContext(scope);vm.runInContext(js,scope);
test('amostra em quatro códigos legais, com fontes oficiais',()=>{
  const articles=scope.window.LEILAB_EXTRA_ARTICLES,catalog=scope.window.LEILAB_CATALOG;
  assert.equal(articles.length,10);
  assert.ok(catalog.length>=8);
  for(const law of ['Constituição Federal','Código Penal','Código Civil','Código de Processo Civil'])assert.ok(articles.some(a=>a.law===law),law);
  assert.equal(new Set(articles.map(a=>a.id)).size,articles.length);
  assert.ok(articles.every(a=>new URL(a.source).hostname.endsWith('planalto.gov.br')&&a.excerpt===true));
});
