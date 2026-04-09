# CLAUDE.md — Contexto do Projeto CJO (Código das Janelas de Ouro)

> **ESTADO ATUAL**: Funil 100% corrigido e otimizado para tráfego pago.
> Parâmetros de rastreamento (UTMs/fbclid) agora persistem por todo o funil.
> Eventos do Pixel limpos e precisos.

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

### Fluxo de Eventos e Delay Técnico:
| Página | Evento Pixel | Regra de Disparo |
|--------|--------------|-------------------|
| `index.html` | `PageView` | Carregamento da página. |
| `quiz.html` | `ViewContent` | Abertura do quiz. |
| `quiz.html` | `Lead` | Finalização das 6 perguntas (antes do resultado). |
| `sales.html` | `ViewContent` | Carregamento da oferta. |
| `sales.html` | `InitiateCheckout` | **Clique no botão** (Lastlink) da oferta de R$27. |
| `obrigado.html` | `Purchase` | Tracking nativo Lastlink + Tracking manual para o Upsell de R$67. |

> [!IMPORTANT]
> **Delay de Pixel (Upsell)**: Na `obrigado.html`, as funções de checkout utilizam um **delay de 300ms** via `setTimeout` para garantir que o Meta Ads capture o evento de `InitiateCheckout` ou `Purchase` antes do redirecionamento.

---

## 🛠 DECISÕES DE DESIGN E CRO
1. **Estrutura Sales**: **Headline (H1)** clara no topo -> **VSL** central -> **CTA** imediato (R$27).
2. **Upsell**: Masterclass Blindagem (R$67) com timer de escassez de 15 minutos na página de obrigado.
3. **Popups**: Todos os overlays de exit-intent foram **REMOVIDOS** para simplificar a jornada.
4. **Segurança**: Script `shield.js` obrigatório em todas as páginas production.

---

## 📈 ESTRATÉGIA E PERFORMANCE (Benchmark 04/04/2026)
- **Fase Atual**: Lançamento da **Creative Engine V5** (Teste de Conceitos).
- **Setup Campanha**: Meta Ads **ABO 1-1-1** em 5 conjuntos independentes.
- **Orçamento**: R$ 27,00 por conjunto/dia.
- **Público**: Broad / Aberto (Foco 100% no criativo para segmentar).
- **Meta de CTR**: > 2.0% em criativos de Nível N1 (Unaware).

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
- Verifique se o `fbclid` persiste até a URL final da checkout para garantir a atribuição.
