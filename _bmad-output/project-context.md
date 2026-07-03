---
project_name: 'missahoje'
user_name: 'Melato'
date: '2026-06-30'
sections_completed: ['technology_stack']
existing_patterns_found: 3
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Backend (API):**
  - Framework principal: NestJS `^11.0.1` usando TypeScript `^5.7.3`.
  - Persistência: TypeORM `^11.0.1` (`typeorm ^0.3.28`) com PostgreSQL (`pg ^8.20.0`).
  - Outros: Autenticação via JWT, documentação via Swagger (`^11.4.4`), e cache distribuído com `cache-manager-redis-store`.
  - Testes: Jest `^30.0.0`.
- **Frontend (Web):**
  - Framework principal: Next.js `16.2.6` (React `19.2.4`).
  - Estilização: Tailwind CSS `^4`.
  - Requisições: Axios `^1.16.1`.

## Critical Implementation Rules

### Language-Specific Rules

- **Tipagem e Configuração:** Utilizar TypeScript estrito. Evitar o uso explícito de `any`, preferindo interfaces genéricas ou tipos desconhecidos (`unknown`) com asserções de tipo quando necessário.
- **Import/Export:** 
  - **Backend (NestJS):** Usar exclusivamente *named exports* para classes, módulos, serviços e controllers para facilitar o rastreamento das dependências.
  - **Frontend (Next.js):** Usar `export default` para componentes de página/layout (exigido pelo App/Pages router) e *named exports* para componentes menores, hooks e utilitários.
- **Tratamento de Erros:** 
  - **API:** Não usar `throw new Error()`. Usar as exceções nativas do NestJS (ex: `BadRequestException`, `UnauthorizedException`) para garantir que o cliente receba o status HTTP correto.
  - **Web:** Realizar tratamento de erros nas chamadas do Axios de forma isolada, capturando o erro e atualizando o estado visual (ex: `try/catch` bloqueando chamadas de API).
