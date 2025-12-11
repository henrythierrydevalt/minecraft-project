# Plataforma de Comunidade Minecraft

Este projeto foi desenvolvido exclusivamente para fins acadêmicos e educacionais. Não deve ser utilizado em ambientes de produção ou para casos de uso reais. O sistema não possui as medidas de segurança, validações e otimizações necessárias para uso em produção.

## Aviso Importante

Este é um projeto acadêmico. Não utilize emails reais durante os testes. Não implemente este sistema em ambientes de produção. O código foi criado para fins de aprendizado e demonstração de conceitos, não para uso real.

## Sobre o Projeto

A plataforma é uma aplicação web completa que simula uma comunidade para jogadores de Minecraft. O sistema permite que usuários se cadastrem, criem posts, gerenciem servidores, interajam através de comentários e likes, e se comuniquem via chat.

O projeto foi construído usando tecnologias modernas de desenvolvimento web, incluindo NestJS para o backend, Next.js para o frontend, e PostgreSQL como banco de dados. A aplicação é containerizada com Docker e possui automação de deploy através de GitHub Actions.

## Estrutura do Projeto

O projeto está dividido em três partes principais: backend, frontend e infraestrutura de deploy.

O backend é uma API REST construída com NestJS. Ele gerencia toda a lógica de negócio, autenticação, e comunicação com o banco de dados. O frontend é uma aplicação Next.js que consome a API e apresenta a interface para os usuários. A infraestrutura inclui configurações Docker e scripts de deploy automatizado.

## Funcionalidades Principais

O sistema possui módulos para autenticação de usuários, gerenciamento de posts, cadastro de servidores Minecraft, sistema de comentários e likes, chat entre usuários, notificações, e gerenciamento de itens do inventário.

A autenticação utiliza JWT e permite registro e login de usuários. Os posts podem ser criados, visualizados, atualizados e deletados pelos seus autores. Os servidores Minecraft podem ser cadastrados e o sistema verifica automaticamente o status online ou offline através de APIs externas.

O sistema de chat permite que usuários se comuniquem entre si, com funcionalidades de bloqueio e silenciamento. As notificações alertam os usuários sobre novas interações. O módulo de itens simula um inventário básico para os jogadores.

## Tecnologias Utilizadas

O backend utiliza NestJS, TypeORM, PostgreSQL, e JWT para autenticação. O frontend utiliza Next.js, React, TypeScript e Tailwind CSS. A infraestrutura utiliza Docker, Docker Compose, e GitHub Actions para automação de deploy.

O banco de dados PostgreSQL armazena todas as informações dos usuários, posts, servidores, comentários, likes, chats, notificações e itens. O TypeORM facilita a comunicação com o banco através de entidades e repositórios.

## Configuração e Deploy

O projeto inclui configurações Docker para facilitar o desenvolvimento e deploy. Existem dois arquivos docker-compose: um para desenvolvimento local e outro para produção.

O deploy é automatizado através de GitHub Actions. Quando código é enviado para as branches staging ou master, o workflow executa automaticamente o build e deploy da aplicação em um servidor EC2.

O sistema de deploy configura automaticamente o ambiente, instala dependências, constrói as imagens Docker, e inicia os containers. O processo também gerencia variáveis de ambiente e credenciais através de secrets do GitHub.

## Monitoramento

O projeto inclui integração com Zabbix para monitoramento de infraestrutura e Grafana para visualização de métricas. Esses serviços são opcionais e podem ser configurados durante o deploy.

O Zabbix monitora o estado dos containers, uso de recursos, e disponibilidade dos serviços. O Grafana apresenta dashboards com visualizações das métricas coletadas.

## Limitações e Considerações

Este projeto não possui validações robustas de segurança, não implementa rate limiting, não possui backup automatizado de dados, e não está otimizado para alta performance. O código foi desenvolvido para fins educacionais.

Não utilize este sistema para armazenar dados reais ou informações sensíveis. Não implemente em ambientes onde a segurança é crítica. O projeto serve apenas como demonstração de conceitos e aprendizado.

## Uso Acadêmico

Este projeto pode ser utilizado como referência para estudos sobre desenvolvimento full-stack, arquitetura de APIs REST, integração frontend e backend, containerização com Docker, e automação de deploy.

Os conceitos demonstrados incluem autenticação JWT, relacionamentos entre entidades em banco de dados, comunicação assíncrona entre serviços, e integração com APIs externas.

## Estrutura de Arquivos

O diretório backend contém todo o código da API, incluindo controllers, services, entities, DTOs, guards e estratégias de autenticação. O diretório frontend contém os componentes React, páginas Next.js, e bibliotecas de comunicação com a API.

Os arquivos de configuração Docker estão na raiz do projeto, junto com os workflows do GitHub Actions. O arquivo postman_collection.json contém exemplos de requisições para testar a API.

## Conclusão

Este projeto foi desenvolvido exclusivamente para fins acadêmicos. Não utilize em produção. Não teste com emails reais. O código serve como material de estudo e demonstração de conceitos de desenvolvimento web moderno.

