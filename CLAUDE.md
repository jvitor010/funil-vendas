# CLAUDE.md — Contexto do Projeto CJO (Código das Janelas de Ouro)

> **ESTADO ATUAL** (20/04/2026)
> **Preço principal:** R$27 (reduzido de R$37 em 17/04 para tentar melhorar conversão)
> **Checkout principal:** Lastlink (revertido de Kiwify em 16/04 — histórico: Lastlink → Kiwify 09/04 → Lastlink 16/04)
> **Checkout URL confirmada:** `https://lastlink.com/p/CDF5A76C7/checkout-payment/`
> **Upsell:** Plano de Implementação Turbo R$67 → `https://lastlink.com/p/C185193A7/checkout-payment/`
> **Área de membros:** `https://lastlink.com/f/codigodasjanelasdeourocjo1432/members-area`
> **Agente WhatsApp X1 V4** ativo com `gemini-flash-latest`. Persona Dra. Renata ajustada.
>
> ⚠️ **PROBLEMA DE ENTREGA RESOLVIDO:** Houve 2 reembolsos no período 13-17/04 por falha na entrega do produto. Já corrigido. Desconsiderar essas 2 vendas nas métricas de conversão.
> ⚠️ **VENDA DE TESTE:** A venda de 17/04 foi um teste manual da operadora para verificar o funil. Não conta como venda real.
> ⚠️ **CAMPANHA ATUAL:** Apenas AD4-Copy ativo. Orçamento vitalício R$189 com programação 07h-23h. Período: 18-25/04. Critério de saída: ROAS < 0,8x ao final = pausa definitiva.
> ⚠️ **DUPLA CONTAGEM 19/04:** Uma venda do dia 19/04 foi contabilizada duas vezes — o checkout estava com URL da Kiwify ainda no deploy, e a venda apareceu em ambas as plataformas. Não contar como 2 vendas. Total real acumulado: 4 vendas (2 reembolsadas, 1 teste manual, 1 real líquida AD4-Copy).
>
> 🔴 **INÍCIO DE SESSÃO:** Leia este arquivo completo antes de qualquer análise ou recomendação.

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

### Plataforma de Pagamento: Lastlink (revertido em 16/04/2026)
> Histórico de trocas: Lastlink → Kiwify (09/04) → Lastlink (16/04)
- **Checkout principal CJO R$27:** `https://lastlink.com/p/CDF5A76C7/checkout-payment/`
- **Upsell Plano de Implementação Turbo R$67:** `https://lastlink.com/p/C185193A7/checkout-payment/`
- **Área de membros:** `https://lastlink.com/f/codigodasjanelasdeourocjo1432/members-area`
- Pixel Meta ID `1803679593924822`
- ~~Kiwify (pausado): `https://pay.kiwify.com.br/HHjLKvh`~~ — não usar

### Fluxo de Eventos e Delay Técnico:
| Página | Evento Pixel | Regra de Disparo |
|--------|--------------|-------------------|
| `index.html` | `PageView` | Carregamento da página. |
| `quiz.html` | `ViewContent` | Abertura do quiz. |
| `quiz.html` | `Lead` | Finalização das perguntas (antes do resultado). |
| `sales.html` | `ViewContent` | Carregamento da oferta. |
| `sales.html` | `InitiateCheckout` | **Clique no botão Lastlink** da oferta de R$27. Dispara via `trackCheckout()` com delay 300ms antes do redirect. |
| `obrigado.html` | `Purchase` | Tracking nativo Lastlink + manual para Upsell R$67. |

> [!IMPORTANT]
> **Delay de Pixel (Upsell)**: Na `obrigado.html`, delay de 300ms via `setTimeout` antes do redirecionamento para garantir disparo do `InitiateCheckout` no Meta.

---

## 🛠 DECISÕES DE DESIGN E CRO
1. **Estrutura Sales**: Headline → CTA scroll (sem VSL — removida por CRO) → oferta.
2. **Preço atual**: R$27 (reduzido de R$37 em 17/04 para melhorar conversão). Sem parcelamento no novo ticket.
3. **Upsell**: Plano de Implementação Turbo R$67 — timer 15min na obrigado.html. (Substituiu "Masterclass Blindagem")
4. **Order Bump**: removido com a saída do Kiwify.
5. **Bônus**: App Janelas de Ouro em `https://www.fluxovital.top/app.html` — gratuito, entregue na área de membros e email de boas-vindas.
6. **Popups**: Exit-intent **REMOVIDOS**.
7. **Segurança**: `shield.js` obrigatório em todas as páginas.
8. **Área de membros**: Lastlink — `https://lastlink.com/f/codigodasjanelasdeourocjo1432/members-area`

---

