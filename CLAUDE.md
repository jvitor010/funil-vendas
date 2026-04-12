# CLAUDE.md — Contexto do Projeto CJO (Código das Janelas de Ouro)

> **ESTADO ATUAL** (10/04/2026): Agente WhatsApp estabilizado para V4 com `gemini-flash-latest`.
> Checkout ativo: `https://pay.kiwify.com.br/HHjLKvh` | Upsell: `https://pay.kiwify.com.br/yjLTyo4`
> Agente WhatsApp X1 refinado: Persona Dra. Renata ajustada (menos endearments, mais parágrafos).

---

## 📂 ESTRUTURA DO FUNIL E ATIVOS
Os arquivos de produção e ferramentas de suporte estão organizados assim:

```
/Funil CJO/          ← Funil Ativo (index, quiz, sales, obrigado)
/Criativos/          ← Creative Engine V5 (40+ ativos UGC/Story)
/Marketing JV/       ← Dossiês de Pesquisa (Mecanismos Vencedores)
├── spy-dashboard-diário.jsx  ← Ferramenta de espionagem e métricas
└── shield.js        ← Proteção Anti-Spy (em assets/)
```

---

## 🎯 RASTREAMENTO E PIXEL (Meta Ads)
**ID Principal:** 1803679593924822

### Plataforma de Pagamento: Kiwify (migrado de Lastlink em 09/04/2026)
- **Checkout principal CJO R$37:** `https://pay.kiwify.com.br/HHjLKvh`
- **Upsell Masterclass R$67:** `https://pay.kiwify.com.br/yjLTyo4`
- **Order Bump Protocolo Cofre R$27:** configurado dentro do produto Kiwify
- Pixel Meta ID `1803679593924822` configurado nativamente na Kiwify (qualidade 9.3/10)
- **"Disparar Purchase ao gerar PIX"** → ATIVADO

### Fluxo de Eventos e Delay Técnico:
| Página | Evento Pixel | Regra de Disparo |
|--------|--------------|-------------------|
| `index.html` | `PageView` | Carregamento da página. |
| `quiz.html` | `ViewContent` | Abertura do quiz. |
| `quiz.html` | `Lead` | Finalização das perguntas (antes do resultado). |
| `sales.html` | `ViewContent` | Carregamento da oferta. |
| `sales.html` | `InitiateCheckout` | **Clique no botão** (Kiwify) da oferta de R$37. |
| `obrigado.html` | `Purchase` | Tracking nativo Kiwify + manual para Upsell R$67. |

> [!IMPORTANT]
> **Delay de Pixel (Upsell)**: Na `obrigado.html`, delay de 300ms via `setTimeout` antes do redirecionamento para garantir disparo do `InitiateCheckout` no Meta.

---

## 🛠 DECISÕES DE DESIGN E CRO
1. **Estrutura Sales**: Headline → CTA scroll (sem VSL — removida por CRO) → oferta R$37.
2. **Preço atual**: R$37 (parcelamento 3x R$13,33). VSL removida para aumentar velocidade de conversão.
3. **Upsell**: Masterclass Blindagem R$67 — timer 15min na obrigado.html.
4. **Order Bump**: Protocolo Cofre R$27 — configurado no checkout Kiwify.
5. **Bônus**: App Janelas de Ouro em `https://www.fluxovital.top/app.html` — gratuito, entregue na área de membros e email de boas-vindas.
6. **Popups**: Exit-intent **REMOVIDOS**.
7. **Segurança**: `shield.js` obrigatório em todas as páginas.
8. **Área de membros**: Kiwify — PDF `CJO.pdf` hospedado no Google Drive, linkado na área.

---

## 📈 ESTRATÉGIA E PERFORMANCE (Benchmark 03-09/04/2026)
- **Fase Atual**: Creative Engine V5 + lançamento campanha X1 (WhatsApp).
- **Setup Campanha**: Meta Ads **ABO** — 7 conjuntos ativos/pausados.
- **Orçamento base**: R$27/dia por conjunto (AD4 escalado para R$40/dia).
- **Público**: Broad / Aberto — Feminino 25-44.
- **Meta de CTR**: > 2.0% em criativos N1.

### Resultado Acumulado (03-09/04):
| Adset | Criativo | Gasto | CTR | CPC | IC | Vendas | ROAS |
|---|---|---|---|---|---|---|---|
| AD4 | Bebê Dormindo | R$229 | 2,30% | R$1,10 | 41 | 4 | 0,62x |
| V2 | Dormir hora errada | R$92 | 4,39% | R$0,91 | 21 | 2 | 0,80x |
| V3 | Sentada berço | R$75 | 1,68% | R$2,27 | 8 | 1 | 0,49x |
| V1 | Coxixando | R$76 | 1,63% | R$1,90 | 8 | 0 | 0 |
| AD3 | Mãe madrugada | R$102 | 1,11% | R$1,75 | 2 | 1 | 0,41x |
| **TOTAL** | | **R$789** | | | **~96** | **~8** | **~0,42x** |

