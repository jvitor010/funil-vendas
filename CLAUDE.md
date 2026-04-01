# CLAUDE.md — Contexto Completo do Projeto CJO (Código das Janelas de Ouro)

> Este arquivo contém todo o contexto necessário para continuar o trabalho neste projeto.
> Leia INTEIRO antes de fazer qualquer alteração.

---

## O QUE É ESTE PROJETO

Infoproduto de sono de bebê chamado **"Código das Janelas de Ouro" (CJO)**.
Vendido via tráfego pago (Meta Ads) para mães de 22-45 anos no Brasil.
Site: **fluxovital.top**
Plataforma de checkout: **Lastlink**
Ticket principal: R$27,00

---

## ESTRUTURA DO FUNIL (páginas do site)

```
Criativo (Meta Ads)
    ↓
index.html — Landing page com seleção de idade do bebê
    ↓
quiz.html — Quiz de diagnóstico com 6 perguntas (React) + tela de resultado
    ↓
sales.html — Página de vendas com VSL + copy + depoimentos + oferta
    ↓
Checkout Lastlink (externo) — Com order bumps + upsell + downsell
    ↓
obrigado.html — Página de obrigado (a criar, com upsell embutido)
```

---

## MIX DE OFERTAS (configurado na Lastlink)

| # | Oferta | Preço | Tipo |
|---|--------|-------|------|
| 1 | Código das Janelas de Ouro (produto principal) | R$27,00 | Produto principal |
| 2 | O Oráculo das Janelas (Tabelas 0-24 Meses) | R$14,90 | Order Bump 1 |
| 3 | Protocolo Cofre: Escudo Anti-Regressão | R$19,90 | Order Bump 2 |
| 4 | SOS Adormecimento: Método dos 15 Minutos | R$19,90 | Downsell (aparece se recusar upsell) |
| 5 | Masterclass Blindagem do Sono Profundo | R$67,00 | Upsell pós-compra |

**LTV máximo por cliente:** R$128,80
**Ticket médio estimado (com bumps + upsell):** R$43-49

---

## PIXEL DA META — CONFIGURAÇÃO ATUAL

**ID do Pixel:** 1803679593924822

### Eventos configurados (todos funcionando):
| Evento | Onde dispara | Via | Status |
|--------|-------------|-----|--------|
| PageView | Todas as páginas | Navegador | ✅ Ativo (129 eventos) |
| ViewContent | Abertura do quiz.html | Navegador | ✅ Ativo (25 eventos) |
| Lead | Ao completar o quiz (6 perguntas) | Navegador | ✅ Ativo (26 eventos) |
| InitiateCheckout | Ao clicar CTA para checkout | Navegador | ✅ Ativo (19 eventos) |
| Purchase | Quando pagamento confirmado | API de Conversões (Lastlink) | ✅ Ativo (2 eventos, score 8.7/10) |

### Problemas conhecidos:
- A venda confirmada na Lastlink NÃO está aparecendo nos relatórios do Meta Ads (atribuição via CAPI demora 24-72h)
- Janela de atribuição: configurada para 7 dias após clique ✅

---

## CAMPANHA META ADS — STATUS ATUAL

**Estrutura:** ABO (Ad Set Budget Optimization) 1.5.1
**Início:** 31/03/2026
**Orçamento:** R$150/dia (5 ad sets × R$30 cada)
**Orçamento total disponível:** R$1.800
**Gasto acumulado (2 dias):** ~R$282
**Público:** Mulheres, 22-45 anos, Brasil, sem interesses (broad)
**Objetivo:** Vendas (otimização para Purchase)

### Performance dos Ad Sets (acumulado 2 dias):

| Ad Set | Impressões | Cliques | CTR | CPC | CPM | Gasto | LPV | Status |
|--------|-----------|---------|-----|-----|-----|-------|-----|--------|
| **AD4** | 2.338 | 84 | **3.59%** | **R$0,74** | **R$26,69** | R$62,40 | 54 | 🟢 WINNER |
| **AD3** | 1.299 | 47 | **3.62%** | R$1,04 | R$37,68 | R$48,94 | 9 | 🟢 FORTE |
| AD1 | 1.278 | 25 | 1.96% | R$2,28 | R$44,59 | R$56,98 | 22 | 🟡 MÉDIO |
| AD5 | 1.497 | 28 | 1.87% | R$2,17 | R$40,67 | R$60,88 | 18 | 🟡 MÉDIO |
| **AD2** | 1.066 | 18 | 1.69% | R$2,93 | R$49,52 | R$52,79 | 7 | 🔴 CORTAR |

### Criativo vencedor (AD4):
- **Formato:** Imagem estática (NÃO vídeo)
- **Hook:** "Ele não está com sono? Mentira. Ele está com Adrenalina."
- **Imagem:** Bebê sorrindo/agitado no berço de madrugada + mãe exausta ao fundo
- **Por que funciona:** Reframe (reinterpretação) — transforma "meu bebê não quer dormir" em "é uma reação química". Gera curiosidade e identificação instantânea.

### Vendas:
- 1 venda confirmada na Lastlink (R$27 CJO)
- 1 tentativa de upsell Masterclass (R$67) com PIX expirado
- Email + WhatsApp de recuperação já enviados para essa mãe

---

## ALTERAÇÕES JÁ FEITAS NO SITE

