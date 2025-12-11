# Plataforma de Comunidade Minecraft

Aplicação web full-stack desenvolvida para gerenciar uma comunidade de jogadores de Minecraft, permitindo cadastro de servidores, interação entre usuários através de posts, comentários, likes e chat em tempo real.

## Sobre o Projeto

A plataforma é uma aplicação completa que permite aos usuários se cadastrar, criar e gerenciar posts sobre Minecraft, cadastrar servidores com verificação automática de status, interagir através de comentários e likes, se comunicar via chat privado, gerenciar inventário de itens e receber notificações sobre atividades na plataforma.

O sistema foi desenvolvido seguindo arquitetura de microsserviços, com backend e frontend completamente separados, comunicação via API REST com transferência de dados JSON, e toda a infraestrutura containerizada com Docker.

## Arquitetura

O projeto segue uma arquitetura de três camadas: frontend, backend e banco de dados. O backend é uma API REST construída com NestJS que expõe endpoints para todas as operações. O frontend é uma Single Page Application (SPA) construída com Next.js que consome a API através de requisições HTTP. O banco de dados PostgreSQL armazena todas as informações de forma relacional.

A comunicação entre frontend e backend utiliza JSON para todas as operações GET e POST. O backend valida todas as requisições através de DTOs (Data Transfer Objects) e utiliza guards para proteger rotas que requerem autenticação.

## Backend

O backend foi construído com NestJS, um framework Node.js que utiliza TypeScript e segue padrões de arquitetura modular. A aplicação está organizada em módulos independentes, cada um responsável por uma funcionalidade específica.

### Módulos Implementados

**Autenticação (Auth Module)**: Sistema completo de autenticação utilizando JWT (JSON Web Tokens). Implementa registro de novos usuários com hash de senha usando bcrypt, login com validação de credenciais, e proteção de rotas através de guards. O JWT é enviado no header Authorization de todas as requisições autenticadas.

**Usuários (Users Module)**: Gerenciamento de perfis de usuários com sistema de níveis e experiência. Permite visualização de perfil, atualização de informações e busca de usuários. Implementa relacionamento com todas as outras entidades do sistema.

**Posts (Posts Module)**: Sistema completo de posts com CRUD completo. Permite criação de posts com título, conteúdo, tags e categorias. Implementa paginação, busca por texto, filtros por categoria e ordenação por data ou popularidade. Relaciona posts com usuários, tags, comentários e likes.

**Comentários (Comments Module)**: Sistema de comentários aninhados para posts. Permite criar comentários em posts, responder a outros comentários, editar e deletar comentários próprios. Implementa contagem de comentários por post.

**Likes (Likes Module)**: Sistema de curtidas para posts. Permite que usuários curtam ou descurtam posts, com prevenção de curtidas duplicadas. Mantém contagem total de likes por post.

**Servidores (Servers Module)**: Gerenciamento de servidores Minecraft. Permite cadastro de servidores com endereço IP ou domínio, porta, descrição e gamemode. Integra com APIs externas (mcstatus.io, mcsrvstat.us, mcapi.us) para verificação automática de status online/offline, número de jogadores, versão do servidor e informações detalhadas. Implementa sistema de votação para servidores e atualização periódica de status.

**Itens (Items Module)**: Sistema de inventário para jogadores. Permite adicionar itens ao inventário do usuário, atualizar quantidades, remover itens e listar todos os itens de um jogador. Simula um sistema de inventário básico do Minecraft.

**Tags (Tags Module)**: Sistema de categorização de posts através de tags. Permite criar tags, associar tags a posts, buscar posts por tag e listar todas as tags disponíveis.

**Notificações (Notifications Module)**: Sistema de notificações em tempo real. Cria notificações automáticas para likes, comentários, mensagens e outras interações. Permite marcar notificações como lidas, contar notificações não lidas e listar histórico de notificações.

**Chat (Chats Module)**: Sistema de mensagens privadas entre usuários. Permite iniciar conversas, enviar mensagens, listar conversas, visualizar histórico de mensagens, bloquear usuários e gerenciar solicitações de chat. Implementa validação para prevenir spam e mensagens de usuários bloqueados.

### Banco de Dados

O banco de dados PostgreSQL utiliza TypeORM como ORM (Object-Relational Mapping). Todas as entidades possuem relacionamentos bem definidos: User relaciona-se com Posts, Comments, Likes, Servers, Items, Notifications e Chats. Posts relacionam-se com Comments, Likes, Tags e PostViews. O sistema utiliza migrations automáticas através do TypeORM synchronize.

As principais entidades incluem: User, Post, Comment, Like, Server, Item, Tag, Notification, Chat, ChatMessage, ChatRequest, Block e PostView. Cada entidade possui campos de auditoria (createdAt, updatedAt) e relacionamentos apropriados com chaves estrangeiras.

### Segurança

O backend implementa validação de dados através de class-validator e class-transformer. Todas as rotas protegidas requerem autenticação JWT. As senhas são hasheadas usando bcrypt antes de serem armazenadas. O sistema implementa CORS configurável para permitir requisições do frontend.

## Frontend

O frontend foi construído com Next.js 14 utilizando App Router, React Server Components e Client Components. A aplicação utiliza TypeScript para type safety e Tailwind CSS para estilização.

### Páginas Implementadas

**Página Inicial**: Landing page com informações sobre a plataforma e links para registro e login.

**Login e Registro**: Páginas de autenticação com formulários validados, tratamento de erros e redirecionamento automático após login bem-sucedido.

**Dashboard**: Área principal da aplicação com sidebar de navegação, exibindo diferentes seções conforme a rota acessada.

