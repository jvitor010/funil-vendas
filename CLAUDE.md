# CLAUDE.md — Contexto do Projeto CJO (Código das Janelas de Ouro)

> **ESTADO ATUAL** (22/04/2026): CRO audit e redesign completo da `sales.html` concluídos e deployados. Próximos passos: monitorar conversão com nova página, configurar retargeting, gravar depoimentos em vídeo.
> Checkout ativo: **Lastlink** `https://lastlink.com/p/CDF5A76C7/checkout-payment/` | Preço: **R$27** (4x R$7,44)
> Deploy: **GitHub → Vercel auto-deploy** (NÃO usar Hostgator cPanel).

---

## 📂 ESTRUTURA DO FUNIL E ATIVOS

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

### Plataforma de Pagamento: Lastlink (migrado de Kiwify em 16/04/2026)
- **Checkout principal CJO R$27:** `https://lastlink.com/p/CDF5A76C7/checkout-payment/`
- **Upsell Plano de Implementação Turbo:** Lastlink (link configurado na obrigado.html)
- Pixel Meta ID `1803679593924822`
- **Histórico de checkout**: Lastlink → Kiwify (09/04) → Lastlink (sales.html atualizado 16/04) → Kiwify encerrado definitivamente **19/04**

### Fluxo de Eventos e Delay Técnico:
| Página | Evento Pixel | Regra de Disparo |
|--------|--------------|-------------------|
| `index.html` | `PageView` | Carregamento da página. |
| `quiz.html` | `ViewContent` | Abertura do quiz. |
| `quiz.html` | `Lead` | Finalização das perguntas (antes do resultado). |
| `sales.html` | `ViewContent` | Carregamento da oferta. |
| `sales.html` | `InitiateCheckout` | **Clique no botão** Lastlink da oferta de R$27. |
| `obrigado.html` | `Purchase` | Tracking nativo Lastlink + manual para Upsell. |

> [!IMPORTANT]
> **Delay de Pixel (Upsell)**: Na `obrigado.html`, delay de 300ms via `setTimeout` antes do redirecionamento.

---

## 🛠 DECISÕES DE DESIGN E CRO
1. **Estrutura Sales**: Headline → CTA scroll (sem VSL — removida por CRO) → oferta R$27.
2. **Preço atual**: R$27 (4x R$7,44). Reduzido de R$37 em 17/04/2026.
3. **CTA Fixo Mobile**: aparece somente após **50% de scroll** (corrigido 17/04 — antes inflava ICs).
4. **Botão WhatsApp na sales.html**: número `5531973646419` — aparece antes do footer.
5. **Popups**: Exit-intent **REMOVIDOS**.
6. **Segurança**: `shield.js` obrigatório em todas as páginas.
7. **Deploy**: GitHub → Vercel auto-deploy. `git push origin main` publica automaticamente. **NÃO usar Hostgator cPanel.**

### Redesign sales.html (22/04/2026)
- **Design system unificado** com index/quiz: `--bg:#fdfaf6`, `--gold:#f59e0b`, `--green:#10b981`, `--navy:#0f172a`, fonte Montserrat, gradientes radiais quentes, max-width 640px single-column
- **Avatar autoridade**: `assets/autora.png` — Dra. Renata Tinoco, Consultora de Sono Infantil
- **Copy emocional** aprimorada com psicologia da persona: culpa materna, solidão, identidade perdida, medo de dano ao bebê
- **Urgência honesta**: "preço sobe para R$97 após esta fase" — sem timer/contador falso (risco de moderação)
- **FAQs Q12-Q15 adicionadas**: IA, pediatra, medo de fracasso, dano emocional ao bebê
- **FAQ accordion**: Alpine.js **REMOVIDO** — substituído por `faqToggle()` vanilla JS + CSS `max-height` transition. O plugin `@alpinejs/collapse` não estava carregado, mantendo respostas permanentemente ocultas via `x-cloak`
- **Tailwind removido** da sales.html — pure CSS com custom properties (sem CDN externo desnecessário)

> [!WARNING]
> ICs de 13-16/04 estão inflados (CTA aparecia desde o início). **NUNCA comparar ICs antes/depois de 17/04** — são métricas diferentes.

---

## 📈 CAMPANHA ATUAL — Teste Controlado 18-25/04/2026

