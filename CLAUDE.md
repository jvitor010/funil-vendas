# CLAUDE.md — Contexto do Projeto CJO (Código das Janelas de Ouro)

> **ESTADO ATUAL**: Funil 100% corrigido e otimizado para tráfego pago.
> Parâmetros de rastreamento (UTMs/fbclid) agora persistem por todo o funil.
> Eventos do Pixel limpos e precisos.

---

## 📂 ESTRUTURA DO FUNIL ATIVO
Os arquivos de produção estão localizados na subpasta `/Funil CJO/`.

```
/Funil CJO/
├── index.html       ← Entrada (Presevação de UTMs p/ Quiz)
├── quiz.html        ← Diagnóstico (Evento: Lead | Propagação p/ Sales)
├── sales.html       ← Oferta (Evento: InitiateCheckout | VSL abaixo da Headline)
├── obrigado.html    ← Pós-venda (Evento: Purchase p/ Upsell | Área de Membros)
└── assets/          ← Imagens, Ícones e o shield.js (Anti-Spy)
```

---

## 🎯 RASTREAMENTO E PIXEL (Meta Ads)
**ID Principal:** 1803679593924822

### Fluxo de Eventos Corrigido:
| Página | Evento Pixel | Regra de Disparo |
|--------|--------------|-------------------|
| `index.html` | `PageView` | Carregamento da página. |
| `quiz.html` | `ViewContent` | Abertura do quiz. |
| `quiz.html` | `Lead` | Ao completar as 6 perguntas (antes do resultado). |
| `sales.html` | `ViewContent` | Carregamento da página de vendas. |
| `sales.html` | `InitiateCheckout` | **Somente** no clique do botão de compra (Lastlink). |
| `obrigado.html` | `Purchase` | Tracking nativo da Lastlink + Tracking manual para Upsell. |

> [!IMPORTANT]
> **Preservação de Dados**: Todas as páginas utilizam a lógica `getPreservedParams()` para capturar `fbclid` e `UTMs`. Isso garante que as vendas sejam atribuídas corretamente à campanha/anúncio original no Gerenciador de Anúncios.

---

## 🛠 DECISÕES DE DESIGN E CRO
1. **Layout Sales**: A **Headline (H1)** fica no topo, seguida imediatamente pela **VSL**. O CTA principal de R$27 aparece logo abaixo do vídeo.
2. **Popups**: Todos os popups de exit-intent foram **REMOVIDOS** para simplificar a jornada e evitar distração/bloqueios.
3. **Mobile-First**: Design 100% otimizado para celulares (90% do tráfego).
4. **Segurança**: O script `shield.js` deve estar presente em todas as páginas para dificultar cópias por ferramentas de spy.

---

## 📈 PERFORMANCE (Benchmark 03/04/2026)
- **Criativo Winner**: AD4 (Imagem estática - Gancho "Adrenalina").
- **CTR**: ~3.6% (Excelente).
- **Ticket Principal**: R$27,00.
- **Upsell**: Masterclass Blindagem (R$67,00).

---

## 🚀 COMO CONTINUAR
- Priorize sempre a manutenção da **preservação de parâmetros** ao criar novas páginas ou links.
- Teste alterações sempre com o **Viewport Mobile (375px)**.
- Se houver divergência de métricas (venda não marcando), verifique se o `fbclid` está chegando até a URL da Lastlink no final da `sales.html`.
