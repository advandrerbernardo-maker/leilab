# LeiLab 0.2 | PWA independente de estudos jurídicos

Protótipo gratuito desenvolvido com código próprio, inspirado apenas em funcionalidades gerais de ferramentas de estudo de legislação. **Não é o aplicativo Estudo Lei Seca e não inclui sua marca, seu código ou banco de questões.**

## O que está funcionando

- Biblioteca de **quatro artigos demonstrativos** da Constituição Federal com links para conferência na fonte oficial.
- Busca textual, destaque por palavra e notas locais por artigo.
- **Sete questões autorais de exemplo** com resposta, explicação e caderno de erros.
- Meu edital demonstrativo, status de leitura, revisões D+1/D+7/D+30.
- Leitura em voz alta quando o navegador oferecer síntese de voz.
- Backup JSON local (exportação e importação).
- Interface responsiva e PWA com cache do aplicativo para uso offline após a primeira visita.

**Os dados são salvos somente no navegador de cada aparelho.** Ainda não há login, sincronização, banco completo, atualização automática da legislação, backend, jurisprudência ou assinatura. O conteúdo jurídico é ilustrativo e deve ser conferido nas fontes oficiais. Evite anotações sensíveis nesta versão.

## Abrir e testar

Sem dependências de pacotes. No computador, execute `python3 -m http.server 8000` na pasta do projeto e abra `http://localhost:8000`. Ou publique em HTTPS (veja abaixo). Em arquivos `file://`, o modo offline/PWA não funciona corretamente.

Para rodar verificações automatizadas com Node.js: `npm test` (usa apenas bibliotecas nativas do Node).

## Publicar gratuitamente no GitHub Pages

1. Crie um **novo repositório público** no GitHub, de nome `leilab`. Não use outro repositório de aplicativo já existente.
2. Envie estes arquivos para a raiz do repositório (o ChatGPT pode adicionar os arquivos depois de receber o endereço do repositório criado).
3. Em **Settings > Pages**, configure **Build and deployment > Deploy from a branch**, `main`, pasta `/ (root)` e clique em **Save**.
4. Após a publicação, abra a URL fornecida pelo GitHub Pages, teste no Chrome do celular e escolha **Adicionar à tela inicial** ou **Instalar app**, se aparecer.

No GitHub Free, o Pages funciona gratuitamente para repositórios públicos. Não coloque informações privadas, senhas ou chaves na publicação.

## Estrutura

- `index.html`: aplicativo HTML, CSS e JS sem dependências externas.
- `manifest.webmanifest`, `sw.js`, `assets/`: recursos de instalação e cache offline do PWA.
- `tests/`: verificações iniciais do pacote.
- `replica/`: mapeamento funcional, arquitetura, prioridades e plano das próximas etapas.

## Etapas futuras

1. Ampliar biblioteca com fontes oficiais conferidas e mecanismo de versionamento.
2. Autenticação e sincronização, com isolamento por usuário e testes de permissões.
3. Estudos por concurso/edital, jurisprudência e questões com direitos de uso verificados.
4. Publicação comercial somente depois de testes, privacidade e segurança.