### Setup
- **Único adset ativo**: AD4-Copy (Bebê Dormindo — copy de texto)
- **Orçamento**: Vitalício R$189 com programação **07h-23h** (corrigido front-loading madrugada)
- **Critério de saída**: ROAS < 0,8x ao final de 25/04 → pausa definitiva do produto
- V2-Stories, V2-HookA, V2-Base: **pausados**
- Campanha existente mantida (preserva aprendizado de audiência — NÃO criar nova)

### Métricas AD4-Copy (13-17/04 — referência pré-teste)
- Gasto: R$147,36 | CTR: 3,23% | CPC: R$0,47 | IC: 86 | Custo/IC: R$1,71
- 1 venda real líquida (R$37) — período com checkout instável

### Métricas Período Limpo 18-21/04 (Lastlink+Kiwify → só Lastlink a partir de 20/04)
| Adset | Gasto | CTR | CPC | ICs | Compras reais | ROAS real |
|---|---|---|---|---|---|---|
| AD4-Copy (ativo) | R$117,99 | 2,23% | R$0,55 | 56 | 0 | 0x |
| V2-Base (inativo) | R$83,42 | 1,33% | R$0,77 | 26 | 1 | ~0,32x |
| **Total** | **~R$210** | | | **82** | **1** | **~0,13x** |

> **Diagnóstico 21/04**: Ambos os criativos falham na conversão → suspeita de problema na **sales.html** (não nos criativos). Critério de saída ROAS < 0,8x já atingido em 21/04, antes do prazo de 25/04.

### Vendas Reais Acumuladas (histórico corrigido)
| Período | Bruto | Reembolso | Teste | Líquido |
|---|---|---|---|---|
| 03-09/04 | 8 | 0 | 0 | 8 |
| 13-17/04 | 4 | 2 | 1 | **1** (AD4-Copy R$37) |
| 18-21/04 | 1 | 0 | 0 | **1** (V2-Base R$27) |
| **Total** | | | | **~10** |

> **Incidente 19/04**: V2-Base contabilizou 2x no Meta — Kiwify dupla contagem. É 1 venda real. Kiwify encerrado definitivamente após 19/04. Dados limpos (somente Lastlink): **20/04/2026**.

### Resultado Acumulado 03-09/04 (referência histórica):
| Adset | Gasto | CTR | IC | Vendas | ROAS |
|---|---|---|---|---|---|
| AD4 | R$229 | 2,30% | 41 | 4 | 0,62x |
| V2 | R$92 | 4,39% | 21 | 2 | 0,80x |
| V3 | R$75 | 1,68% | 8 | 1 | 0,49x |
| **TOTAL** | **R$789** | | **~96** | **~8** | **~0,42x** |

---

## 🤖 AGENTE WHATSAPP X1 (V8 — 20/04/2026)

### Stack Técnica
- **Motor**: Gemini API — modelo `gemini-flash-latest`
- **Configuração**: `temperature: 0.75`, `maxOutputTokens: 1000`, `thinkingConfig: { thinkingBudget: 0 }`
- **Estrutura**: N8N (workflow `cjo-agente-v2`) + Evolution API (instância `fluxovital`, porta 8080)
- **Webhook**: `http://localhost:5678/webhook/cjo-agente-v2/webhook/cjo-whatsapp`
- **Checkout com UTM**: `https://lastlink.com/p/CDF5A76C7/checkout-payment/?utm_source=whatsapp&utm_medium=x1&utm_campaign=cjo`

### Bugs Corrigidos (20/04/2026)
| Bug | Causa | Correção |
|---|---|---|
| Script antigo sendo usado | `systemPrompt` nunca substituído — marcador de fechamento incorreto | Scan por backtick direto; substituição confirmada |
| Agente usava só fallbacks (textos fixos) | `gemini-2.0-flash` descontinuado → 404 em 100% das chamadas | Modelo → `gemini-flash-latest` |
| Mensagens cortadas | `gemini-flash-latest` é thinking model — 477 tokens internos, ~23 pro texto | `thinkingBudget: 0` + `maxOutputTokens: 1000` |

### Script V8 — Regras Ativas no systemPrompt
- **IDENTIDADE**: Não é vendedora — é especialista que entende o peso da mãe
- **NUNCA PULE A DOR**: Mínimo 2 trocas dentro da dor antes de mecanismo ou oferta
- **ESPELHAMENTO**: Usar as palavras exatas que ela usou
- **TOM**: Acolhedor, firme, presente — "Mamãe" máx 1x por mensagem
- **EMOJIS**: 1-2 por mensagem, apenas 🌙 💛 🤍
- **Objeção financeira**: Começa pela dor, não pelo preço
- **Objeção implícita**: Monossilabos = objeção não verbalizada → perguntar diretamente
- **Reembolso**: Para completamente o pitch — orienta para plataforma onde comprou

