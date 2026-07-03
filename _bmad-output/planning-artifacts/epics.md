---
stepsCompleted: [1, 2, 3]
inputDocuments: [
  "c:/Users/Melato/Documents/missahoje/_bmad-output/ux-designs/ux-missahoje-2026-06-30/DESIGN.md",
  "c:/Users/Melato/Documents/missahoje/_bmad-output/ux-designs/ux-missahoje-2026-06-30/EXPERIENCE.md",
  "c:/Users/Melato/Documents/missahoje/_bmad-output/architecture/architecture-missahoje-2026-06-30/ARCHITECTURE-SPINE.md"
]
---

# MissaHoje - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for MissaHoje, decomposing the requirements from the UX Design and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: O sistema deve exibir um mapa interativo em tela cheia para a descoberta de paróquias.
FR2: O sistema deve solicitar e utilizar o GPS do usuário para centralizar o mapa nas paróquias próximas.
FR3: O sistema deve ter uma barra de busca flutuante (não-obstrutiva) para pesquisar paróquias por nome ou localidade.
FR4: O sistema deve fornecer filtros rápidos horizontais em formato de pílulas (ex: "Mais Próximas", "Estacionamento", "Acessível").
FR5: A ativação de um filtro deve remover ou adicionar pins do mapa instantaneamente, sem recarregar a página.
FR6: Ao clicar em um pin no mapa, a tela deve centralizar nele e abrir o "Quick View" (Bottom Sheet recolhido).
FR7: O Quick View da Paróquia deve exibir o Nome, Distância, Badges de infraestrutura e o botão "Ver horários de missas".
FR8: Clicar no botão do Quick View deve expandir o Bottom Sheet para exibir a "Detail View" (visão detalhada).
FR9: A visão detalhada deve exibir os horários de missas agrupados por dia, começando pelo dia de hoje.
FR10: O sistema deve estilizar horários passados (opacidade 40%, texto riscado), o horário atual/próximo (fundo azul destacado, tag "Daqui a X min") e horários futuros (texto normal).

### NonFunctional Requirements

NFR1: Performance: Interações efêmeras do mapa (pan/zoom) e hovers devem usar Zustand para evitar lag e re-renders excessivos.
NFR2: Acessibilidade: O contraste entre o texto e o fundo (parchment) deve ser alto para leitura fácil.
NFR3: Acessibilidade: O tamanho mínimo da área de toque (tap target) para pins e filtros deve ser de 44x44px.
NFR4: Acessibilidade: Leitores de tela devem ler o horário da "Próxima" missa primeiro ao navegar pela lista.
NFR5: Responsividade: O sistema deve ser mobile-first com gestos (swipe up/down no Bottom Sheet), transformando-se de forma fluida em uma Sidebar lateral à esquerda no Desktop.

### Additional Requirements

- [Architecture AD-1] Gerenciamento de Estado Híbrido: Zustand (alta frequência/efêmero) + URL Search Params (compartilhamento de link com filtros/igreja selecionada).
- [Architecture AD-2] Data Fetching Client-Side: Buscas guiadas pela Bounding Box do mapa devem usar TanStack Query (React Query) integrado ao Axios para cache.
- [Architecture AD-3] Estrutura Feature-Based: Os domínios (map, parish) devem ficar restritos à pasta `features/`.

### UX Design Requirements

UX-DR1: Implementar sistema visual (design tokens) "Sacred Minimalist" baseado nas cores Pastel Blue, tipografia Inter e sobrescritas do Shadcn/UI (conforme DESIGN.md).
UX-DR2: Criar o componente interativo "Map Pin" com estados visuais de repouso, hover e ativo.
UX-DR3: Criar o componente "Quick Filter Pill" (Filtro Rápido) para a interface do mapa.
UX-DR4: Desenvolver a estrutura de Bottom Sheet responsiva que responde a gestos (swipe) no mobile e se converte em Sidebar fixa no Desktop.

### FR Coverage Map

FR1: Epic 1 - Mapa interativo em tela cheia
FR2: Epic 1 - Integração com GPS para centralização
FR3: Epic 1 - Barra de busca flutuante
FR4: Epic 1 - Filtros rápidos (pílulas horizontais)
FR5: Epic 1 - Ativação de filtro instantânea (sem reload)
FR6: Epic 2 - Interação de pin e abertura do Quick View
FR7: Epic 2 - Informações visuais do Quick View
FR8: Epic 2 - Expansão para a Detail View
FR9: Epic 2 - Lista de horários de missas agrupados por dia
FR10: Epic 2 - Estilização baseada no status temporal dos horários

## Epic List

