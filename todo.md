# Clash Royale Chatbot - TODO

## Banco de Dados e Backend
- [x] Criar schema de banco de dados para cartas do Clash Royale
- [x] Implementar migrations do banco de dados
- [x] Criar tRPC procedure para listar todas as cartas
- [x] Criar tRPC procedure para buscar carta por ID
- [x] Criar tRPC procedure para filtrar cartas por tipo/custo
- [x] Criar schema para histórico de chat
- [x] Implementar tRPC procedure para salvar mensagens de chat
- [x] Implementar tRPC procedure para obter histórico de chat
- [x] Integrar LLM para respostas inteligentes sobre cartas
- [x] Implementar sistema de notificação ao proprietário

## Frontend - Interface do Chat
- [x] Criar componente AIChatBox customizado
- [x] Implementar histórico de mensagens persistente
- [x] Adicionar suporte a streaming de respostas
- [x] Implementar renderização de markdown nas respostas
- [x] Adicionar indicador de digitação/carregamento
- [x] Implementar scroll automático para novas mensagens

## Frontend - Página Inicial
- [x] Criar layout da página inicial
- [x] Adicionar apresentação do chatbot
- [x] Implementar exemplos de perguntas clicáveis
- [x] Criar seção de features
- [x] Adicionar call-to-action para iniciar chat

## Frontend - Sistema de Busca e Filtros
- [x] Criar componente de busca de cartas
- [x] Implementar filtro por tipo de carta
- [x] Implementar filtro por custo de elixir
- [x] Criar componente de exibição de cartas
- [x] Adicionar exibição com detalhes da carta

## Design e Estilo
- [x] Definir paleta de cores inspirada em Clash Royale
- [x] Criar design system com componentes customizados
- [x] Implementar tema clássico e elegante
- [x] Aplicar design responsivo
- [x] Adicionar animações e transições suaves
- [x] Customizar fontes e tipografia

## Testes e Validação
- [x] Testar procedures de chat com vitest
- [x] Testar filtros e busca de cartas
- [x] Validar streaming de respostas
- [x] Testar notificações ao proprietário
- [x] Validar responsividade em diferentes dispositivos

## Deployment
- [x] Revisar e corrigir bugs
- [x] Otimizar performance
- [ ] Criar checkpoint final
- [ ] Publicar site


## Nova Funcionalidade - Cartas Populares
- [x] Atualizar schema para rastrear uso de cartas
- [x] Criar tabela de estatísticas de uso
- [x] Implementar tRPC procedure para obter cartas populares
- [x] Criar página de cartas populares
- [x] Adicionar gráficos de popularidade
- [x] Integrar com página inicial
- [x] Testar nova funcionalidade


## Nova Funcionalidade - Comparador de Cartas
- [x] Criar tRPC procedure para comparar duas cartas
- [x] Implementar seletor de cartas com autocomplete
- [x] Criar layout de comparação lado a lado
- [x] Adicionar gráficos comparativos de estatísticas
- [x] Implementar análise de vantagens/desvantagens
- [x] Integrar com navegação do site
- [x] Testar funcionalidade de comparação


## Nova Funcionalidade - Exportar Comparação como PNG
- [x] Instalar biblioteca html-to-image
- [x] Criar função de captura de elemento como imagem
- [x] Implementar download automático da imagem
- [x] Adicionar botão de exportação na interface
- [x] Estilizar área de exportação para melhor visualização
- [x] Testar funcionalidade em diferentes navegadores


## Nova Funcionalidade - Construtor de Decks
- [x] Atualizar schema para tabela de decks
- [x] Criar tRPC procedures para CRUD de decks
- [x] Implementar página de construtor de decks
- [x] Adicionar seletor de cartas com busca
- [x] Implementar validação de custo médio de elixir
- [x] Criar sugestões automáticas de balanceamento
- [x] Adicionar visualização de estatísticas do deck
- [x] Implementar salvamento e carregamento de decks
- [x] Testar funcionalidade de decks


## Nova Funcionalidade - Autocorrect e Imagens de Cartas
- [x] Implementar autocompletar com dropdown
- [x] Adicionar exibição de imagens das cartas
- [x] Criar preview de cartas ao buscar
- [x] Melhorar UX com sugestões inteligentes
- [x] Testar autocorrect e imagens


## Nova Funcionalidade - Compartilhamento de Decks
- [x] Implementar gerador de código de compartilhamento
- [x] Criar URL compartilhável com parâmetros do deck
- [x] Adicionar interface de compartilhamento com botões de cópia
- [x] Implementar página para carregar deck a partir do código
- [x] Adicionar validação de código/URL
- [x] Criar modal/drawer de compartilhamento
- [x] Testar funcionalidade de compartilhamento


## Nova Funcionalidade - Ranking de Clãs e Jogadores
- [x] Atualizar schema para tabelas de clãs e jogadores
- [x] Criar tRPC procedures para rankings
- [x] Implementar página de ranking com abas
- [x] Adicionar visualização de top clãs
- [x] Adicionar visualização de top jogadores
- [x] Criar gráficos de estatísticas
- [x] Implementar filtros e ordenação
- [x] Adicionar sistema de busca
- [x] Testar funcionalidade de rankings


## Melhorias do Chatbot
- [x] Adicionar sugestões de perguntas contextuais
- [x] Implementar quick replies clicáveis
- [x] Melhorar indicador de digitação com animação realista
- [x] Adicionar botão de copiar mensagem
- [x] Implementar botão de limpar conversa
- [x] Adicionar suporte a comandos especiais
- [x] Melhorar formatação de respostas com markdown
- [x] Adicionar feedback de mensagem enviada
- [x] Implementar scroll automático suave
- [x] Testar todas as melhorias


## Nova Funcionalidade - PWA Offline
- [x] Criar manifest.json com metadados da app
- [x] Implementar service worker para cache
- [x] Adicionar detecção de conectividade
- [x] Criar aviso de offline/online
- [x] Implementar sincronização em background
- [x] Adicionar instalação como app
- [x] Testar funcionalidade offline


## Nova Funcionalidade - Sistema de Login
- [x] Criar página de login com formulário
- [x] Implementar botão de login OAuth
- [x] Adicionar menu de usuário autenticado
- [x] Implementar logout
- [x] Proteger rotas autenticadas
- [x] Adicionar perfil de usuário
- [x] Testar fluxo de autenticação
