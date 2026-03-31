import { useState } from "react";

// ─── Skills/Prompts prontos para usar com Claude ───
const skills = [
  {
    id: "mineracao",
    icon: "🔍",
    title: "Minerar Ofertas na Biblioteca",
    desc: "Cole este prompt no Claude para ele pesquisar ofertas escaladas direto na Facebook Ad Library",
    prompt: `Preciso que você pesquise ofertas escaladas na Facebook Ad Library.

PASSO 1 - Acesse a biblioteca:
Faça web_fetch em: https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q={PALAVRA_CHAVE}&search_type=keyword_unordered

PASSO 2 - Substitua {PALAVRA_CHAVE} por cada uma dessas e me traga os resultados:
- truque
- ritual
- método natural
- segredo
- descoberta

PASSO 3 - Para cada resultado encontrado, analise:
- Nome da página que está anunciando
- Quantos anúncios ativos essa página tem
- Data de início dos anúncios (quanto mais antigo + ainda ativo = mais escalado)
- Link de exibição usado
- Texto do anúncio (extraia o MECANISMO: qual é o "truque/ritual/método" mencionado)

PASSO 4 - Classifique as ofertas:
🔴 MUITO ESCALADA = 100+ anúncios ativos ou rodando há 30+ dias
🟡 ESCALANDO = 20-100 anúncios ou 15-30 dias ativo
🟢 TESTANDO = menos de 20 anúncios ou menos de 15 dias

Me entregue uma tabela organizada com: Página | Nº Anúncios | Dias Ativo | Mecanismo | Link de Exibição | Classificação`,
    variables: [
      { key: "PAIS", label: "País", placeholder: "BR, US, ES, FR, DE...", default: "BR" },
      { key: "NICHO", label: "Nicho", placeholder: "emagrecimento, renda extra, saúde..." },
      { key: "IDIOMA", label: "Idioma das keywords", placeholder: "português, inglês, espanhol..." }
    ]
  },
  {
    id: "analisar_concorrente",
    icon: "📊",
    title: "Analisar Concorrente Específico",
    desc: "Analisa profundamente um concorrente que você encontrou",
    prompt: `Preciso que você analise profundamente este concorrente na Facebook Ad Library.

PASSO 1 - Acesse:
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id={PAGE_ID}

Ou pesquise por: "{DOMINIO_OU_NOME}"

PASSO 2 - Análise de Escala:
- Quantos anúncios ATIVOS tem agora?
- Quantos anúncios INATIVOS (foram testados e pausados)?
- Há quanto tempo o anúncio mais antigo está rodando?
- Está rodando em quantos países?

PASSO 3 - Análise de Criativos (PADRÕES):
- Qual FORMATO predomina? (vídeo, imagem, carrossel)
- Qual duração média dos vídeos?
- Existe um GANCHO VISUAL padrão? (ex: imagem de pé, comida, antes/depois)
- Quantos formatos DIFERENTES está testando?
- Os criativos mais novos são iguais aos antigos ou mudaram algo?

PASSO 4 - Análise de Copy:
- Qual MECANISMO está usando? (truque, ritual, método, descoberta)
- Quais DORES está atacando no texto?
- Qual a PROMESSA principal?
- Tem urgência/escassez no texto?

PASSO 5 - Análise Estratégica:
- O cara duplicou campanhas ou escalou orçamento? (muitos ads iguais = duplicação, poucos ads = orçamento)
- Está usando link de exibição genérico (news.com, google.com) ou próprio?
- Aparece em múltiplas páginas? (confirma escala)

PASSO 6 - Entregue:
📋 FICHA DO CONCORRENTE com todos os dados acima
💡 3 INSIGHTS que posso aplicar na minha operação
⚠️ RISCOS de modelar essa oferta
🎯 PRÓXIMOS PASSOS recomendados`,
    variables: [
      { key: "DOMINIO_OU_NOME", label: "Domínio ou Nome da Página", placeholder: "exemplo.com ou 'Nome da Página'" },
      { key: "PAGE_ID", label: "Page ID (opcional)", placeholder: "ID numérico do Facebook" }
    ]
  },
  {
    id: "extrair_keywords",
    icon: "🔑",
    title: "Extrair Keywords de Criativo",
    desc: "Cole a transcrição de um vídeo/criativo e a IA extrai palavras-chave para minerar mais",
    prompt: `Você é um especialista em mineração de ofertas de tráfego direto.

Vou te enviar a TRANSCRIÇÃO de um criativo/anúncio que está escalando. Preciso que você:

ANÁLISE DO CRIATIVO:
1. NICHO: Identifique o nicho e subnicho
2. MECANISMO: Qual é o "truque/ritual/método" mencionado
3. DORES: Liste todas as dores mencionadas ou implícitas
4. PROMESSA: Qual resultado é prometido
5. PÚBLICO-ALVO: Quem é o lead ideal
6. HOOK: Qual gancho está sendo usado nos primeiros 5 segundos
7. OBJEÇÕES: Quais objeções são quebradas

GERE PALAVRAS-CHAVE EM 3 CATEGORIAS:

🔑 KEYWORDS DE MECANISMO (para achar ofertas similares):
- Variações do mecanismo em português, inglês e espanhol
- Palavras relacionadas ao "truque/ritual/método"

🔍 KEYWORDS DE DOR (para achar ofertas do mesmo nicho):
- Termos que o lead pesquisaria
- Variações em português, inglês e espanhol

📊 KEYWORDS DE PADRÃO (para achar na biblioteca):
- Frases exatas que provavelmente aparecem em outros anúncios similares
- Termos técnicos ou específicos do nicho

TOTAL: Me dê no mínimo 30 palavras-chave organizadas por categoria.

Para cada keyword, indique o IDIOMA e a PROBABILIDADE de encontrar ofertas (alta/média/baixa).

TRANSCRIÇÃO DO CRIATIVO:
"""
{TRANSCRICAO}
"""`,
    variables: [
      { key: "TRANSCRICAO", label: "Transcrição do criativo", placeholder: "Cole aqui a transcrição do vídeo...", multiline: true }
    ]
  },
  {
    id: "metricas",
    icon: "📈",
    title: "Analisar Métricas da Campanha",
    desc: "Cole suas métricas e receba diagnóstico completo com ações específicas",
    prompt: `Você é um especialista em métricas de tráfego direto que analisa campanhas no Facebook Ads.

MINHAS MÉTRICAS:
- Investimento diário: R$ {INVESTIMENTO}
- CPM (custo por mil impressões): R$ {CPM}
- CTR (taxa de clique): {CTR}%
- CPC (custo por clique): R$ {CPC}
- Cliques no link: {CLIQUES}
- Visualizações da página: {PAGE_VIEWS}
- Taxa de retenção VSL 25%: {RET_25}%
- Taxa de retenção VSL 50%: {RET_50}%
- Taxa de retenção VSL 75%: {RET_75}%
- Chegaram no checkout: {CHECKOUT}
- Iniciaram pagamento: {INITIATE}
- Vendas: {VENDAS}
- Ticket médio: R$ {TICKET}
- Faturamento: R$ {FATURAMENTO}
- ROI: {ROI}%
- País/idioma: {PAIS}

ANALISE ETAPA POR ETAPA:

1️⃣ CRIATIVO (CTR + CPM):
- CTR abaixo de 1% = criativo ruim. Acima de 2% = bom. Acima de 4% = excelente.
- Compare o CPM com a média do país.
- DIAGNÓSTICO: O criativo está performando bem? O que melhorar?

2️⃣ PÁGINA DE VENDAS (Cliques → Page Views):
- Se menos de 70% dos cliques viram page views, a página está lenta ou com problema.
- DIAGNÓSTICO: A página está convertendo o tráfego?

3️⃣ VSL / RETENÇÃO:
- Se cai 60%+ no primeiro minuto, o início da VSL está fraco.
- Se cai muito entre 25% e 50%, o meio está entediante.
- Se cai no final, o pitch de vendas é fraco.
- DIAGNÓSTICO: Onde exatamente está o furo na VSL?

4️⃣ CHECKOUT (Page Views → Checkout):
- Taxa saudável: 5-15% dos page views chegam no checkout.
- Abaixo de 5%: CTA fraco ou oferta não convence.
- DIAGNÓSTICO: O funil está levando para o checkout?

5️⃣ CONVERSÃO (Checkout → Venda):
- Taxa saudável: 3-10% do checkout converte.
- Abaixo de 3%: checkout feio, preço errado ou falta urgência.
- DIAGNÓSTICO: O checkout está convertendo?

📋 ENTREGUE:
- 🔴 PROBLEMAS CRÍTICOS (resolver AGORA)
- 🟡 PONTOS DE ATENÇÃO (melhorar em breve)
- 🟢 O QUE ESTÁ BOM (manter)
- 🎯 TOP 3 AÇÕES para melhorar o ROI (em ordem de prioridade)
- 📈 PROJEÇÃO: Se corrigir os problemas, qual ROI estimado?`,
    variables: [
      { key: "INVESTIMENTO", label: "Investimento/dia (R$)", placeholder: "200" },
      { key: "CPM", label: "CPM (R$)", placeholder: "15" },
      { key: "CTR", label: "CTR (%)", placeholder: "2.5" },
      { key: "CPC", label: "CPC (R$)", placeholder: "1.20" },
      { key: "CLIQUES", label: "Cliques no link", placeholder: "167" },
      { key: "PAGE_VIEWS", label: "Visualizações da página", placeholder: "130" },
      { key: "RET_25", label: "Retenção VSL 25%", placeholder: "45" },
      { key: "RET_50", label: "Retenção VSL 50%", placeholder: "25" },
      { key: "RET_75", label: "Retenção VSL 75%", placeholder: "12" },
      { key: "CHECKOUT", label: "Chegaram no checkout", placeholder: "15" },
      { key: "INITIATE", label: "Iniciaram pagamento", placeholder: "8" },
      { key: "VENDAS", label: "Vendas", placeholder: "3" },
      { key: "TICKET", label: "Ticket médio (R$)", placeholder: "97" },
      { key: "FATURAMENTO", label: "Faturamento (R$)", placeholder: "291" },
      { key: "ROI", label: "ROI (%)", placeholder: "45" },
      { key: "PAIS", label: "País/Idioma", placeholder: "Brasil / Português" }
    ]
  },
  {
    id: "modelar_gringa",
    icon: "🌎",
    title: "Modelar Oferta para o Exterior",
    desc: "Analisa viabilidade de adaptar uma oferta BR para outro país",
    prompt: `Você é um especialista em tráfego direto internacional.

OFERTA ORIGINAL (BRASIL):
- Nicho: {NICHO}
- Mecanismo: {MECANISMO}
- Ticket: R$ {TICKET_BR}
- Público-alvo: {PUBLICO}
- Dores principais: {DORES}
- Promessa: {PROMESSA}

PAÍS ALVO: {PAIS_ALVO}
IDIOMA: {IDIOMA_ALVO}

FAÇA A SEGUINTE ANÁLISE:

1️⃣ VIABILIDADE CULTURAL:
- As dores são universais ou específicas do Brasil?
- O mecanismo faz sentido na cultura do país alvo?
- Existe demanda para esse tipo de produto lá?
- Score de viabilidade: 1-10

2️⃣ PESQUISA DE MERCADO:
- Pesquise na Facebook Ad Library do país alvo ofertas similares
- Use: https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country={PAIS_CODE}&q={KEYWORD_TRADUZIDA}
- Existem concorrentes rodando ofertas parecidas? (se sim, ÓTIMO = mercado validado)
- Qual o nível de sofisticação desse mercado?

3️⃣ ADAPTAÇÕES NECESSÁRIAS:
- O que MANTER da oferta original
- O que MUDAR para o país alvo
- Traduções das keywords principais
- Sugestão de ticket em moeda local + equivalente em R$

4️⃣ ESTIMATIVA DE PERFORMANCE:
- CPM estimado no país alvo
- Comparação de custo vs. Brasil
- ROI projetado considerando câmbio
- Investimento mínimo recomendado

5️⃣ PLANO DE AÇÃO:
- Passo a passo para adaptar e lançar em 7 dias
- Quais criativos testar primeiro
- Como configurar a campanha`,
    variables: [
      { key: "NICHO", label: "Nicho", placeholder: "emagrecimento" },
      { key: "MECANISMO", label: "Mecanismo", placeholder: "truque da banana" },
      { key: "TICKET_BR", label: "Ticket no Brasil (R$)", placeholder: "47" },
      { key: "PUBLICO", label: "Público-alvo", placeholder: "Mulheres 35-55 que querem emagrecer" },
      { key: "DORES", label: "Dores principais", placeholder: "barriga, autoestima, roupas não servem" },
      { key: "PROMESSA", label: "Promessa", placeholder: "Perder 10kg em 30 dias" },
      { key: "PAIS_ALVO", label: "País alvo", placeholder: "México" },
      { key: "IDIOMA_ALVO", label: "Idioma", placeholder: "Espanhol" }
    ]
  },
  {
    id: "dominio_spy",
    icon: "🗺️",
    title: "Mapear Domínios do Concorrente",
    desc: "Descobre todos os domínios e páginas de um concorrente",
    prompt: `Preciso mapear completamente a operação de um concorrente.

DOMÍNIO ENCONTRADO: {DOMINIO}

PASSO 1 - ViewDNS:
Acesse: https://viewdns.info/reverseip/?host={DOMINIO}&t=1
Liste todos os domínios vinculados ao mesmo IP.
Filtre os que parecem relacionados ao nicho de {NICHO}.

PASSO 2 - Facebook Ad Library:
Para cada domínio encontrado que pareça relevante, pesquise na biblioteca:
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q={DOMINIO}
Verifique quantos anúncios cada domínio tem.

PASSO 3 - Análise de Padrões:
- O concorrente tem padrão nos nomes de domínio? (ex: sempre usa "health")
- Quantas páginas diferentes estão rodando?
- Os criativos são similares entre as páginas?
- Está usando cloaker? (link de exibição diferente do domínio real)

PASSO 4 - SemRush (se possível):
Acesse: https://www.semrush.com/analytics/overview/?q={DOMINIO}
- Volume de tráfego mensal
- Fontes de tráfego
- Crescimento mês a mês

ENTREGUE:
🗺️ MAPA COMPLETO da operação (domínios, páginas, anúncios)
📊 ESCALA estimada (baseado em nº de anúncios + tráfego)
🎯 PONTOS FRACOS do concorrente que posso explorar
💡 O QUE APRENDER com ele`,
    variables: [
      { key: "DOMINIO", label: "Domínio", placeholder: "exemplo.com" },
      { key: "NICHO", label: "Nicho", placeholder: "emagrecimento" }
    ]
  }
];