## 📈 ESTRATÉGIA E PERFORMANCE (Benchmark 13-17/04/2026)
- **Fase Atual**: Teste controlado 7 dias — AD4-Copy único adset ativo.
- **Setup Campanha**: Meta Ads ABO — orçamento **vitalício R$189**, programação **07h-23h**, período **18-25/04/2026**.
- **Adsets ativos**: apenas AD4-Copy. V2-Stories e V2-HookA pausados. V2-Base pausado.
- **Público**: Broad / Aberto — Feminino 25-44.
- **Meta de CTR**: > 2.0% | **Critério de saída**: ROAS < 0,8x ao final de 25/04 = pausa definitiva.
- **Campanha existente mantida** — não criar nova campanha (preserva aprendizado de audiência).

### ⚠️ MUDANÇA CRÍTICA NO FUNIL — 17/04/2026 às 10:34h
**CTA Fixo Mobile corrigido**: antes aparecia desde o início da página, enviando leads não qualificados direto ao checkout e inflando IC artificialmente. Após correção, aparece somente após **50% de scroll**.
- **Efeito nos dados**: ICs do período 13-16/04 estão inflados — não usar como benchmark absoluto
- **ICs pós-17/04** são menores em volume mas mais qualificados — taxa IC→Compra deve ser mais alta
- **NÃO comparar volume de ICs antes e depois de 17/04** — são métricas diferentes

### Diagnóstico 18/04 (dados parciais — exportado às 05h):
- **Front-loading de madrugada**: R$63 gastos entre 2h-5h com 0 ICs. Causa: CPM barato de madrugada + audiência passiva. Resolvido com orçamento vitalício + programação 07h-23h.
- **V2-Base — Métricas de Vídeo (13-17/04)**:
  - PLAY RATE DO HOOK: 96% — hook funciona
  - RETENCAO DO HOOK: 24%
  - **RETENCAO DO BODY: 4,57%** — corpo do vídeo perde 95% das pessoas. Precisa de edição urgente.
  - MEDIDOR DE CTA: 11%
- **AD4-Copy (texto/imagem)**: CTR 1,15% às 5h da manhã — dado não representativo. Histórico: 3,23%.

### Resultado Acumulado (13-17/04) — LEITURA CORRIGIDA:
> ⚠️ Checkout em transição no período: Kiwify (13-15/04) → Lastlink (16/04+). Preço: R$37 → R$27 em 17/04.
> ⚠️ Das compras registradas: 2 reembolsadas (V2-Stories — problema de entrega, já corrigido). 1 teste manual (17/04). Venda real líquida: **1** (AD4-Copy, R$37).

| Adset | Criativo | Venda Real | Reembolso | Teste | IC | Observação |
|---|---|---|---|---|---|---|
| AD4-Copy | Bebê Dormindo (copy) | **1** | 0 | 0 | — | Única venda real no período |
| V2-Stories | Dormir hora errada (stories) | 0 | **2** | 0 | — | Entrega falhou — corrigido |
| V2-Base | Dormir hora errada (base) | 0 | 0 | 0 | **~78** | 78 ICs sem conversão — provável bug Kiwify→Lastlink |
| Teste 17/04 | — | 0 | 0 | **1** | — | Verificação manual do funil |

### Resultado Acumulado (13-20/04) — LEITURA CORRIGIDA:
> ⚠️ Gasto total ~R$737 | Receita líquida real: R$54 (2 vendas × R$27) | ROAS acumulado: ~0,07x — INVÁLIDO para diagnóstico (checkout instável, dupla contagem, madrugada queimada).
> ⚠️ Meta registrou 9 compras. Real: 4 brutas → 2 reembolsadas → 1 dupla contagem 19/04 → **1 venda real líquida** (AD4-Copy, R$37, período 13-17).
> ✅ **Primeiro dia de dados limpos: 20/04** — todos os erros técnicos corrigidos e deployados via Vercel.

| Período | CTR AD4-Copy | CTR V2-Base | Compras Meta | Real Líquido |
|---|---|---|---|---|
| 13-17/04 | 3,23% | — | 4 brutas | 1 (+ 2 reimb + 1 teste) |
| 18/04 (parcial) | 1,15% (5h) | — | — | dados inválidos (madrugada) |
| 19/04 | ~2,66% | ~2,31% | 1 dupla contagem | 0 real |
| 20/04+ | *dados limpos* | *dados limpos* | — | — |

### Diagnóstico do Período (13-17/04):
- **V2-Base anomalia**: ~78 ICs sem nenhuma compra — fortemente ligado à transição Kiwify→Lastlink. Checkout pode ter quebrado durante a migração.
- **V2-Stories reembolsos**: Entrega do produto falhou (arquivo/acesso). Problema corrigido. As 2 vendas não devem ser contadas como conversão real.
- **AD4-Copy**: Único conjunto com venda real líquida (1 venda a R$37). Sinal de que o copy de texto funciona.
- **Preço R$27**: Alterado em 17/04 — ainda sem dados de conversão para esse ticket.
- **Referência histórica IC→Compra**: ~8% na Lastlink. Com os dados contaminados pela migração, usar essa referência com cautela.

