---
status: final
updated: '2026-06-30'
---

# Experience Specification

## Foundation
- **Form-factor:** Multi-plataforma (Responsivo). Deve parecer um aplicativo nativo premium do iOS no celular (devido ao glassmorphism) e uma aplicação web cinematográfica e imersiva no PC.
- **UI System:** TailwindCSS + Custom (referenciando `DESIGN.md` com intenso uso de backdrop-blur).

## Information Architecture
As funcionalidades atuais estão centralizadas em uma única página (Home).
1. **Home**
   - Seletor de Cidade (flutuante no topo)
   - [Se cidade não selecionada] -> Empty State com mensagem de boas-vindas sobre painel de vidro.
   - [Se cidade selecionada] -> 
     - Card Próxima Missa em Destaque (Herói)
     - Lista de Missas (Cronograma diário/semanal em painéis translúcidos)

## Voice and Tone
- **Tom:** Acolhedor, claro, simples e direto.
- **Público:** Crianças até idosos.
- **Microcopy:** Usar termos extremamente diretos e fáceis de ler como "Onde você está?", "Próxima Missa", evitando qualquer jargão técnico.

## Component Patterns
- **Card Próxima Missa:** Painel de vidro fosco com o maior nível de opacidade para garantir leitura perfeita. Exibe em fonte gigante o horário e local. Ocupa o topo da hierarquia visual.
- **Lista de Missas:** Cards translúcidos empilhados (vidro mais fino). Devem exibir claramente o horário e o local de cada missa do dia, permitindo ver traços da igreja ao fundo.
- **Seletor de Cidade:** Estilo "pílula de vidro" de fácil acesso no topo da tela para alterar rapidamente a cidade.

## State Patterns
- **Empty States:** Quando a cidade não está selecionada, exibir um painel de vidro centralizado com uma mensagem calorosa ("Onde você está?") em fonte muito grande e legível.
- **Loading:** Um sutil efeito de "shimmer" (esqueleto pulsante fosco) sobre o painel de vidro em vez de spinners clássicos.
- **Error / Offline:** Mensagem acolhedora sobre painel de vidro com contraste altíssimo ("Parece que você está sem conexão no momento. Tente novamente em breve."). Botão claro de "Tentar de novo".

## Interaction Primitives
- **Scroll:** Scroll suave pela lista de missas com a foto de fundo fixa (`background-attachment: fixed`), criando paralaxe entre o vidro e o fundo.
- **Feedback:** Ao interagir, leve alteração na opacidade do painel de vidro (hover states).

## Accessibility Floor (Auditado para Fundo Fotográfico)
- **Contraste Rígido:** Todo texto branco DEVE estar acompanhado de `text-shadow` e todo card DEVE ter `backdrop-blur(24px)` para desfocar as linhas complexas da foto de fundo.
- **Áreas de Toque:** Botões com "hit area" extra grandes (mínimo 48x48px) para facilitar o toque de pessoas com dificuldades motoras (idosos).
- Suporte claro à ampliação de texto no celular sem quebrar o layout (textos fluidos).

## Key Flows
1. **Descobrir a Próxima Missa (Idoso):** 
   *Seu José, 75 anos, acessa pelo celular querendo saber o horário da missa de hoje.* 
   - A tela mostra a linda foto da Basílica escurecida ao fundo.
   - Imediatamente um grande Card translúcido "Próxima Missa" (com fonte branca gigante e nítida) captura sua atenção.
   - Ele lê o horário e endereço claramente, sem precisar dar zoom, graças à sombra projetada nos textos e ao forte desfoque atrás do card.

2. **Caminho Triste (Sem Missas):** 
   *Maria, 65 anos, procura missas na sua cidade e não encontra.* 
   - Um grande painel de vidro elegante mostra: "Hoje não temos missas cadastradas para sua cidade."
   - Um botão óbvio e tátil orienta Maria a "Ver outras cidades".

## Responsive & Platform
- **Mobile:** Foco em uma coluna única, navegação em "cards de vidro" empilhados.
- **Desktop/PC:** Uso inteligente do espaço horizontal. A foto da Basílica ocupa a tela inteira gloriosamente. A lista de missas se organiza em uma grade (Grid) no centro/direita, e a "Próxima Missa" ganha um destaque majestoso.