const automationGuide = [
  {
    title: "1. Claude + Web Search/Fetch (Agora mesmo)",
    difficulty: "🟢 Fácil",
    desc: "O Claude já consegue acessar a Facebook Ad Library via web_fetch porque é pública. Basta pedir.",
    steps: [
      "Abra uma conversa com Claude (aqui mesmo)",
      "Cole qualquer skill/prompt desta ferramenta",
      "O Claude vai usar web_fetch para acessar a biblioteca em tempo real",
      "Ele analisa os resultados e te entrega organizado",
      "Repita com diferentes keywords para cobrir mais terreno"
    ],
    limitation: "A biblioteca do Facebook tem limitações de renderização — o Claude vê o HTML mas nem sempre todos os anúncios carregam. Funciona melhor para buscas específicas."
  },
  {
    title: "2. Claude + Chrome Extension (Melhor método)",
    difficulty: "🟡 Médio",
    desc: "Use o 'Claude in Chrome' para navegar a biblioteca como humano. O Claude controla o navegador e extrai dados reais.",
    steps: [
      "Ative 'Claude in Chrome' nas configurações",
      "Peça: 'Abra a Facebook Ad Library e pesquise por [keyword]'",
      "O Claude navega, rola a página, conta anúncios",
      "Ele pode clicar em 'Ver detalhes' de cada anúncio",
      "Extrai links de exibição, datas, criativos",
      "Monta a planilha automaticamente"
    ],
    limitation: "Precisa ter o Claude in Chrome ativo. Mais lento que API direta, mas vê TUDO que um humano veria."
  },
  {
    title: "3. Script Python + Facebook Ad Library API",
    difficulty: "🔴 Avançado",
    desc: "A Meta tem uma API oficial da Ad Library. Com Python você automatiza completamente.",
    steps: [
      "Crie um app no Meta for Developers",
      "Gere um access token",
      "Peça ao Claude: 'Crie um script Python que consulta a Facebook Ad Library API'",
      "O script pesquisa keywords automaticamente",
      "Salva resultados em planilha/banco de dados",
      "Roda diariamente comparando com dia anterior",
      "Envia alerta quando oferta dobra anúncios"
    ],
    limitation: "Precisa de conta de desenvolvedor Meta. A API tem rate limits. Mas é o mais escalável."
  },
  {
    title: "4. Claude Code + Automação Completa",
    difficulty: "🔴 Avançado",
    desc: "Use Claude Code no terminal para criar um agente que roda sozinho todos os dias.",
    steps: [
      "Instale Claude Code (CLI)",
      "Peça para criar um projeto de mineração",
      "O agente usa: Facebook API + SemRush API + ViewDNS",
      "Roda via cron job (automático) 2x por dia",
      "Compara resultados com histórico (detecta crescimento)",
      "Gera relatório diário com ofertas novas/escalando",
      "Envia por email/Telegram/WhatsApp"
    ],
    limitation: "Mais complexo de configurar. Mas uma vez rodando, é totalmente hands-off."
  }
];

