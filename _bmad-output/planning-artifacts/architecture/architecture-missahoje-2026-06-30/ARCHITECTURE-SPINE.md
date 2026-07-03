---
name: 'missahoje'
type: architecture-spine
purpose: build-substrate
altitude: system
paradigm: 'Modular Layered / Server-Driven UI'
scope: 'Frontend and Backend integration'
status: final
created: '2026-06-30'
updated: '2026-06-30'
binds: []
sources: []
companions: []
---

# Architecture Spine — missahoje

## Design Paradigm

O projeto adota uma arquitetura híbrida focada em separação de responsabilidades (Backend) e otimização de renderização (Frontend).
- **Backend (`missahoje-api`):** Modular Layered Architecture. Módulos divididos por domínio (feature), onde cada domínio tem camadas estritas: Controller, Service, e Repository.
- **Frontend (`missahoje-web`):** Server-Driven UI via Next.js App Router. A fonte primária de dados é consumida pelo servidor (Server Components) e a interatividade do cliente aciona "soft refreshes" no servidor.

## Invariants & Rules

### AD-1 — Strict Modular Layered Architecture for API
- **Binds:** Todos os módulos do Backend (`missahoje-api/src/*`).
- **Prevents:** Acoplamento forte (spaghetti code) onde rotas conversam direto com banco de dados ou regras de negócio vazam para a web.
- **Rule:** Respeitar a separação estrita: Controller lida com HTTP, Service lida com regras de negócio, Repository lida com banco. O fluxo de dependência é estritamente unidirecional para baixo.

```mermaid
flowchart TD
    A[Controller (HTTP)] --> B[Service (Business Logic)]
    B --> C[Repository (Database)]
```

### AD-2 — Strict API Contract via DTOs
- **Binds:** Respostas da API (`missahoje-api/src/**/dto`) e consumo do Frontend.
- **Prevents:** Vazamento do esquema do banco de dados (Data Leaking) para o Frontend, evitando que refatorações no banco quebrem a interface visual.
- **Rule:** Database Entities NUNCA podem cruzar a fronteira da API. O Controller deve mapear Entities para DTOs (Data Transfer Objects) antes de retornar qualquer resposta.

### AD-3 — Server-Driven State for Next.js
- **Binds:** Busca de dados no Frontend (`missahoje-web/src/app`).
- **Prevents:** Inchaço de código no cliente (Client-side state bloat) e chamadas de API redundantes via useEffect.
- **Rule:** A busca primária de dados acontece em Server Components. Interações que mudam o contexto (ex: trocar de cidade) devem alterar o estado no servidor (Cookies/URL Params) e acionar `router.refresh()` para um soft-refresh.

## Consistency Conventions

| Concern | Convention |
| --- | --- |
| Data & formats | DTOs são a única linguagem compreendida pela fronteira da API. |
| State & cross-cutting | Mudanças de escopo global no Frontend usam Cookies, permitindo leitura direta no Server Component. |

## Stack

| Name | Version |
| --- | --- |
| Next.js | 16.2.6 (React 19.2.4) |
| NestJS | 11.0.1 |
| TypeORM | 11.0.1 |
| Tailwind CSS | 4 |

## Structural Seed

```text
missahoje/
  missahoje-api/
    src/
      {feature}/
        {feature}.controller.ts  # Recebe requisição
        {feature}.service.ts     # Regra de Negócio
        {feature}.repository.ts  # Banco de Dados
        dto/                     # Contratos de Fronteira
        entities/                # Tabelas do Banco
  missahoje-web/
    src/
      app/                       # Server Components (Data Fetching)
      components/                # Client & Server UI Components
```

## Deferred
- Autenticação e Autorização (pode ser incluída via JWT quando novos módulos restritos surgirem).
- Estratégia de Deploy/Infra (não tratada neste escopo inicial).
