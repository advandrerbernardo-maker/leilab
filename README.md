# LeiLab 0.4.2 | PWA independente de estudos jurídicos

Protótipo gratuito desenvolvido com código próprio, inspirado apenas em funcionalidades gerais de ferramentas de estudo de legislação. **Não é o aplicativo Estudo Lei Seca e não inclui sua marca, seu código ou banco de questões.**

## O que está funcionando

- Biblioteca com **14 artigos e resumos demonstrativos** de Constituição Federal, Código Penal, Código Civil e CPC, além de links para outros códigos com links para conferência na fonte oficial.
- Busca textual, destaque por palavra e notas locais por artigo.
- **Sete questões autorais de exemplo** com resposta, explicação e caderno de erros.
- Meu edital demonstrativo, status de leitura, revisões D+1/D+7/D+30.
- Modo Teste para ocultar e revelar palavras, flashcards por artigo, aquecimento diário, simulado curto, caderno de erros até acertar e importação básica de leis do edital.
- Leitura em voz alta com seletor de vozes portuguesas oferecidas pelo Android, velocidade ajustável, pausa, retomada e prévia. A qualidade da voz depende do aparelho e do mecanismo de fala instalado; não há serviço de voz premium no protótipo.
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

## Aviso de conteúdo jurídico\n\nOs dispositivos adicionais são **resumos de estudo**, não a transcrição integral nem uma garantia de atualização legal. Use o botão de fonte oficial antes de estudar a redação vigente. A transcrição completa e o versionamento legal ainda estão em desenvolvimento.\n\n## Etapas futuras

1. Ampliar biblioteca com fontes oficiais conferidas e mecanismo de versionamento.
2. Autenticação e sincronização, com isolamento por usuário e testes de permissões.
3. Estudos por concurso/edital, jurisprudência e questões com direitos de uso verificados.
4. Publicação comercial somente depois de testes, privacidade e segurança.
## Referência funcional (Replica)

O LeiLab tem desenvolvimento independente; a organização do ciclo de estudos usa como referência o funcionamento **publicamente descrito** no [guia do ELS](https://app.estudoleiseca.com.br/guia/app-de-lei-seca), no [guia de questões](https://app.estudoleiseca.com.br/guia/questoes-de-lei-seca) e na [importação de edital](https://app.estudoleiseca.com.br/cole-seu-edital). Não reproduz marcas, interface exclusiva, banco de dados de questões, textos editoriais ou backend. 

**Paridade parcial:** as funções do protótipo são limitadas aos artigos e às questões demonstrativas. A importação do edital identifica nomes de leis e só acrescenta os artigos já disponíveis. Não há autenticação, sincronização, jurisprudência indexada, IA, podcast nem acervo completo. Não há atualização automática de legislação.

## Atualização no Android

A partir da 0.4.1, o aplicativo consulta `version.json` quando é aberto ou volta ao primeiro plano. Ao detectar uma versão superior, mostra um aviso e permite atualizar sem apagar o `localStorage`. A versão anterior aberta em uma aba já carregada não ganha esse aviso retroativamente: nesse caso, atualize a página no Chrome usando o mesmo endereço do LeiLab. Não use “Limpar dados” no Chrome para corrigir cache, pois isso pode eliminar respostas e anotações.

Ao responder novamente uma questão já respondida, o painel deixa de contabilizá-la como uma nova questão; mostra o estado atual da resposta sem inflar acertos.

## Aquecimento diário 0.4.2

O filtro "5 do dia" começa sem revelar respostas de tentativas anteriores, mesmo quando a questão já foi respondida em "Todas". As respostas do aquecimento ficam em `dailyAnswers`, agrupadas pela data local. É possível recomeçar o treino do dia sem apagar o histórico geral, as questões erradas, as anotações ou o progresso. O painel geral continua mostrando o número de questões distintas respondidas e o acerto da resposta mais recente; não é um contador de sessões.