**Feed**: Página principal que exibe todos os posts em formato de feed, com filtros por categoria, busca por texto, paginação e ordenação. Cada post exibe informações do autor, conteúdo, tags, contagem de likes e comentários.

**Criar Post**: Página com formulário para criação de novos posts, incluindo campos para título, conteúdo, seleção de tags e categoria.

**Servidores**: Página que lista todos os servidores cadastrados em formato de cards. Cada card exibe nome do servidor, endereço, status online/offline, número de jogadores, versão, gamemode e número de votos. Permite criar novos servidores, atualizar status e votar em servidores.

**Jogadores**: Página que lista todos os usuários cadastrados na plataforma, permitindo visualizar perfis e estatísticas.

**Chat**: Interface de mensagens privadas com lista de conversas, área de mensagens e formulário para envio. Exibe status online/offline dos usuários e timestamps das mensagens.

**Notificações**: Página que exibe todas as notificações do usuário, permitindo marcar como lidas e filtrar por tipo.

**Perfil**: Página de perfil do usuário logado, exibindo informações pessoais, estatísticas, posts criados e servidores cadastrados.

**Itens**: Página de gerenciamento de inventário, permitindo visualizar, adicionar, editar e remover itens do inventário do jogador.

### Componentes

A aplicação possui componentes reutilizáveis como Sidebar (navegação), PostCard (exibição de posts), ServerCard (exibição de servidores), ChatContent (interface de chat), CreatePostForm (formulário de posts), FeedFilters (filtros do feed), Toast (notificações toast) e outros.

Todos os componentes utilizam React Hooks para gerenciamento de estado, fazem requisições assíncronas à API e implementam tratamento de erros adequado.

### Integração com API

O frontend utiliza Axios para fazer requisições HTTP à API. Todas as requisições autenticadas incluem o token JWT no header Authorization. O sistema implementa interceptors para adicionar automaticamente o token e tratar erros 401 (não autorizado) redirecionando para a página de login.

As funções de API estão organizadas em módulos: auth.ts, posts.ts, comments.ts, likes.ts, servers.ts, chats.ts, notifications.ts, items.ts e tags.ts. Cada módulo exporta funções específicas para interagir com os respectivos endpoints do backend.

## Infraestrutura e Deploy

### Docker

Todo o projeto é containerizado utilizando Docker. Existem dois Dockerfiles: um para o backend (baseado em Node.js) e outro para o frontend (multi-stage build com Next.js). O docker-compose.yml configura todos os serviços necessários para desenvolvimento local, incluindo PostgreSQL, backend, frontend, Zabbix e Grafana.

O docker-compose.prod.yml é utilizado para produção, com configurações otimizadas, volumes persistentes para banco de dados, variáveis de ambiente configuráveis e serviços de monitoramento.

### GitHub Actions

O projeto possui workflow automatizado de deploy através do GitHub Actions. Quando código é enviado para as branches `staging` ou `main`, o workflow executa automaticamente:

1. Checkout do código
2. Configuração de SSH para acesso ao servidor EC2
3. Conexão ao servidor e execução de comandos de deploy
4. Criação/atualização do arquivo .env com variáveis de ambiente
5. Parada e remoção de containers antigos
6. Limpeza de volumes quando necessário (para reset de senhas)
7. Build e start dos containers Docker
8. Verificação de saúde dos serviços
9. Exibição de informações de acesso (Grafana, Zabbix, etc.)

O workflow gerencia automaticamente problemas comuns como conflitos de volumes, containers órfãos e falhas de autenticação no banco de dados.

### Monitoramento

O projeto inclui integração com Zabbix para monitoramento de infraestrutura. O Zabbix monitora containers Docker, uso de CPU, memória, disco e rede, disponibilidade de serviços e logs de aplicação.

O Grafana está configurado para visualização de métricas coletadas pelo Zabbix, permitindo criação de dashboards personalizados com gráficos de performance, disponibilidade e uso de recursos.

Ambos os serviços são executados em containers Docker e são acessíveis através de portas configuradas no docker-compose.

## Testes de API

O projeto inclui uma coleção completa do Postman (postman_collection.json) com exemplos de todas as requisições da API. A coleção inclui:

- Requisições de autenticação (registro, login)
- CRUD completo de posts, comentários, likes
- Gerenciamento de servidores (criar, listar, atualizar status, votar)
- Operações de chat (iniciar conversa, enviar mensagem, listar conversas)
- Gerenciamento de notificações
- Operações com itens e tags
- Busca e filtros

Cada requisição está documentada com exemplos de body, headers necessários e respostas esperadas.

## Tecnologias Utilizadas

**Backend**: NestJS, TypeScript, TypeORM, PostgreSQL, JWT, bcrypt, class-validator, class-transformer, axios

**Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Axios, React Icons, cookies-next

**Infraestrutura**: Docker, Docker Compose, GitHub Actions, AWS EC2, Zabbix, Grafana

**Ferramentas**: Postman, Git, GitHub

## Estrutura de Branches

O projeto utiliza três branches principais:

- **main**: Branch de produção, deploy automático para servidor de produção
- **staging**: Branch de staging, deploy automático para ambiente de testes
- **develop**: Branch de desenvolvimento, utilizada para desenvolvimento de novas funcionalidades

O workflow do GitHub Actions está configurado para fazer deploy automático sempre que código é enviado para `staging` ou `main`.

## Nota sobre Uso

Este projeto foi desenvolvido para fins acadêmicos e educacionais. Recomenda-se não utilizar emails reais durante testes e não implementar em ambientes de produção sem revisão adequada de segurança.