export default function SpyDashboard() {
  const [activeTab, setActiveTab] = useState("skills");
  const [activeSkill, setActiveSkill] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [expandedAuto, setExpandedAuto] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const buildPrompt = (skill) => {
    let prompt = skill.prompt;
    skill.variables.forEach(v => {
      const value = formValues[`${skill.id}-${v.key}`] || v.default || `[${v.label}]`;
      prompt = prompt.replaceAll(`{${v.key}}`, value);
    });
    return prompt;
  };

  const selectedSkill = skills.find(s => s.id === activeSkill);

  const tabStyle = (active) => ({
    padding: "10px 20px",
    borderRadius: 10,
    border: active ? "1px solid #f97316" : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.02)",
    color: active ? "#f97316" : "#888",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #09090b 0%, #18181b 50%, #0f172a 100%)",
      color: "#e4e4e7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 20px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(16px)"
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18
            }}>🕵️</div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#fafafa" }}>
                Spy Dashboard · Uso Diário
              </h1>
              <p style={{ fontSize: 11, color: "#71717a", margin: 0 }}>
                Skills prontas para copiar e colar no Claude
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            <button onClick={() => setActiveTab("skills")} style={tabStyle(activeTab === "skills")}>
              ⚡ Skills / Prompts
            </button>
            <button onClick={() => setActiveTab("auto")} style={tabStyle(activeTab === "auto")}>
              🤖 Como Automatizar
            </button>
            <button onClick={() => setActiveTab("rotina")} style={tabStyle(activeTab === "rotina")}>
              📋 Rotina Diária
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px" }}>

        {/* ─────── SKILLS TAB ─────── */}
        {activeTab === "skills" && (
          <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
            {!activeSkill ? (
              <>
                <p style={{ fontSize: 14, color: "#a1a1aa", margin: "0 0 4px", lineHeight: 1.6 }}>
                  Cada skill é um prompt pronto. Clique, preencha seus dados, copie e cole no Claude. Ele faz o trabalho pesado.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                  {skills.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSkill(s.id)}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        padding: "18px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        color: "inherit"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.background = "rgba(249,115,22,0.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: "#fafafa" }}>{s.title}</h3>
                      <p style={{ fontSize: 12, color: "#71717a", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                      <div style={{
                        marginTop: 10, fontSize: 11, color: "#f97316",
                        display: "flex", alignItems: "center", gap: 4
                      }}>
                        Abrir skill →
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : selectedSkill && (
              <div>
                <button
                  onClick={() => setActiveSkill(null)}
                  style={{
                    background: "none", border: "none", color: "#71717a",
                    cursor: "pointer", fontSize: 13, padding: "4px 0", marginBottom: 12
                  }}
                >
                  ← Voltar para todas as skills
                </button>

                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  overflow: "hidden"
                }}>
                  {/* Skill Header */}
                  <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(249,115,22,0.05)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 28 }}>{selectedSkill.icon}</span>
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#fafafa" }}>
                          {selectedSkill.title}
                        </h2>
                        <p style={{ fontSize: 13, color: "#a1a1aa", margin: "2px 0 0" }}>{selectedSkill.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Variables Form */}
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#f97316", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
                      Preencha seus dados
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: selectedSkill.variables.some(v => v.multiline) ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                      {selectedSkill.variables.map(v => (
                        <div key={v.key}>
                          <label style={{ fontSize: 12, color: "#a1a1aa", display: "block", marginBottom: 4 }}>
                            {v.label}
                          </label>
                          {v.multiline ? (
                            <textarea
                              placeholder={v.placeholder}
                              value={formValues[`${selectedSkill.id}-${v.key}`] || ""}
                              onChange={e => setFormValues(prev => ({ ...prev, [`${selectedSkill.id}-${v.key}`]: e.target.value }))}
                              style={{
                                width: "100%", minHeight: 120, padding: "10px 12px",
                                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 8, color: "#e4e4e7", fontSize: 13,
                                fontFamily: "inherit", resize: "vertical"
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder={v.placeholder}
                              value={formValues[`${selectedSkill.id}-${v.key}`] || ""}
                              onChange={e => setFormValues(prev => ({ ...prev, [`${selectedSkill.id}-${v.key}`]: e.target.value }))}
                              style={{
                                width: "100%", padding: "10px 12px",
                                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 8, color: "#e4e4e7", fontSize: 13,
                                fontFamily: "inherit", boxSizing: "border-box"
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Prompt */}
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
                        Prompt gerado · copie e cole no Claude
                      </h4>
                      <button
                        onClick={() => handleCopy(buildPrompt(selectedSkill), selectedSkill.id)}
                        style={{
                          padding: "8px 16px", borderRadius: 8,
                          background: copiedId === selectedSkill.id ? "#22c55e" : "#f97316",
                          border: "none", color: "white", cursor: "pointer",
                          fontSize: 13, fontWeight: 700, transition: "all 0.2s"
                        }}
                      >
                        {copiedId === selectedSkill.id ? "✅ Copiado!" : "📋 Copiar Prompt"}
                      </button>
                    </div>
                    <pre style={{
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      padding: "16px",
                      fontSize: 12,
                      lineHeight: 1.7,
                      color: "#a1a1aa",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      maxHeight: 400,
                      overflowY: "auto",
                      margin: 0
                    }}>
                      {buildPrompt(selectedSkill)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────── AUTOMAÇÃO TAB ─────── */}
        {activeTab === "auto" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.05))",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                Como automatizar a mineração com Claude
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0, lineHeight: 1.6 }}>
                4 níveis de automação — do mais simples ao mais avançado. Comece pelo nível 1 e vá subindo conforme precisar.
              </p>
            </div>

            {automationGuide.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: expandedAuto === i ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "all 0.2s"
                }}
              >
                <button
                  onClick={() => setExpandedAuto(expandedAuto === i ? null : i)}
                  style={{
                    width: "100%", padding: "16px 20px",
                    background: "none", border: "none",
                    cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    color: "inherit"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14 }}>{item.difficulty}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#fafafa" }}>{item.title}</h3>
                    </div>
                    <p style={{ fontSize: 12, color: "#71717a", margin: 0 }}>{item.desc}</p>
                  </div>
                  <span style={{
                    fontSize: 20, color: "#f97316",
                    transform: expandedAuto === i ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.2s"
                  }}>+</span>
                </button>

                {expandedAuto === i && (
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: 10,
                      padding: "16px"
                    }}>
                      <h4 style={{ fontSize: 12, color: "#f97316", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>
                        Passo a passo
                      </h4>
                      {item.steps.map((step, j) => (
                        <div key={j} style={{
                          display: "flex", gap: 10, marginBottom: 8,
                          alignItems: "flex-start"
                        }}>
                          <span style={{
                            minWidth: 22, height: 22, borderRadius: "50%",
                            background: "rgba(249,115,22,0.2)",
                            color: "#f97316", fontSize: 11, fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>{j + 1}</span>
                          <p style={{ fontSize: 13, color: "#d4d4d8", margin: 0, lineHeight: 1.5 }}>{step}</p>
                        </div>
                      ))}
                      <div style={{
                        marginTop: 12, padding: "10px 14px",
                        background: "rgba(234,179,8,0.08)",
                        border: "1px solid rgba(234,179,8,0.15)",
                        borderRadius: 8
                      }}>
                        <p style={{ fontSize: 12, color: "#eab308", margin: 0 }}>
                          ⚠️ {item.limitation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Quick automation prompt */}
            <div style={{
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#22c55e", margin: "0 0 8px" }}>
                ⚡ Prompt rápido para testar AGORA
              </h3>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: "0 0 12px" }}>
                Cole este prompt em uma nova conversa com o Claude:
              </p>
              <div style={{
                background: "rgba(0,0,0,0.4)",
                borderRadius: 10,
                padding: "14px",
                position: "relative"
              }}>
                <pre style={{
                  fontSize: 12, lineHeight: 1.6, color: "#a1a1aa",
                  whiteSpace: "pre-wrap", margin: 0
                }}>
{`Acesse a Facebook Ad Library e pesquise ofertas escaladas.

1. Faça web_fetch em cada URL abaixo e analise o HTML retornado:

- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=truque
- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=ritual
- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=trick
- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ritual

2. Para cada resultado, identifique:
- Páginas com MAIS anúncios ativos
- Links de exibição usados
- Mecanismos mencionados nos textos

3. Me entregue as TOP 10 ofertas mais escaladas que encontrar.`}
                </pre>
                <button
                  onClick={() => handleCopy(
                    `Acesse a Facebook Ad Library e pesquise ofertas escaladas.\n\n1. Faça web_fetch em cada URL abaixo e analise o HTML retornado:\n\n- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=truque\n- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=ritual\n- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=trick\n- https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ritual\n\n2. Para cada resultado, identifique:\n- Páginas com MAIS anúncios ativos\n- Links de exibição usados\n- Mecanismos mencionados nos textos\n\n3. Me entregue as TOP 10 ofertas mais escaladas que encontrar.`,
                    "quick"
                  )}
                  style={{
                    position: "absolute", top: 10, right: 10,
                    padding: "6px 12px", borderRadius: 6,
                    background: copiedId === "quick" ? "#22c55e" : "rgba(255,255,255,0.1)",
                    border: "none", color: "white", cursor: "pointer",
                    fontSize: 11, fontWeight: 600
                  }}
                >
                  {copiedId === "quick" ? "✅" : "📋"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────── ROTINA TAB ─────── */}
        {activeTab === "rotina" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                📋 Rotina Diária com as Skills
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0 }}>
                Faça isso 2-3x por semana. Em 30-45 minutos você cobre tudo.
              </p>
            </div>

            {[
              {
                time: "Bloco 1 · 10 min",
                title: "Espionagem Nativa",
                color: "#8b5cf6",
                tasks: [
                  "Abra Facebook/Instagram com VPN do país alvo",
                  "Role o feed por 10 min, curta conteúdo do nicho",
                  "Quando ver anúncio: clique 'tenho interesse', comente, entre no checkout",
                  "Anote novos anúncios que apareceram na sua planilha"
                ],
                skill: null
              },
              {
                time: "Bloco 2 · 10 min",
                title: "Mineração na Biblioteca",
                color: "#f97316",
                tasks: [
                  "Abra o Claude e use a skill '🔍 Minerar Ofertas'",
                  "Pesquise 3-5 keywords diferentes",
                  "Anote ofertas com 50+ anúncios ativos",
                  "Para as top 3, use a skill '📊 Analisar Concorrente'"
                ],
                skill: "mineracao"
              },
              {
                time: "Bloco 3 · 10 min",
                title: "Análise Profunda",
                color: "#22c55e",
                tasks: [
                  "Escolha 1-2 criativos mais escalados",
                  "Baixe e transcreva os vídeos",
                  "Use a skill '🔑 Extrair Keywords' para gerar novas palavras",
                  "Faça mais uma rodada de busca com as novas keywords"
                ],
                skill: "extrair_keywords"
              },
              {
                time: "Bloco 4 · 10 min",
                title: "Monitoramento",
                color: "#3b82f6",
                tasks: [
                  "Verifique suas ofertas monitoradas: mudou nº de anúncios?",
                  "Se uma oferta dobrou → analise o que mudou com a skill de concorrente",
                  "Atualize planilha com novos dados",
                  "Se tem campanha rodando: use a skill '📈 Analisar Métricas'"
                ],
                skill: "metricas"
              }
            ].map((block, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                overflow: "hidden"
              }}>
                <div style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: block.color
                    }} />
                    <div>
                      <span style={{ fontSize: 11, color: "#71717a" }}>{block.time}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#fafafa" }}>{block.title}</h3>
                    </div>
                  </div>
                  {block.skill && (
                    <button
                      onClick={() => { setActiveTab("skills"); setActiveSkill(block.skill); }}
                      style={{
                        padding: "6px 12px", borderRadius: 6,
                        background: `${block.color}22`,
                        border: `1px solid ${block.color}44`,
                        color: block.color, cursor: "pointer",
                        fontSize: 11, fontWeight: 600
                      }}
                    >
                      Abrir skill →
                    </button>
                  )}
                </div>
                <div style={{ padding: "12px 20px" }}>
                  {block.tasks.map((task, j) => (
                    <div key={j} style={{
                      display: "flex", gap: 8, marginBottom: 6,
                      alignItems: "flex-start"
                    }}>
                      <span style={{ color: block.color, fontSize: 12, marginTop: 2 }}>▸</span>
                      <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>{task}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Weekly Summary */}
            <div style={{
              background: "rgba(234,179,8,0.05)",
              border: "1px solid rgba(234,179,8,0.15)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#eab308", margin: "0 0 10px" }}>
                📊 Check Semanal (1x por semana, 20 min)
              </h3>
              <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 6px" }}>▸ Revise todas as ofertas da planilha — quais cresceram, quais pararam?</p>
                <p style={{ margin: "0 0 6px" }}>▸ Use a skill '🌎 Modelar para Exterior' nas top 3 ofertas BR</p>
                <p style={{ margin: "0 0 6px" }}>▸ Use a skill '🗺️ Mapear Domínios' nos top concorrentes</p>
                <p style={{ margin: "0 0 6px" }}>▸ Se tem campanha: analise métricas da semana inteira, não só do dia</p>
                <p style={{ margin: 0 }}>▸ Defina: qual oferta vou testar/modelar essa semana?</p>
              </div>
            </div>
          </div>
        )}

        <div style={{
          marginTop: 30, padding: 16, textAlign: "center",
          color: "#3f3f46", fontSize: 11,
          borderTop: "1px solid rgba(255,255,255,0.04)"
        }}>
          Spy Dashboard · Skills prontas para usar com Claude · Mineração de ofertas em tráfego direto
        </div>
      </div>
    </div>
  );
}