### Epic 1: Mapa e Descoberta de Paróquias
Usuários conseguem abrir o aplicativo, conceder permissão de GPS para centralizar o mapa e visualizar paróquias próximas. Podem usar a barra de pesquisa ou os filtros rápidos em formato de pílulas para encontrar igrejas específicas, com os resultados do mapa atualizados instantaneamente.
**FRs covered:** FR1, FR2, FR3, FR4, FR5

### Epic 2: Detalhes da Paróquia e Horários de Missa
Usuários conseguem clicar no pin de uma paróquia no mapa para exibir um "Quick View" com detalhes essenciais. A partir daí, podem expandir o painel para ver a lista completa de horários de missa, que é formatada e categorizada de acordo com o dia e a proximidade do horário (próxima missa vs passadas/futuras).
**FRs covered:** FR6, FR7, FR8, FR9, FR10

## Epic 1: Mapa e Descoberta de Paróquias

### Story 1.1: Design System & Scaffold Inicial

As a user,
I want a visually cohesive interface based on the Sacred Minimalist design and a robust state architecture,
So that all following map features can be built consistently and efficiently.

**Acceptance Criteria:**

**Given** the Next.js project is initialized
**When** the UI loads
**Then** it must use the "Pastel Blue" color palette and "Inter" typography
**And** the `features/map` domain folders must exist
**And** the Zustand store must be configured for the ephemeral map state

### Story 1.2: Mapa em Tela Cheia e Localização GPS

As a user,
I want to see a full-screen interactive map that centers on my location,
So that I can easily find parishes near me.

**Acceptance Criteria:**

**Given** the user opens the application
**When** the map interface loads
**Then** it should display a full-screen interactive map
**And** prompt the user for GPS permission
**And** center the map on the user's coordinates if permission is granted

### Story 1.3: Fetching de Paróquias e Pins Interativos

As a user,
I want to see pins on the map representing parishes in my current view,
So that I know exactly where they are located.

**Acceptance Criteria:**

**Given** the map is centered on a specific area
**When** the user pans or zooms the map
**Then** the client must fetch parishes in that Bounding Box using TanStack Query and Axios
**And** display them using the "Map Pin" component, which must have rest, hover, and active visual states

### Story 1.4: Busca de Paróquias

As a user,
I want to search for parishes by name or location using a floating bar,
So that I can quickly find a specific church.

**Acceptance Criteria:**

**Given** the user is viewing the map
**When** they type a name or location in the floating search bar
**Then** the map should center on the selected search result's coordinates

### Story 1.5: Filtros Rápidos (Pílulas)

As a user,
I want to apply quick filters like "Estacionamento" or "Acessível",
So that I only see parishes that meet my needs.

**Acceptance Criteria:**

**Given** the user is viewing parishes on the map
**When** they click on a "Quick Filter Pill" component
**Then** the map pins must update instantly to reflect the filter without reloading the page
**And** this filtering state must be handled by Zustand to avoid lag

## Epic 2: Detalhes da Paróquia e Horários de Missa

### Story 2.1: Quick View e Interação do Pin

As a user,
I want to click on a map pin to see basic info in a Quick View panel,
So that I can quickly decide if I want to learn more about that parish.

**Acceptance Criteria:**

**Given** the user is viewing the map with pins
**When** they click on a specific parish pin
**Then** the map should center on the pin
**And** the Bottom Sheet should appear in a collapsed "Quick View" state
**And** the Quick View must display the Name, Distance, infrastructure badges, and a "Ver horários de missas" button
**And** the selected parish's ID must be synchronized with the URL Search Params to allow link sharing

### Story 2.2: Expansão para Detail View

As a user,
I want to expand the Quick View to see the full parish details,
So that I can check the mass schedules.

**Acceptance Criteria:**

**Given** the Quick View is open for a parish
**When** the user clicks the "Ver horários" button or swipes up
**Then** the panel must expand to the "Detail View"
**And** it must be fully responsive, behaving as a swipeable Bottom Sheet on mobile and a fixed Sidebar on Desktop

### Story 2.3: Listagem de Horários Agrupados

As a user,
I want to see mass times grouped by day and visually distinct based on when they occur,
So that I can easily plan my visit.

**Acceptance Criteria:**

**Given** the Detail View is open
**When** the user looks at the schedules
**Then** the mass times must be grouped by day, starting with today
**And** past times must have 40% opacity and strikethrough
**And** the current or next upcoming mass must have a blue highlighted background and a "Daqui a X min" tag
**And** future times must have normal text styling
**And** screen readers must read the "Next" upcoming mass first when navigating the list
