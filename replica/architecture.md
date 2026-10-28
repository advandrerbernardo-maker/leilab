# Arquitetura técnica do LeiLab

## Protótipo 0.2
HTML, CSS e JavaScript próprios em um único index.html. Dados demonstrativos no código; armazenamento localStorage por aparelho; service worker com cache dos arquivos estáticos; manifesto de instalação. Sem backend nem contas.

## Próxima fase
Frontend React + TypeScript + Vite, ou evolução gradual do JavaScript original. Backend Supabase (Auth e Postgres). Row Level Security para notas, marcações, tentativas e progresso por usuário. Índices textuais e versão por dispositivo normativo com data de conferência e origem oficial.

## Dados propostos
User, Statute, StatuteVersion, Article, Highlight, Note, Question, Attempt, UserEdital, EditalArticle, Review, Subscription.

## Validação
Node Test Runner para regressões; Playwright para fluxos mobile. Verificar offline e instalação em Android real. Conteúdo jurídico sempre com referência, versão e conferência humana.

## Hospedagem
GitHub Pages no protótipo público de baixo custo. Para contas e dados reais: frontend na Vercel e backend no Supabase, sempre com variáveis secretas fora do repositório. Domínios, APIs e uso de IA poderão gerar custos.

## Regras mínimas de publicação real
Sem chaves expostas; RLS validada; backups e restauração testados; política de privacidade; exclusão de conta; atualização legislativa verificada; revisão de direitos sobre questões e materiais.