### Agente WhatsApp X1 (Versão 4 — 10/04/2026):
- **Motor**: Gemini API (`gemini-flash-latest`) — Substituiu o 1.5 que gerava erro 404.
- **Estrutura**: N8N + Evolution API (Instância `fluxovital`).
- **Build**: Controlado pelo `build-workflow.js`.
- **Lógica**: Baseada em **Objetivos Dinâmicos** (Estágios 1 a 9).
- **Diretrizes de Persona**: 
  - Dra. Renata Tinoco (Autoridade Acolhedora).
  - Máximo de 1 termo carinhoso ("mamãe"/"meu amor") por mensagem.
  - Formatação obrigatória com parágrafos duplos (`\n\n`) para legibilidade.
- **Checkout com UTM (Lastlink)**: `https://lastlink.com/p/CDF5A76C7/checkout-payment/?utm_source=whatsapp&utm_medium=x1&utm_campaign=cjo`

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
- UTMs e fbclid persistem nos links Lastlink via `getPreservedParams()` na `sales.html` (confirmar se função está atualizada para Lastlink).

## 🚢 DEPLOY — FLUXO CORRETO
> **GitHub → Vercel (auto-deploy)** — configurado e ativo.
> **NÃO é necessário** fazer upload manual via Hostgator cPanel. Qualquer instrução contrária está errada.
- Fluxo: editar arquivo local → `git add` → `git commit` → `git push origin main` → Vercel detecta e publica automaticamente.
- Se o push for rejeitado: `git stash → git pull --rebase → git stash pop → git push`
- Confirmar deploy em: painel Vercel ou abrindo a URL do funil após o push.

## 🔄 DECISÕES PENDENTES (18/04/2026)
- [x] Agente WhatsApp V4: Estabilizado com `gemini-flash-latest` (10/04).
- [x] Checkout revertido para Lastlink (16/04). URL confirmada: `https://lastlink.com/p/CDF5A76C7/checkout-payment/`
- [x] Preço alterado para R$27 (17/04).
- [x] Problema de entrega (reembolsos V2-Stories) — corrigido.
- [x] AD4-Copy configurado com orçamento vitalício R$189, programação 07h-23h, período 18-25/04.
- [x] V2-Stories e V2-HookA pausados.
- [x] Depoimentos: 4 roteiros criados (8s por fala). Avatar IA (Veo 3.1) **descartado** — viola CDC Art.37 e política Meta (risco de ban de conta).
- [x] Campanha existente mantida — não criar nova (preserva aprendizado).
- [x] sales.html corrigida: URL Lastlink, CTA fixo mobile 50% scroll, parcelamento 4x R$7,44. Deploy via GitHub→Vercel confirmado.
- [x] Deploy automático GitHub→Vercel configurado e ativo. Não usar Hostgator cPanel.
- [x] Incidente 19/04 documentado: dupla contagem por URL Kiwify em deploy antigo. Total real: 1 venda líquida.
- [ ] **Monitorar ROAS AD4-Copy** até 25/04 — critério de saída: ROAS < 0,8x = pausa definitiva.
- [ ] **V2-Base body**: editar corpo do vídeo — RETENCAO DO BODY de 4,57% está destruindo resultado.
- [ ] **Typebot funnel**: testar em paralelo como adset separado após 25/04 (dependendo do resultado do teste atual).
- [ ] **Retargeting**: configurar público IC sem Purchase (~262 pessoas do período 13-17/04).
- [ ] **obrigado.html**: atualizar link upsell e área de membros para URLs Lastlink corretas.
- [ ] Monitorar engajamento do Agente WhatsApp X1 com formatação de parágrafos V4.

## 💡 IDEIAS PARA PRÓXIMAS ITERAÇÕES

### Reposicionamento: App como produto principal
- **Ideia**: trocar o foco do "método" para o "App Janelas de Ouro" como produto principal com pagamento único. O método vira o componente educacional/explicativo incluído.
- **Por que tem mérito**: app tem percepção de valor maior que guia/método; pagamento único por app é diferenciado; "app que identifica a janela de sono" é mais tangível e compartilhável que "método de sono"
- **Pré-requisito**: verificar se o app em `fluxovital.top/app.html` entrega experiência suficiente para ser o produto principal (risco de expectativa iOS/Android nativo vs PWA)
- **Quando executar**: após resultado do teste 18-25/04. Se ROAS < 0,8x → testar esse reposicionamento antes de encerrar o produto. Se ROAS ≥ 0,8x → testar como adset paralelo ao Typebot.

---

## 📋 PROTOCOLO DE SESSÃO
> Sempre que iniciar uma nova sessão: **leia este arquivo antes de qualquer análise ou recomendação.**
> Se houver contradição entre este arquivo e o que parece óbvio, pergunte antes de agir.
