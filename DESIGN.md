# Design System: Código das Janelas de Ouro

## Color Strategy
Committed — dourado como cor identitária carrega 40-50% das superfícies. Cream como base acolhedora. Navy como âncora de autoridade. Verde como confirmação/resultado.

## Colors
- Background: `#fdfaf6` (warm cream, não branco puro)
- Gold primary: `#f59e0b` | Gold dark: `#d97706` | Gold light: `#fbbf24`
- Green: `#10b981` (resultados, confirmações, CTAs secundários)
- Navy: `#0f172a` (autoridade, headers escuros, texto principal pesado)
- Text primary: `#1a1a1a`
- Text muted: `#6b7280`
- Border subtle: `rgba(0,0,0,0.06)`

## Typography
- Font: Montserrat (Google Fonts) — única família, peso varia
- Heading: 900 (Black) para headlines emocionais
- Subheading: 700-800
- Body: 500-600 (nunca 400 — leitura noturna mobile precisa de peso)
- Size scale: 12px / 13px / 14px / 16px / 18px / 22px / 26px / 32px+
- Line height body: 1.6-1.75 (generoso para leitura noturna)
- Letter spacing: 0.02-0.08em em labels uppercase

## Layout
- Max-width: 640px, single column
- Padding horizontal: 16px mobile
- Section padding: 48-64px vertical
- Border-radius: 16-20px (cards), 50px (botões/badges)

## Components
- CTA buttons: `btn-green` (background #10b981, border-radius 50px, uppercase, font-weight 900)
- CTA fixo mobile: aparece após 50% de scroll
- Cards: background white, border-radius 16px, shadow sutil
- Labels: uppercase, letter-spacing 0.06em, font-size 11-12px, cor gold ou green
- FAQ accordion: vanilla JS max-height transition, sem Alpine.js

## Motion
- Transições: 0.25-0.35s ease
- FAQ accordion: max-height transition
- CTA pulse: box-shadow animation 2s infinite (green/gold)
- Sem bounce, sem elastic

## Radial gradients
Usados em seções hero e navy: `radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 60%)`

## Do not
- Gradient text (background-clip: text)
- Border-left colorido em cards
- Glassmorphism decorativo
- Timer countdown fake
- Branco puro (#fff) ou preto puro (#000)
