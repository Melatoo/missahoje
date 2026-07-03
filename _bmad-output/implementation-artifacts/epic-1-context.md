# Epic 1 Context: Mapa e Descoberta de Paróquias

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

O objetivo deste épico é permitir que os usuários abram o aplicativo, concedam permissão de GPS para centralizar o mapa, e visualizem paróquias próximas de forma interativa. O usuário também poderá buscar paróquias específicas ou aplicar filtros rápidos para refinar os resultados exibidos no mapa instantaneamente.

## Stories

- Story 1.1: Design System & Scaffold Inicial
- Story 1.2: Mapa em Tela Cheia e Localização GPS
- Story 1.3: Fetching de Paróquias e Pins Interativos
- Story 1.4: Busca de Paróquias
- Story 1.5: Filtros Rápidos (Pílulas)

## Requirements & Constraints

- O sistema deve exibir um mapa interativo em tela cheia para a descoberta de paróquias.
- O sistema deve solicitar e utilizar o GPS do usuário para centralizar o mapa nas paróquias próximas.
- O sistema deve ter uma barra de busca flutuante (não-obstrutiva) para pesquisar paróquias por nome ou localidade.
- O sistema deve fornecer filtros rápidos horizontais em formato de pílulas (ex: "Mais Próximas", "Estacionamento", "Acessível").
- A ativação de um filtro deve remover ou adicionar pins do mapa instantaneamente, sem recarregar a página.
- Performance: Interações efêmeras do mapa (pan/zoom) e hovers devem usar Zustand para evitar lag e re-renders excessivos.
- Acessibilidade: O contraste entre o texto e o fundo deve ser alto para leitura fácil.
- Acessibilidade: O tamanho mínimo da área de toque (tap target) para pins e filtros deve ser de 44x44px.

## Technical Decisions

- Gerenciamento de Estado Híbrido: Zustand para estado de alta frequência/efêmero e URL Search Params para compartilhamento de link (filtros/igreja selecionada).
- Data Fetching Client-Side: As buscas guiadas pela Bounding Box do mapa devem usar TanStack Query (React Query) integrado ao Axios para gerenciar o cache local.
- Estrutura Feature-Based: Os domínios de negócio (map, parish) devem ficar restritos e isolados dentro da pasta `features/`.

## UX & Interaction Patterns

- Implementar o sistema visual "Sacred Minimalist" utilizando as cores "Pastel Blue" e tipografia "Inter", integrando com sobrescritas do Shadcn/UI.
- O componente "Map Pin" deve reagir com diferentes estados visuais (repouso, hover, ativo).
- Utilizar o componente "Quick Filter Pill" como padrão interativo para a interface do mapa.
