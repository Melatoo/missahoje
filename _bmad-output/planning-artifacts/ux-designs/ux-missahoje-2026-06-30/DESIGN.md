---
status: final
updated: '2026-06-30'
tokens:
  colors:
    primary: 'hsl(215, 80%, 40%)' # Deep Marian Blue
    secondary: 'hsl(45, 90%, 60%)' # Sacred Gold
    text: 'hsl(0, 0%, 100%)' # Branco puro para alto contraste sobre o vidro fosco
    glass_surface: 'rgba(255, 255, 255, 0.15)' # Painel de vidro translúcido
    glass_border: 'rgba(255, 255, 255, 0.25)' # Borda do vidro
  typography:
    heading: 'Outfit'
    body: 'Inter'
  rounded:
    sm: '0.375rem'
    md: '0.75rem'
    lg: '1.5rem'
    full: '9999px'
  spacing:
    sm: '0.5rem'
    md: '1rem'
    lg: '2rem'
    xl: '4rem'
  effects:
    blur: '24px' # Desfoque intenso obrigatório para legibilidade (Acessibilidade)
    bg_dimmer: 'rgba(15, 23, 42, 0.6)' # Escurecimento da foto de fundo
---

# Design Specification (Glassmorphism & Realism)

## Brand & Style
O visual deve transmitir solenidade e modernidade através da estética **"iPhone Glass" (Glassmorphism)**. 
- **Vibe:** Sagrado, imersivo, premium e altamente polido.
- **Visuals:** O fundo será obrigatoriamente a fotografia real da nave da **Basílica de Nossa Senhora de Lourdes (BH)**. Todos os componentes da UI flutuarão por cima usando um efeito de vidro fosco (frosted glass).
- **Avoid:** Fundos sólidos brancos ou pretos, flat design corporativo, ou efeitos neon/IA exagerados.

## Colors
- **Fundo Fotográfico:** Foto real da igreja, tratada com um overlay escurecedor (`bg_dimmer`) para não ofuscar a UI.
- **Vidro Fosco (Glass Surface):** Branco altamente transparente (`rgba(255,255,255, 0.15)`) com bordas levemente mais opacas para demarcar os limites físicos dos cards.
- **Marian Blue & Sacred Gold:** Usados para botões de ação e destaques (como a Próxima Missa), contrastando fortemente com os painéis de vidro.

## Typography & Accessibility (Auditoria de Acessibilidade)
Devido ao fundo complexo (foto) e aos painéis translúcidos, a acessibilidade para idosos exige regras estritas:
- **Heading (Outfit) & Body (Inter):** A cor do texto base será o **Branco Puro** com uma leve sombra (`text-shadow: 0 2px 4px rgba(0,0,0,0.5)`) para destacá-lo fisicamente do fundo desfocado.
- Textos devem ser extra-grandes e as espessuras (weights) devem ser no mínimo `Medium` para garantir legibilidade.

## Elevation & Depth
- **Blur Engine:** Todo card deve ter um `backdrop-filter: blur(24px)`. Sem esse desfoque intenso, as linhas da arquitetura da igreja no fundo destruirão a leitura dos textos.
- Sombras projetadas sob o vidro (`box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37)`) criarão a sensação de que a UI flutua longe da parede.

## Shapes
- Continua o uso intensivo de bordas arredondadas (`lg: 1.5rem`) para harmonizar o vidro, imitando as interfaces nativas do iOS (visionOS/iOS 17).

## Components
- **Card Próxima Missa:** O painel de vidro de maior destaque. Nele, o horário deve ser gigante.
- **Lista de Missas:** Vidros menores com espaçamento generoso.
- **Seletor de Cidade:** Estilo "pílula" (Pill) translúcida flutuando no topo.

## Do's and Don'ts
- **DO:** Garantir desfoque (blur) pesado atrás de qualquer texto.
- **DON'T:** Usar textos cinzas ou com baixa opacidade. Todo texto precisa de 100% de opacidade sobre o vidro.
