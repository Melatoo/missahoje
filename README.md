# Missas Lavras

Este é o repositório central do projeto **Missas Lavras**, um sistema concebido para listar e organizar os horários de missas nas paróquias e comunidades da cidade de Lavras/MG.

## 🏗️ Estrutura do Projeto

Atualmente, o projeto é composto pela API Backend (construída em NestJS). Toda a documentação detalhada da arquitetura técnica encontra-se no próprio diretório da API.

- `missas-lavras-api/`: Backend em NestJS com integração ao PostgreSQL e Redis.
  - 📖 **[Documentação de Arquitetura da API](./missas-lavras-api/DOCUMENTACAO_ARQUITETURA.md)**

## 🚀 Como Executar Localmente

O ecossistema do projeto foi desenhado para rodar via **Docker**, garantindo que não haja problemas de versão de Node ou banco de dados na sua máquina. 

### Pré-requisitos
- Docker e Docker Compose (ou Docker Desktop no Windows/Mac) instalados.
- Instâncias de **PostgreSQL** (porta 5432) e **Redis** (porta 6379) rodando localmente.

### Iniciando a API

Para rodar a API de missas usando um container provisório (sem precisar de Node.js instalado na sua máquina host):

1. Entre na pasta da API:
   ```bash
   cd missas-lavras-api
   ```
2. Inicie o servidor em modo de desenvolvimento (Watch Mode):
   ```bash
   docker run --rm -v "${PWD}:/app" -w /app -p 3000:3000 node:20 npm run start:dev
   ```

A API estará disponível no seu host através de `http://localhost:3000`.