### Objetivos Dinâmicos (Estágios 1-10)
| Estágio | Foco |
|---|---|
| 1 | Conexão genuína — pergunta sobre idade do bebê |
| 2 | Dor — primeira camada (específica por faixa: 0-3m, 4-6m, 7-11m, 12m+) |
| 3 | Dor — aprofundamento (obrigatório, nunca pular) |
| 4 | Mecanismo — revelação (analogia janela de fome, NÃO surfe) |
| 5 | Mecanismo — solidificação |
| 6 | Prova social que quebra objeção (Juliana/Camila/Fernanda por tipo) |
| 7 | Preparação para oferta |
| 8 | Oferta completa — R$27, 4x R$7,44 |
| 9 | Fechamento — objeções 4 passos |
| 10 | Última mensagem — com dignidade |

### Workflows N8N Ativos
| ID | Nome | Função |
|---|---|---|
| `cjo-agente-v2` | CJO — Agente Conversacional WhatsApp V7 | Agente principal (ATIVO) |
| `cjo-followup-remarketing` | CJO — Follow-up Remarketing (TOFU/MOFU/BOFU) | Follow-up automático (ATIVO) |
| `QeyL4RHQWdcyLqaf` | Fluxo Vital — Agente Conversacional WhatsApp | Workflow legado (ATIVO — não usado pelo CJO) |

---

## 👥 INTELIGÊNCIA DE AUDIÊNCIA (Benchmark 03-06/04/2026)

### Perfil Demográfico:
| Faixa Etária | Gênero | Alcance | Frequência |
|---|---|---|---|
| **25-34** | **Feminino** | **4.019** | **1,76** |
| **35-44** | **Feminino** | **3.257** | **1,73** |

> Público dominante: **Feminino 25-44 anos** (70%+ do alcance).

### Posicionamentos Prioritários:
1. Instagram Stories (3.308 alcance, freq 1,58)
2. Feed Instagram (3.181 alcance, freq 1,40)
3. Facebook Feed (2.947 alcance, freq 1,49)

---

## 🧪 METODOLOGIA DE TESTES E ESCALA (Meta Ads)

### Validação de Criativo — Critérios (5–7 dias):
| Métrica | Mínimo |
|---|---|
| CTR (Link) | ≥ 2,0% |
| Hook Rate | ≥ 30% |
| Hold Rate | ≥ 15% |
| CPA | ≤ R$40 |
| Frequência | < 2,5 |
| Conversões | ≥ 3 vendas |

**Diagnóstico IC→Compra:**
- < 5% → problema no criativo
- 5–8% → problema na sales.html (CRO)
- > 8% sem compras → atrito no checkout

### Regras de Escala:
- **NUNCA editar adset original vencedor — sempre duplicar**
- Vertical: máx 20% a cada 3-5 dias
- Horizontal: duplicar adset para testar variações
- CBO: somente com 3+ criativos validados e ≥ 50 compras

---

## 🚀 COMO CONTINUAR
- Deploy: `git add` → `git commit` → `git push origin main` → Vercel publica automaticamente
- Use `spy-dashboard-diário.jsx` para métricas semanais
- Priorize **viewport Mobile (375px)** em qualquer alteração visual
- Para alterar agente: editar via N8N API (workflow `cjo-agente-v2`) ou diretamente na interface N8N

## 🔄 DECISÕES PENDENTES (22/04/2026)
- [x] **AD4-Copy**: critério de saída atingido (ROAS 0x em 21/04) — pausado
- [x] **CRO audit sales.html**: redesign completo deployado em 22/04 — monitorar conversão
- [ ] **Monitorar sales.html nova**: acompanhar IC→Compra com nova página (meta: ≥ 5%)
- [ ] **V2-Base**: editar corpo do vídeo (retenção 5,81% — perde ~94% no body)
- [ ] **Typebot funnel**: testar APÓS confirmar melhora na conversão da sales.html
- [ ] **Retargeting**: configurar para ICs sem Purchase (~262 pessoas + acumulado)
- [ ] **Depoimentos em vídeo**: 4 roteiros criados (8s/fala) — gravar e subir
