# ⛪ Missas Lavras (Missa Hoje)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

Este é o repositório central do projeto **Missas Lavras** (também conhecido como **Missa Hoje**), um sistema concebido para listar e organizar os horários de missas nas paróquias e comunidades da cidade de Lavras/MG.

## 🏗️ Estrutura do Projeto

O projeto contém o backend e o frontend separados em diretórios. A documentação detalhada de arquitetura encontra-se dentro de seus respectivos diretórios:

- ⚙️ **[`missahoje-api/`](./missahoje-api/)**: Backend desenvolvido em NestJS com integração ao PostgreSQL e Redis.
  - 📖 *Nota: Consulte as documentações locais dentro desta pasta para detalhes da API.*
- 💻 **[`missahoje-web/`](./missahoje-web/)**: Frontend da aplicação web.

## ✨ Funcionalidades

- Listagem de paróquias e comunidades.
- Consulta de horários de missas atualizados.
- Arquitetura escalável baseada em NestJS.
- Cache em memória com Redis para alta performance.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, NestJS, TypeScript
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Infraestrutura:** Docker e Docker Compose

## 🚀 Como Executar Localmente

O ecossistema do projeto foi desenhado para rodar facilmente via **Docker**. Tudo o que a API precisa (banco de dados, cache e o próprio servidor Node) está configurado no `docker-compose.yml`. Não é necessário ter o Node.js instalado na sua máquina host.

### Pré-requisitos
- [Docker](https://www.docker.com/products/docker-desktop) instalado e rodando.

### Iniciando a API

1. Pelo terminal, entre na pasta da API:
   ```bash
   cd missahoje-api
   ```

2. Suba todos os serviços (API, PostgreSQL e Redis) com um único comando:
   ```bash
   docker-compose up
   ```
   *(Use `docker-compose up -d` para rodar em segundo plano, liberando o terminal).*

3. O sistema fará o download das imagens, instalará as dependências do Node e iniciará o servidor. 
   A API estará disponível no seu host através de: **`http://localhost:3000`**

> **Dica:** O container da API utiliza volumes para mapear o seu código local. Ele roda em *watch mode*, portanto, qualquer alteração que você fizer nos arquivos da pasta `src/` refletirá imediatamente no container sem precisar reiniciá-lo!

## 🤝 Como Contribuir

Fique à vontade para sugerir melhorias, abrir issues relatando bugs ou enviar pull requests. Toda ajuda é bem-vinda para tornar as informações das paróquias mais acessíveis.