### Diagnóstico AD4 (crítico):
- Dias 1-2 (R$27/dia): **4 vendas** — ROAS positivo
- Após escala para R$40/dia: **0 vendas** nos dias seguintes — IC continuam chegando (41 total) mas sem conversão
- **Causa provável**: escala alterou o público-alvo do algoritmo (saiu da fase de aprendizado ideal) + mudança de checkout Lastlink→Kiwify no mesmo período
- **Checkout**: IC→Compra histórico = ~8% (Lastlink). Kiwify ainda não tem dados suficientes para comparação.

### Agente WhatsApp X1 (Versão 4 — 10/04/2026):
- **Motor**: Gemini API (`gemini-flash-latest`) — Substituiu o 1.5 que gerava erro 404.
- **Estrutura**: N8N + Evolution API (Instância `fluxovital`).
- **Build**: Controlado pelo `build-workflow.js`.
- **Lógica**: Baseada em **Objetivos Dinâmicos** (Estágios 1 a 9).
- **Diretrizes de Persona**: 
  - Dra. Renata Tinoco (Autoridade Acolhedora).
  - Máximo de 1 termo carinhoso ("mamãe"/"meu amor") por mensagem.
  - Formatação obrigatória com parágrafos duplos (`\n\n`) para legibilidade.
- **Checkout com UTM**: `https://pay.kiwify.com.br/HHjLKvh?utm_source=whatsapp&utm_medium=x1&utm_campaign=cjo`

---

## 👥 INTELIGÊNCIA DE AUDIÊNCIA (Benchmark 03-06/04/2026)
> Dados extraídos da campanha Nova ABO (Broad/Aberto) — 5 conjuntos, R$27/dia.
> Usar como referência para segmentação e posicionamento em campanhas futuras.

### Perfil Demográfico — Quem está consumindo o criativo:
| Faixa Etária | Gênero | Alcance | Impressões | Frequência |
|---|---|---|---|---|
| **25-34** | **Feminino** | **4.019** | **7.056** | **1,76** |
| **35-44** | **Feminino** | **3.257** | **5.624** | **1,73** |
| 25-34 | Masculino | 573 | 741 | 1,29 |
| 35-44 | Masculino | 414 | 606 | 1,46 |
| 45-54 | Feminino | 198 | 289 | 1,46 |
| 55-64 | Feminino | 135 | 205 | 1,52 |

> **Conclusão**: Público dominante é **Feminino 25-44 anos** (70%+ do alcance). Masculino é residual. Em campanhas futuras com segmentação manual, focar nessa faixa.

### Posicionamentos — Distribuição de alcance:
| Posicionamento | Plataforma | Alcance | Impressões | Frequência |
|---|---|---|---|---|
| **Instagram Stories** | Instagram | **3.308** | **5.228** | **1,58** |
| **Feed** | Instagram | **3.181** | **4.464** | **1,40** |
| Feed | Facebook | 2.947 | 4.388 | 1,49 |
| Instagram Reels | Instagram | 2.594 | 3.072 | 1,18 |
| Facebook Reels | Facebook | 303 | 403 | 1,33 |
| Feed do Threads | Threads | 354 | 373 | 1,05 |

> **Conclusão**: **Instagram Stories + Feed Instagram** lideram em alcance e frequência — são os posicionamentos prioritários. Facebook Feed performou bem também. Reels teve alcance relevante mas frequência baixa (1,18). Threads é residual — considerar excluir em campanhas futuras para concentrar budget.

---

## 🚀 COMO CONTINUAR
- Use o `spy-dashboard-diário.jsx` para analisar métricas semanais.
- Antes de subir novos criativos, consulte o `Marketing JV\mecanismos_vencedores.md`.
- Priorize sempre o **viewport Mobile (375px)** em qualquer alteração visual.
- UTMs e fbclid persistem nos links Kiwify via `getPreservedParams()` na `sales.html`.

## 🔄 DECISÕES PENDENTES (09/04/2026)
- [x] Agente WhatsApp V4: Estabilizado com `gemini-flash-latest` (10/04).
- [ ] AD4 (Bebê Dormindo): decidir entre pausar ou voltar para R$27/dia.
- [ ] Monitorar se a formatação de parágrafos V4 está mantendo o engajamento.
- [ ] Configurar retargeting de IC sem Purchase (público quente de ~96 pessoas).
- [ ] Confirmar link exato da área de membros Kiwify para atualizar `obrigado.html`.