### quiz.html ✅
- [x] Pixel: `fbq('track', 'ViewContent')` adicionado na abertura
- [x] Pixel: `fbq('track', 'Lead')` dispara ao completar quiz
- [x] Pixel: `fbq('track', 'InitiateCheckout')` substituiu o antigo `trackCustom 'QuizParaOferta'`
- [x] Preço R$27 REMOVIDO da tela de resultado do quiz
- [x] Mockup do ebook REMOVIDO da tela de resultado
- [x] CTA atualizado para "Ver meu Diagnóstico Completo e a Solução"

### sales.html ✅
- [x] Depoimentos visuais com avatares (Juliana, Tatiane, Camila) + badge verificado
- [x] Barra de urgência "23 mães estão vendo esta página agora"
- [x] Seção "Para quem é / Para quem não é"
- [x] CTA fixo no rodapé mobile (sticky bottom)
- [x] Exit-intent popup com garantia de 7 dias (delay 8s, 1x por sessão)
- [x] VSL inserida (iframe Tynk.ai) — bug de CSS corrigido, funcionando ✅
- [x] CTA abaixo da VSL com pixel InitiateCheckout

---

## PENDÊNCIAS CRÍTICAS (por ordem de prioridade)

### ✅ 1. VSL sales.html — CORRIGIDO
Bug de CSS (0×0px) corrigido com inline styles puros. VSL Tynk.ai visível + CTA abaixo do vídeo.

### ✅ 2. obrigado.html — CRIADO E ATIVO
- Confirmação emocional da compra
- Upsell Masterclass Blindagem do Sono (R$67) com timer 15min
- Checkout upsell: https://lastlink.com/p/C185193A7/checkout-payment/
- Área de membros: https://lastlink.com/f/codigodasjanelasdeourocjo/members-area
- Configurado na Lastlink como página de obrigado do CJO ✅

### 🟡 3. Criar variações do criativo AD4
O AD4 (imagem estática com hook "Ele não está com sono? Mentira. Ele está com Adrenalina.") é o winner. Precisamos de variações:

**Variação 1:** Imagem similar + "Ele não está com fome. Ele está com CORTISOL."
**Variação 2:** Relógio 3h da manhã + "3 da manhã. Ele não está sem sono. O corpo dele PASSOU do ponto."
**Variação 3:** Bebê chorando + "Você sabe a diferença entre sono e ADRENALINA no seu bebê?"
**Variação 4:** Mãe embalando + "Você está embalando. Ele está produzindo ADRENALINA. O efeito é oposto."
**Variação 5:** Bebê agitado + "15 minutos. É o que separa um bebê DORMINDO de um bebê com ADRENALINA."

### 🟡 4. Pausar AD2 no Meta Ads
AD2 é o pior ad set (CTR 1.69%, CPC R$2,93, apenas 7 LPV em 2 dias). Deve ser pausado ASAP. Isso é feito no Gerenciador de Anúncios, não no código.

---

## DECISÕES ESTRATÉGICAS TOMADAS

1. **Estrutura ABO (não CBO)** para fase de teste — garante que cada criativo recebe orçamento igual
2. **Público aberto (broad)** sem interesses — algoritmo encontra as mães sozinho
3. **Sem VSL inicialmente** — agora VSL de 4 min foi produzida e inserida (precisa corrigir CSS)
4. **Duas VSLs produzidas:**
   - VSL 1 (HeyGen, 5 min, 3 partes): ângulo "Mecanismo Janela de Ouro"
   - VSL 2 (Lovo.ai, 4 min, 3 blocos): ângulo "3 Erros da Madrugada"
5. **Downsell configurado na Lastlink** (NÃO como popup no site — para evitar canibalização)
6. **Exit popup na sales.html** reforça garantia de 7 dias (não oferece produto alternativo)
7. **Orçamento total: R$1.800** | Gasto: ~R$282 | Restante: ~R$1.518
8. **Kill number:** Se gastar R$900 total sem pelo menos 8-10 vendas → pausar e reavaliar

---

## REGRAS DE DESIGN DO SITE

- Mobile-first (90%+ do tráfego vem do celular)
- Cores: verde (#22c55e) para CTAs, fundo branco/cinza claro, texto escuro
- Fontes: Montserrat (títulos), sans-serif padrão (corpo)
- Estilo: clean, acolhedor, confiável — NÃO agressivo ou "vendedor"
- Framework CSS: Tailwind (classes utilitárias)
- Pixel ID: 1803679593924822 (incluir em todas as páginas novas)

---

## ARQUIVOS DO PROJETO

```
fluxovital.top/
├── index.html          ← Landing page (seleção de idade)
├── quiz.html           ← Quiz React (6 perguntas + resultado)
├── sales.html          ← Página de vendas (VSL + copy + oferta)
├── obrigado.html       ← Página de obrigado (A CRIAR)
└── assets/
    ├── quiz_intro.png
    ├── quiz_ages.png
    ├── quiz_struggle.png
    ├── quiz_association.png
    ├── quiz_sleep_windows.png
    ├── quiz_solution.png
    └── capa_ebook_premium.jpg
```

---

## COMO CONTINUAR O TRABALHO

Ao receber uma instrução, priorize nesta ordem:
1. Corrigir o bug da VSL invisível (pendência #1)
2. Criar obrigado.html com upsell (pendência #2)
3. Qualquer nova alteração solicitada

Sempre testar alterações em viewport mobile (375px) antes de finalizar.
Nunca reescrever páginas inteiras — fazer alterações cirúrgicas.
Manter o mesmo estilo visual existente.
Incluir pixel da Meta (ID: 1803679593924822) em qualquer página nova.
