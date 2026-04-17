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
    id: "diagnosticar_esteira",
    icon: "🔧",
    title: "Diagnosticar Esteira de Backend",
    desc: "Analisa upsell, order bump, take rate e ticket médio — encontra o gargalo que está travando receita",
    prompt: `Você é um especialista em esteiras de backend de tráfego direto.

Analise minha esteira etapa por etapa e entregue um diagnóstico completo.

MINHA ESTEIRA ATUAL:
{ESTEIRA}

MÉTRICAS DISPONÍVEIS:
{METRICAS_BACKEND}

DIAGNÓSTICO POR ELEMENTO:

Order Bump:
- Take rate: saudável > 15% | OK 5-15% | problema < 5%
- Impacto no ticket médio: saudável > 20% | OK 8-20% | problema < 8%

Upsell Imediato:
- Take rate: saudável > 20% | OK 8-20% | problema < 8%

UP1:
- Take rate: saudável > 12% | OK 5-12% | problema < 5%

Downsell:
- Take rate: saudável > 25% | OK 10-25% | problema < 10%

Backredirect:
- Take rate: saudável > 10% | OK 3-10% | problema < 3%

ENTREGUE:

1. MAPA DA ESTEIRA — o que existe vs. o que falta
2. DIAGNÓSTICO POR ELEMENTO — semáforo 🔴🟡🟢 + razão do problema
3. GARGALO PRINCIPAL — qual elemento está travando mais receita
4. VERIFICAÇÃO DE CONGRUÊNCIA — cada oferta parte da dor instalada pelo front-end?
5. AVISO PIX — o link de upsell está sendo entregue por WhatsApp/e-mail após confirmação? (crítico no BR)

ENTREGA FINAL:
🔴 PROBLEMA CRÍTICO — o que resolver agora (em ordem de impacto)
🟡 PONTOS DE ATENÇÃO
🟢 O QUE ESTÁ FUNCIONANDO
🎯 AÇÃO #1 — a mais impactante e executável
📊 PROJEÇÃO — quanto o ticket médio pode crescer se corrigir o item #1

REGRA: Sempre diagnostique de cima para baixo — OB antes de UP, UP antes de DS.`,
    variables: [
      { key: "ESTEIRA", label: "Descreva sua esteira atual", placeholder: "Ex: OB R$19 (checklist) → UP1 R$67 (masterclass) → DS R$37", multiline: true },
      { key: "METRICAS_BACKEND", label: "Métricas disponíveis", placeholder: "Ex: OB take rate 8%, UP1 take rate 3%, ticket médio R$43...", multiline: true }
    ]
  },
  {
    id: "construir_esteira",
    icon: "🏗️",
    title: "Construir Esteira de Backend do Zero",
    desc: "Cria toda a estrutura de OB → UP → DS → BR com ofertas, copy e lógica de ticket",
    prompt: `Você é um estrategista de esteiras de backend de tráfego direto.

Vou construir minha esteira do zero. Conduza a construção em etapas sequenciais.

FRONT-END:
- Produto: {PRODUTO_FRONTEND}
- Mecanismo único: {MECANISMO}
- Promessa principal: {PROMESSA}
- Ticket: R$ {TICKET_FRONTEND}
- Público: {PUBLICO}

ETAPA 1 — EXTRAÇÃO DE DORES
Com base no front-end acima, mapeie:
- 5 dores PRESENTES (que o comprador tem AGORA, antes de qualquer resultado)
- 3 dores FUTURAS (que vão aparecer depois que o produto resolver o primeiro problema)
- Linguagem exata que o público usa para descrever essas dores

ETAPA 2 — 5 IDEIAS DE ORDER BUMP
Para cada dor presente, crie uma oferta de OB com os 6 campos:
1. Nome: [Tipo de entrega] + [resultado] + [para quem / em quanto tempo]
2. Dor que ataca: qual das 5 dores
3. Transformação: De [estado atual] → Para [estado desejado]
4. Mecanismo único: o que diferencia
5. Formato: checklist / template / planilha / mini-aula (mínimo esforço pro comprador)
6. Faixa de preço: R$9–67

Filtro das melhores — 4 critérios:
✅ Congruência com o front-end
✅ Dor presente (não futura)
✅ Produção em menos de 3 dias
✅ Esforço mínimo para o comprador

ETAPA 3 — ESTRUTURA DA ESTEIRA COMPLETA
Mapeie os elementos em sequência:
OB → Upsell Imediato (pós-pagamento) → UP1 + DS1 + DS2 → UP2 + DS1 + DS2 → Backredirect → Formulário de Matrícula

Para cada elemento: nome da oferta, dor que ataca, ticket sugerido, take rate esperado

REFERÊNCIA DE TICKET:
- Order Bump: R$9–67
- Upsell Imediato: 30–50% do front-end
- UP1: validado por teste
- DS1 do UP1: 50–60% do UP1
- Backredirect: R$9–27

ETAPA 4 — AVISO CRÍTICO PARA MERCADO BR
Quem paga por Pix frequentemente não retorna para ver o upsell. Indique quais etapas precisam ter link entregue por WhatsApp/e-mail imediatamente após confirmação do pagamento.

ENTREGUE:
📋 Mapa completo da esteira com tickets e take rates esperados
💰 Projeção de ticket médio com esteira completa vs. só front-end
🎯 Qual OB testar primeiro e por quê`,
    variables: [
      { key: "PRODUTO_FRONTEND", label: "Produto do front-end", placeholder: "Ex: Código das Janelas de Ouro — método de sono para bebês" },
      { key: "MECANISMO", label: "Mecanismo único", placeholder: "Ex: Janela de Ouro — sincronização com ritmo circadiano do bebê" },
      { key: "PROMESSA", label: "Promessa principal", placeholder: "Ex: Bebê dormindo sozinho em dias, sem choro" },
      { key: "TICKET_FRONTEND", label: "Ticket do front-end (R$)", placeholder: "27" },
      { key: "PUBLICO", label: "Público-alvo", placeholder: "Ex: Mães com bebês 0-24 meses, exaustas com despertares noturnos" }
    ]
  },
  {
    id: "copy_upsell",
    icon: "✍️",
    title: "Gerar Copy de Upsell (11 Blocos)",
    desc: "Escreve o roteiro completo do vídeo de upsell com a sequência psicológica dos 11 blocos",
    prompt: `Você é um copywriter de direct response especializado em upsell de alta conversão.

Escreva a copy completa de um vídeo de upsell usando os 11 blocos na sequência psicológica obrigatória.

DADOS DA OFERTA:
- Produto principal (front-end): {FRONTEND}
- Oferta do upsell: {OFERTA_UP}
- Dor que ataca: {DOR}
- Transformação: De {DE} → Para {PARA}
- Mecanismo único: {MECANISMO_UP}
- Ticket: R$ {TICKET_UP}
- Âncora de preço (valor total do stack): R$ {ANCORA}
- Público: {PUBLICO}
- Provas sociais disponíveis: {PROVAS}

ROTEIRO — 11 BLOCOS EM SEQUÊNCIA OBRIGATÓRIA:

BLOCO 01 — Padrão de Interrupção + Ancoragem de Medo
(0–15s · para antes de sair · NÃO revela que é oferta)

BLOCO 02 — Validação + Incompletude
(alivia ansiedade · planta gap · "você fez certo, mas...")

BLOCO 03 — Curiosity Gap + Promessa Emocional
(tensão máxima antes do reveal · não resolve ainda)

BLOCO 04 — Micro-Compromisso
(pequeno "sim" que cria momentum → "você concorda que...")

BLOCO 05 — Reframe Filosófico
(eleva acima do funcional · conecta com identidade da pessoa)

BLOCO 06 — Frame de Tribo + Permissão
(remove julgamento · "pessoas como você...")

BLOCO 07 — Prova Social — Transformação
(2 histórias reais: antes específico + resultado com número)

BLOCO 08 — Value Stacking
(cada entregável + título + promessa + valor ancorado individualmente)

BLOCO 09 — Ancoragem de Preço
(3 etapas: stack total → corte → reveal do preço real)

BLOCO 10 — Prova Social — Objeção Específica
(ataca a dúvida residual mais comum desse público)

BLOCO 11 — Escassez Final + CTA
(urgência real · preço · botão de "não" discreto abaixo)

REGRA CRÍTICA BLOCOS 01–03: NÃO começar com pitch. Os primeiros 3 blocos existem para aliviar ansiedade — qualquer sinal de venda nos primeiros segundos ativa resistência.

TAMBÉM ENTREGUE:
- Texto da thumbnail do vídeo (nunca autoplay — escreva: "Bem-vindo, novo membro" ou "Veja como acessar seu produto")
- Pré-headline de alívio de ansiedade (antes do vídeo · não é pitch)
- Headline para assistir o vídeo (não revela a oferta)
- Copy abaixo do vídeo (reforço para assistir)
- Texto do botão de CTA + texto do botão de "não" (discreto)

Tom: direto. Sem firula. Vocabulário do público: {VOCABULARIO}
Responda em português brasileiro nativo.`,
    variables: [
      { key: "FRONTEND", label: "Produto do front-end", placeholder: "Ex: Código das Janelas de Ouro" },
      { key: "OFERTA_UP", label: "Oferta do upsell", placeholder: "Ex: Protocolo de Emergência — 7 rituais para noites de caos" },
      { key: "DOR", label: "Dor que ataca", placeholder: "Ex: As noites caóticas que o método padrão não cobre" },
      { key: "DE", label: "Estado atual (De)", placeholder: "Ex: acordando em pânico sem saber o que fazer" },
      { key: "PARA", label: "Estado desejado (Para)", placeholder: "Ex: tendo um protocolo exato para qualquer situação" },
      { key: "MECANISMO_UP", label: "Mecanismo único", placeholder: "Ex: Janela de Cortisol de Emergência" },
      { key: "TICKET_UP", label: "Ticket do upsell (R$)", placeholder: "37" },
      { key: "ANCORA", label: "Âncora de preço (R$)", placeholder: "197" },
      { key: "PUBLICO", label: "Público", placeholder: "Ex: mãe exausta, bebê 4-12 meses, já comprou o método principal" },
      { key: "PROVAS", label: "Provas sociais disponíveis", placeholder: "Ex: depoimentos de mães que usaram em emergências..." },
      { key: "VOCABULARIO", label: "Vocabulário do nicho", placeholder: "Ex: janela, cortisol, madrugada, choro, colo, ritual..." }
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
  },
  {
    id: "metricas_secretas",
    icon: "🎯",
    title: "Métricas Secretas — Diagnóstico de Criativo",
    desc: "Cole os dados brutos do Meta e receba diagnóstico exato: qual parte do criativo está quebrando e qual elemento iterar",
    prompt: `Você é especialista em diagnóstico de criativos de vídeo usando as 5 métricas secretas do tráfego direto.

DADOS DO CRIATIVO:
- Impressões: {IMPRESSOES}
- Reproduções de Vídeo: {REPRODUCOES}
- ThruPlays 3s: {THRUPLAY_3S}
- ThruPlays 75%: {THRUPLAY_75}
- Cliques no Link: {CLIQUES}
- Compras: {COMPRAS}
- Investimento: R$ {INVESTIMENTO}

PASSO 1 — CALCULE AS 5 MÉTRICAS SECRETAS:

1. PLAY RATE DO HOOK = Reproduções / Impressões × 100
   Benchmark: > 30% = hook visual funcionando

2. RETENÇÃO DO HOOK = ThruPlays 3s / Reproduções × 100
   Benchmark: > 20% = hook copy retendo

3. RETENÇÃO DO BODY = ThruPlays 75% / Reproduções × 100
   Benchmark: compare com seus criativos vencedores

4. CONVERSÃO DO BODY = Compras / ThruPlays 75% × 100
   Benchmark: a mais importante — compare historicamente

5. MEDIDOR DE CTA = Cliques / ThruPlays 75% × 100
   Benchmark: > 30% = CTA funcionando

PASSO 2 — IDENTIFIQUE O CENÁRIO:

CENÁRIO 1 — Hook bom, Body ruim
Play Rate > 30% + Ret. Hook > 20%, mas Ret. Body abaixo do benchmark
→ Manter o hook intacto. Testar 3 variações de body com ângulos diferentes.

CENÁRIO 2 — Hook ruim, Body bom
Play Rate < 30%, mas quem fica converte bem (CTA e Conversão do Body altos)
→ Manter o body. Criar 5 variações de hook visual (cor, movimento, rosto, texto).

CENÁRIO 3 — Tudo bom, CTA fraco
Play Rate e Retenções ok, mas Medidor de CTA < 30%
→ Não refazer o criativo. Testar 3 variações de CTA: com prazo, com escassez, com benefício específico.

CENÁRIO 4 — Tudo ruim
Todas as métricas abaixo dos benchmarks
→ Pausar. Criar criativo novo do zero com nova hipótese de ângulo.

PASSO 3 — ENTREGUE:

📊 TABELA das 5 métricas calculadas:
| Métrica | Fórmula | Resultado | Benchmark | Status 🔴🟡🟢 |

🎯 CENÁRIO IDENTIFICADO: [1 / 2 / 3 / 4]
❌ DECISÃO ERRADA que a maioria tomaria
✅ DECISÃO CERTA para este criativo
🔧 AÇÃO ESPECÍFICA: o que exatamente criar na próxima iteração
💰 CPA atual e projeção de CPA se corrigir o elemento identificado`,
    variables: [
      { key: "IMPRESSOES", label: "Impressões", placeholder: "10000" },
      { key: "REPRODUCOES", label: "Reproduções de Vídeo", placeholder: "3500" },
      { key: "THRUPLAY_3S", label: "ThruPlays 3s", placeholder: "1200" },
      { key: "THRUPLAY_75", label: "ThruPlays 75%", placeholder: "280" },
      { key: "CLIQUES", label: "Cliques no Link", placeholder: "95" },
      { key: "COMPRAS", label: "Compras", placeholder: "2" },
      { key: "INVESTIMENTO", label: "Investimento (R$)", placeholder: "54" }
    ]
  },
  {
    id: "sinais_colapso",
    icon: "⚠️",
    title: "Diagnóstico de Sinais de Colapso",
    desc: "Cole as métricas do dia e receba diagnóstico preventivo: quais sinais estão ativos e ações em ordem de prioridade",
    prompt: `Você é especialista em diagnóstico preventivo de campanhas de tráfego direto.

Analise as métricas abaixo e identifique quais dos 11 sinais de colapso estão ativos — 24 a 48h antes de uma campanha colapsar.

MÉTRICAS DO DIA:
- Impressões: {IMPRESSOES}
- Reproduções de Vídeo: {REPRODUCOES}
- ThruPlays 3s: {THRUPLAY_3S}
- ThruPlays 75%: {THRUPLAY_75}
- Cliques no Link: {CLIQUES}
- Compras: {COMPRAS}
- Gasto total: R$ {GASTO}
- Receita total: R$ {RECEITA}
- Alcance: {ALCANCE}
- CPM: R$ {CPM}
- Dias sem mudança de criativo: {DIAS_CRIATIVO}

CALCULE E VERIFIQUE OS 11 SINAIS:

FUNIL SUPERIOR (Tráfego):
01. Play Rate do Hook = Reproduções ÷ Impressões × 100 → benchmark > 30%
02. Retenção do Hook = ThruPlays 3s ÷ Reproduções × 100 → benchmark > 20%
03. CTR = Cliques ÷ Impressões × 100 → queda progressiva 2 dias = sinal
04. CPM subindo sem aumento de gasto → comparar com histórico

FUNIL INFERIOR (Conversão):
05. Retenção do Body = ThruPlays 75% ÷ Reproduções × 100 → abaixo do histórico = sinal
06. Conversão do Body = Compras ÷ ThruPlays 75% × 100 → abaixo do padrão = sinal
07. Medidor de CTA = Cliques ÷ ThruPlays 75% × 100 → benchmark > 30%

ESTRUTURA E ESCALA:
08. CPA = Gasto ÷ Compras → subindo por 2 dias consecutivos = sinal
09. ROAS = Receita ÷ Gasto → abaixo de 1.0 por 48h = crítico
10. Campanha zerada = Compras = 0 em campanha ativa > 24h
11. Frequência = Impressões ÷ Alcance → > 3× em 7 dias = atenção / > 5× = pausar

CLASSIFIQUE CADA SINAL ATIVO:
🔴 CRÍTICO — ação imediata (ROAS < 1 / CPA acima do máximo / campanha zerada)
🟡 ALERTA — ação nas próximas 24h (deterioração de métricas de funil)
🟢 MONITORAMENTO — acompanhar mais um ciclo (frequência moderada)

ENTREGUE:

📊 SINAIS ATIVOS (apenas os que estão fora do padrão):
| # | Sinal | Resultado | Status |

🔴 AÇÕES CRÍTICAS (fazer agora):
🟡 AÇÕES DE ALERTA (fazer nas próximas 24h):
🟢 MONITORAR:

🛡️ O QUE NÃO MEXER (métricas que estão boas — não toque nelas)

🎯 PRIORIDADE #1: a ação mais impactante para estabilizar a campanha hoje`,
    variables: [
      { key: "IMPRESSOES", label: "Impressões", placeholder: "15000" },
      { key: "REPRODUCOES", label: "Reproduções de Vídeo", placeholder: "4200" },
      { key: "THRUPLAY_3S", label: "ThruPlays 3s", placeholder: "1100" },
      { key: "THRUPLAY_75", label: "ThruPlays 75%", placeholder: "220" },
      { key: "CLIQUES", label: "Cliques no Link", placeholder: "80" },
      { key: "COMPRAS", label: "Compras", placeholder: "1" },
      { key: "GASTO", label: "Gasto total (R$)", placeholder: "108" },
      { key: "RECEITA", label: "Receita total (R$)", placeholder: "27" },
      { key: "ALCANCE", label: "Alcance", placeholder: "12000" },
      { key: "CPM", label: "CPM (R$)", placeholder: "7.20" },
      { key: "DIAS_CRIATIVO", label: "Dias sem troca de criativo", placeholder: "5" }
    ]
  },
  {
    id: "estrutura_criativo",
    icon: "🎬",
    title: "Estrutura H/B/C por Operação",
    desc: "Informe o tipo de operação e as métricas — diagnóstico preciso de qual parte do criativo (Hook/Body/CTA) está quebrando e a iteração exata",
    prompt: `Você é especialista em estrutura de criativos de vídeo para tráfego direto.

TIPO DE OPERAÇÃO: {OPERACAO}
(Drop 8-20s / Nutra 45-90s / Info 60-180s / X1-WhatsApp 60-120s)

MÉTRICAS CALCULADAS:
- Play Rate do Hook (Reproduções ÷ Impressões × 100): {PLAY_RATE}%
- Retenção do Hook (ThruPlays 3s ÷ Reproduções × 100): {RET_HOOK}%
- Retenção do Body (ThruPlays 75% ÷ Reproduções × 100): {RET_BODY}%
- Medidor de CTA (Cliques ÷ ThruPlays 75% × 100): {MEDIDOR_CTA}%
- Conversão do Body (Compras ÷ ThruPlays 75% × 100): {CONV_BODY}%

ESTRUTURA H/B/C POR OPERAÇÃO (referência):

DROP (8–20s):
H (0–3s) = Interrupção visual + problema imediato. Sem apresentação.
B (3–12s) = 1 benefício central + 1 prova rápida (número ou depoimento).
C (12–20s) = Urgência + link. "Clique agora, oferta acaba em X."

NUTRA (45–90s):
H (0–8s) = Dado ou descoberta surpreendente do nicho.
B (8–70s) = Mecanismo único com autoridade. 2–3 provas intercaladas.
C (70–90s) = Escassez real + benefício resumido + CTA específico.

INFO (60–180s):
H (0–10s) = Pergunta-dor + contradição ("Por que X inteligente ainda tem Y?").
B (10–150s) = 3 partes: ampliar dor com dados → revelar mecanismo → provas + stack.
C (150–180s) = Ancoragem de preço + urgência + CTA direto ao checkout.

X1/WHATSAPP (60–120s):
H (0–8s) = Dor específica + promessa de solução personalizada.
B (8–90s) = História de transformação UGC — NÃO revela o método completo.
C (90–120s) = CTA para conversa/grupo/método exclusivo. IC é a conversão.

DIAGNÓSTICO:

1. Qual parte do H/B/C está quebrando?
   - Play Rate < 30% → problema no H visual
   - Ret. Hook < 20% → problema no H copy (argumentos iniciais)
   - Ret. Body abaixo do histórico → problema no B (formato, edição, avatar)
   - Conv. Body baixa → argumento central do B não fecha
   - Medidor CTA < 30% → problema no C (falta urgência/FOMO)

2. Qual a causa raiz ESPECÍFICA para esse tipo de operação?
   (Ex: Drop com Play Rate baixo = thumbnail fraca; Info com Body baixo = edição monótona sem cortes rítmicos)

3. Qual iteração específica fazer?
   (Não "testar novo criativo" — qual elemento exato mudar, como mudar)

4. DICA ANDROMEDA:
   O Facebook usa transcrição de áudio para segmentar audiência. Baseado no tipo de operação, como otimizar o áudio dos primeiros 5s para ativar exatamente o público certo?

ENTREGUE:
🔴 Elemento quebrando: [H / B / C] — parte exata
🔧 Causa raiz: para este tipo de operação
✅ Iteração certa: o que mudar especificamente
⚡ Quick win: ação mais rápida para implementar hoje
🎙️ Dica Andromeda: como otimizar o áudio dos primeiros 5s`,
    variables: [
      { key: "OPERACAO", label: "Tipo de operação", placeholder: "Drop / Nutra / Info / X1" },
      { key: "PLAY_RATE", label: "Play Rate do Hook (%)", placeholder: "25" },
      { key: "RET_HOOK", label: "Retenção do Hook (%)", placeholder: "18" },
      { key: "RET_BODY", label: "Retenção do Body (%)", placeholder: "8" },
      { key: "MEDIDOR_CTA", label: "Medidor de CTA (%)", placeholder: "22" },
      { key: "CONV_BODY", label: "Conversão do Body (%)", placeholder: "1.2" }
    ]
  },
  {
    id: "estudo_publico",
    icon: "👤",
    title: "Estudo de Público — Avatar Profundo",
    desc: "Gera avatar completo em 6 partes: demografia, dores, desejos, crenças, gatilhos e posicionamento de criativo",
    prompt: `Você é um estrategista de marketing direto especializado em psicologia do consumidor.

Preciso de um estudo de avatar completo para o seguinte público e produto:

PRODUTO: {PRODUTO}
NICHO: {NICHO}
PÚBLICO BASE: {PUBLICO}

Execute o estudo em 6 partes:

PARTE 1 — DEMOGRAFIA E CONTEXTO
- Faixa etária predominante e distribuição por gênero
- Estado civil e momento de vida típico
- Nível de renda e escolaridade
- Rotina diária no momento em que o problema aparece

PARTE 2 — DORES E FRUSTRAÇÕES
- 5 dores presentes (problemas que têm AGORA, antes de qualquer resultado)
- 3 dores futuras (vão aparecer depois que o produto resolver o primeiro problema)
- O que essa pessoa pensa ao acordar de madrugada com o problema
- Linguagem exata que usaria para descrever o problema (sem jargão técnico — as palavras reais dela)

PARTE 3 — DESEJOS E SONHOS
- O resultado que mais quer (emocional, não funcional)
- O que não quer admitir que deseja mas deseja
- Como seria o "dia perfeito" após resolver o problema
- O que mostraria para amigos como prova de sucesso

PARTE 4 — CRENÇAS E BLOQUEIOS
- Por que ainda não resolveu (crença limitante #1)
- O que já tentou que não funcionou e o que acha disso
- A objeção mais comum que impede a compra
- Por que desconfia de soluções online para esse problema

PARTE 5 — GATILHOS E VOCABULÁRIO
- 10 palavras/frases que ativam atenção imediata (usar no hook)
- 5 frases que criam rejeição instantânea (evitar em todo criativo)
- Referências culturais relevantes (programas, situações, celebridades)
- Tom de voz que gera confiança vs. o que gera resistência

PARTE 6 — DIRETRIZES DE CRIATIVO
- Qual formato ressoa mais com esse avatar e por quê
- Qual ângulo de hook tem maior potencial (dor, curiosidade, identidade)
- Qual prova social convence mais (número/resultado, depoimento de par, autoridade)
- Qual CTA ativa sem gerar resistência

Responda em português brasileiro nativo. Use a linguagem do público — não acadêmica.`,
    variables: [
      { key: "PRODUTO", label: "Produto", placeholder: "Ex: Código das Janelas de Ouro — método de sono para bebês" },
      { key: "NICHO", label: "Nicho", placeholder: "Ex: sono infantil / maternidade" },
      { key: "PUBLICO", label: "Público base", placeholder: "Ex: mães com bebês 0–24 meses, exaustas com despertares noturnos" }
    ]
  },
  {
    id: "auditor_criativos",
    icon: "🔬",
    title: "Auditor de Criativos — Método Megaclass",
    desc: "Analisa um criativo em 6 seções com scorecard, identifica o elemento que está quebrando e entrega o plano de iteração",
    prompt: `Você é um auditor de criativos de performance usando o Método Megaclass.

Analise o criativo abaixo em 6 seções. Seja brutal e específico — diagnósticos vagos são inúteis.

CRIATIVO PARA ANÁLISE:
{CRIATIVO}

(Cole: transcrição do vídeo ou descrição detalhada do visual + texto + métricas disponíveis + tipo de produto)

SEÇÃO 1 — DIAGNÓSTICO DO HOOK (primeiros 3–8s)
- O hook quebra o scroll ou é previsível?
- Ataca uma dor específica ou é genérico?
- Tem os 3 elementos do hook eficaz: interrupção + curiosidade + relevância?
- Nota de 1 a 10 — justificada.
→ Veredicto: 🔴 Refazer / 🟡 Iterar / 🟢 Manter

SEÇÃO 2 — DIAGNÓSTICO DO BODY
- O mecanismo único está claro e é crível?
- As provas sociais têm especificidade (número, nome, contexto) ou são genéricas?
- O avatar se reconhece? É um criativo "para alguém como eu"?
- A edição mantém ritmo ou tem momentos de queda de atenção?
→ Veredicto: 🔴 Refazer / 🟡 Iterar / 🟢 Manter

SEÇÃO 3 — DIAGNÓSTICO DO CTA
- O CTA tem urgência real ou é fabricada e óbvia?
- Especifica o que acontece ao clicar?
- Tem fricção desnecessária entre o clique e a compra?
→ Veredicto: 🔴 Refazer / 🟡 Iterar / 🟢 Manter

SEÇÃO 4 — ALINHAMENTO CRIATIVO-OFERTA
- A promessa do criativo é entregue na landing page?
- O nível de consciência do avatar está correto para esse criativo?
- Existe salto entre o que o criativo promete e o que a página entrega?
→ Veredicto: 🔴 Desalinhado / 🟡 Ajuste necessário / 🟢 Alinhado

SEÇÃO 5 — DIAGNÓSTICO ANDROMEDA
Facebook usa transcrição de áudio para segmentar audiência:
- O áudio dos primeiros 5s menciona o problema central com as palavras do avatar?
- O texto em tela nos primeiros 3s reforça a segmentação?
- Risco de entregar para audiência errada por vocabulário genérico?
→ Veredicto: 🔴 Risco alto / 🟡 Ajuste recomendado / 🟢 Otimizado

SEÇÃO 6 — PLANO DE ITERAÇÃO
1. Qual é o elemento #1 travando a performance?
2. Qual iteração específica fazer PRIMEIRO (menor esforço, maior impacto)?
3. Qual iteração fazer na sequência?
4. O criativo tem potencial de escala se corrigir o problema?

ENTREGUE:
📊 Scorecard: nota 1–10 por seção + nota geral
🔴 Problema crítico: [elemento específico]
🔧 Iteração #1: [ação exata com detalhes de execução]
📈 Potencial de escala: Sim / Não / Talvez — com justificativa`,
    variables: [
      { key: "CRIATIVO", label: "Descrição do criativo", placeholder: "Cole aqui: transcrição do vídeo, descrição do visual, métricas disponíveis, tipo de produto...", multiline: true }
    ]
  },
  {
    id: "decodificador_ads",
    icon: "🔓",
    title: "Decodificador de Ads V33.0",
    desc: "Decodifica em 7 camadas um criativo de concorrente escalando — extrai o padrão psicológico e entrega briefing para modelar sem copiar",
    prompt: `Você é um decodificador de anúncios de tráfego direto — Versão 33.0.

Missão: decodificar o padrão de sucesso de um anúncio escalando, identificar o que funciona em termos de estrutura psicológica, e gerar um briefing para modelar (não copiar).

ANÚNCIO PARA DECODIFICAR:
{ANUNCIO}

(Cole: transcrição do vídeo ou descrição detalhada + link se disponível + métricas se tiver)

DECODIFICAÇÃO EM 7 CAMADAS:

CAMADA 1 — PADRÃO DE INTERRUPÇÃO
- Qual mecanismo visual quebra o scroll?
- É movimento, contraste, rosto, texto, surpresa ou sons específicos?
- Qual emoção é ativada nos primeiros 2s?

CAMADA 2 — ESTRUTURA PSICOLÓGICA DO HOOK
- Qual gatilho primário? (medo, curiosidade, identidade, inveja, pertencimento)
- A dor é amplificada ou a solução é antecipada?
- Qual pergunta implícita o hook planta na cabeça do espectador?

CAMADA 3 — MECANISMO DE CRENÇA DO BODY
- Qual crença precisa ser instalada para a venda acontecer?
- Como o body constrói essa crença progressivamente?
- Qual tipo de prova é usada? (número, autoridade, par, antes/depois)

CAMADA 4 — PADRÃO DE COPY
- Qual framework de copy está sendo usado? (AIDA, PAS, Story-Agitate-Solve, etc.)
- Qual é a promessa central em 1 frase?
- O mecanismo único é apresentado com ou sem jargão técnico?

CAMADA 5 — PERFIL DO AVATAR IMPLÍCITO
- Para quem EXATAMENTE esse criativo foi feito?
- Qual nível de consciência do avatar o criativo assume?
- Qual linguagem, vocabulário e referências culturais está usando?

CAMADA 6 — ESTRUTURA DE CONVERSÃO
- O que está sendo vendido (produto / transformação / identidade)?
- Como o CTA cria urgência específica para esse avatar?
- Existe ancoragem de preço ou escassez?

CAMADA 7 — BRIEFING DE MODELAGEM
Com base nos 6 padrões acima, crie briefing para novo criativo:

BRIEFING:
- Hook: [estrutura sem copiar o conteúdo]
- Ângulo: [qual dor/desejo atacar no seu nicho]
- Mecanismo único: [o que diferenciar — não o mesmo do concorrente]
- Prova central: [qual tipo de prova usar]
- CTA: [estrutura do call to action]
- Formato: [duração, estilo, referência visual]

AVISOS:
⚠️ O que NÃO fazer (evitar plágio detectável pelo Meta)
✅ O que ADAPTAR para seu nicho/produto
🎯 Por que esse padrão está funcionando — a psicologia real por trás`,
    variables: [
      { key: "ANUNCIO", label: "Anúncio para decodificar", placeholder: "Cole aqui a transcrição ou descrição detalhada do criativo do concorrente...", multiline: true }
    ]
  },
  {
    id: "meta_prompt_architect",
    icon: "🏗️",
    title: "Meta-Prompt Architect V18.0",
    desc: "Injeta o contexto completo do seu negócio em JSON — a IA vira especialista do seu produto antes de qualquer tarefa de copy ou diagnóstico",
    prompt: `Você é um arquiteto de prompts especializado em tráfego direto.

Vou te fornecer um KNOWLEDGE BLOCK em JSON com todo o contexto do meu negócio. Após processar, você se tornará especialista nesse produto específico e responderá qualquer pergunta de marketing com precisão cirúrgica.

INSTRUÇÃO: Processe o JSON abaixo. Confirme o que entendeu em cada campo (1 linha cada). Depois aguarde minha tarefa específica.

\`\`\`json
{
  "produto": {
    "nome": "{PRODUTO_NOME}",
    "mecanismo_unico": "{MECANISMO}",
    "promessa_central": "{PROMESSA}",
    "ticket": "R$ {TICKET}",
    "formato_entrega": "{FORMATO}"
  },
  "avatar": {
    "perfil": "{AVATAR_PERFIL}",
    "dor_central": "{DOR_CENTRAL}",
    "dores_secundarias": "{DORES_SEC}",
    "desejo_principal": "{DESEJO}",
    "vocabulario": "{VOCABULARIO}",
    "objecao_principal": "{OBJECAO}"
  },
  "campanha": {
    "fase_atual": "{FASE}",
    "criativos_ativos": "{CRIATIVOS}",
    "melhor_performance": "{MELHOR}",
    "meta_cpa": "R$ {META_CPA}",
    "orcamento_diario": "R$ {ORCAMENTO}"
  },
  "historico": {
    "o_que_funcionou": "{FUNCIONOU}",
    "o_que_nao_funcionou": "{NAO_FUNCIONOU}",
    "hipoteses_ativas": "{HIPOTESES}"
  }
}
\`\`\`

APÓS PROCESSAR:
1. Confirme cada campo em 1 linha
2. Identifique as 3 maiores oportunidades baseado no contexto
3. Aguarde minha tarefa (criar criativo / diagnosticar métricas / gerar copy / etc.)

Responda em português brasileiro.`,
    variables: [
      { key: "PRODUTO_NOME", label: "Nome do produto", placeholder: "Ex: Código das Janelas de Ouro" },
      { key: "MECANISMO", label: "Mecanismo único", placeholder: "Ex: Janela de Ouro — sincronização com ritmo circadiano do bebê" },
      { key: "PROMESSA", label: "Promessa central", placeholder: "Ex: Bebê dormindo sozinho em dias, sem choro" },
      { key: "TICKET", label: "Ticket (R$)", placeholder: "37" },
      { key: "FORMATO", label: "Formato de entrega", placeholder: "Ex: eBook PDF + área de membros" },
      { key: "AVATAR_PERFIL", label: "Perfil do avatar", placeholder: "Ex: mãe 25-35 anos, bebê 0-18 meses, exausta com despertares noturnos" },
      { key: "DOR_CENTRAL", label: "Dor central", placeholder: "Ex: acorda 3-4x por noite e não sabe mais o que fazer" },
      { key: "DORES_SEC", label: "Dores secundárias", placeholder: "Ex: relacionamento afetado, produtividade zero, culpa por deixar chorar" },
      { key: "DESEJO", label: "Desejo principal", placeholder: "Ex: dormir uma noite inteira sem culpa" },
      { key: "VOCABULARIO", label: "Vocabulário do nicho", placeholder: "Ex: janela, cortisol, despertares, sono consolidado, método, madrugada" },
      { key: "OBJECAO", label: "Objeção principal", placeholder: "Ex: já tentei de tudo e nada funciona" },
      { key: "FASE", label: "Fase da campanha", placeholder: "Ex: testando criativos, orçamento R$27/conjunto" },
      { key: "CRIATIVOS", label: "Criativos ativos", placeholder: "Ex: 3 vídeos UGC + 2 imagens carrossel" },
      { key: "MELHOR", label: "Melhor performance", placeholder: "Ex: V2 Stories — CTR 4.39%, 2 vendas" },
      { key: "META_CPA", label: "Meta de CPA (R$)", placeholder: "27" },
      { key: "ORCAMENTO", label: "Orçamento diário (R$)", placeholder: "108" },
      { key: "FUNCIONOU", label: "O que funcionou", placeholder: "Ex: hook bebê dormindo, CTR acima de 2%, público feminino 25-44" },
      { key: "NAO_FUNCIONOU", label: "O que não funcionou", placeholder: "Ex: hooks genéricos de saúde, público masculino, VSL longa" },
      { key: "HIPOTESES", label: "Hipóteses ativas", placeholder: "Ex: testar hook com mãe mostrando frustração real, UGC converte mais que câmera profissional" }
    ]
  },
  {
    id: "diagnostico_posicao",
    icon: "🗺️",
    title: "Diagnóstico de Posição — Ponto A ou B",
    desc: "Responda sobre sua campanha — a IA determina se o problema é de criativo (Ponto A) ou estrutura (Ponto B) e entrega a rota exata",
    prompt: `Você é especialista em diagnóstico de operações de tráfego direto.

Vou responder 5 perguntas sobre minha campanha. Determine se estou no PONTO A (problema de criativo) ou PONTO B (problema de estrutura) e entregue a rota correta.

ESTADO ATUAL DA CAMPANHA:
- Produto: {PRODUTO}
- Ticket: R$ {TICKET}
- CPA alvo: R$ {CPA_ALVO}
- CPA realizado: R$ {CPA_REALIZADO}
- Estrutura atual: {ESTRUTURA} (ex: CBO, ABO, híbrido)
- Gasto mensal atual: R$ {GASTO_MENSAL}
- Objetivo: R$ {OBJETIVO_MENSAL}/mês

RESPOSTAS ÀS 5 PERGUNTAS DE DIAGNÓSTICO:

1. Já teve algum criativo com 2+ vendas em 2 dias? {P1}
2. Quando escalou o orçamento, o CPA subiu imediatamente? {P2}
3. Está usando 100% CBO sem estrutura ABO paralela? {P3}
4. Quantos dias de estabilidade de ROAS espera antes de escalar? {P4}
5. Quando a campanha trava, troca criativo ou analisa estrutura primeiro? {P5}

MÉTRICAS DOS ÚLTIMOS 7 DIAS:
- Play Rate do Hook: {PLAY_RATE}%
- Retenção do Hook: {RET_HOOK}%
- Conversão do Body: {CONV_BODY}%
- ROAS médio: {ROAS}×
- Vida média do criativo antes de cair: {VIDA_CRIATIVO} dias

DIAGNÓSTICO:

PONTO A — Problema de criativo:
Sinal: métricas de criativo abaixo do padrão (Play Rate < 30%, Ret. Hook < 20%, Conv. Body baixa)
Rota: iterar o elemento específico que está quebrando (não trocar o criativo inteiro)

PONTO B — Problema de estrutura:
Sinal: métricas de criativo OK mas CPA não atinge o alvo ou não escala
Rota: reconstruir o ecossistema ABO → CBO com teste de estrutura correto

ENTREGUE:

📍 POSIÇÃO IDENTIFICADA: Ponto A ou B — com justificativa baseada nos dados

🗺️ ROTA CORRETA:
Se Ponto A → qual elemento iterar (H, B ou C) e como
Se Ponto B → sequência exata de reconstrução da estrutura

📋 PRÓXIMAS 3 AÇÕES em ordem de prioridade

⚠️ ERRO MAIS PROVÁVEL que eu cometeria sem esse diagnóstico

📊 PROJEÇÃO: em quanto tempo e com qual estrutura posso atingir R$ {OBJETIVO_MENSAL}/mês`,
    variables: [
      { key: "PRODUTO", label: "Produto", placeholder: "Ex: Código das Janelas de Ouro" },
      { key: "TICKET", label: "Ticket (R$)", placeholder: "37" },
      { key: "CPA_ALVO", label: "CPA alvo (R$)", placeholder: "20" },
      { key: "CPA_REALIZADO", label: "CPA realizado (R$)", placeholder: "38" },
      { key: "ESTRUTURA", label: "Estrutura atual", placeholder: "Ex: 100% CBO / ABO+CBO / só ABO" },
      { key: "GASTO_MENSAL", label: "Gasto mensal atual (R$)", placeholder: "3200" },
      { key: "OBJETIVO_MENSAL", label: "Objetivo mensal (R$)", placeholder: "31000" },
      { key: "P1", label: "1. Criativo com 2+ vendas em 2 dias?", placeholder: "Sim / Não" },
      { key: "P2", label: "2. CPA subiu ao escalar?", placeholder: "Sim imediatamente / Sim depois / Não" },
      { key: "P3", label: "3. Usa 100% CBO sem ABO?", placeholder: "Sim / Não / Híbrido" },
      { key: "P4", label: "4. Dias de ROAS estável antes de escalar", placeholder: "Ex: 0 / 1 / 3 dias" },
      { key: "P5", label: "5. Quando trava: troca criativo ou analisa estrutura?", placeholder: "Troco criativo / Analiso estrutura" },
      { key: "PLAY_RATE", label: "Play Rate do Hook (%)", placeholder: "64" },
      { key: "RET_HOOK", label: "Retenção do Hook (%)", placeholder: "51" },
      { key: "CONV_BODY", label: "Conversão do Body (%)", placeholder: "2.1" },
      { key: "ROAS", label: "ROAS médio (×)", placeholder: "1.3" },
      { key: "VIDA_CRIATIVO", label: "Vida média do criativo (dias)", placeholder: "4" }
    ]
  },
  {
    id: "protocolo_escala",
    icon: "📈",
    title: "Protocolo de Escala — ABO → CBO",
    desc: "Cole as métricas e o estágio atual — a IA determina se pode escalar, o próximo aumento seguro e o timing correto",
    prompt: `Você é especialista em escala de campanhas de tráfego direto com o protocolo ABO → CBO.

ESTÁGIO ATUAL: {ESTAGIO}
(Teste de validação / ABO de escala / CBO em progressão / Ecossistema híbrido)

MÉTRICAS ATUAIS:
- Orçamento diário atual: R$ {ORCAMENTO_ATUAL}
- ROAS médio últimas 48h: {ROAS_48H}×
- ROAS médio últimos 7 dias: {ROAS_7D}×
- CPA atual: R$ {CPA_ATUAL}
- CPA alvo: R$ {CPA_ALVO}
- Dias com ROAS acima do mínimo consecutivos: {DIAS_ROAS}
- Estrutura atual: {ESTRUTURA}
- Última edição feita (quantos dias atrás): {ULTIMA_EDICAO}

PROTOCOLOS DE REFERÊNCIA:

TESTE DE VALIDAÇÃO (ABO):
- Orçamento por conjunto: 1/3 do CPA alvo
- Duração: 2 dias
- Critério de aprovação: 2 vendas em 2 dias em pelo menos 1 estrutura
- Se aprovado: avançar para ABO de escala

ABO DE ESCALA:
- Duplicar criativo validado 30× com orçamento fixo por conjunto
- Analisar após 24h: pausar conjuntos sem ROAS > 2.5×
- Manter apenas os conjuntos lucrativos
- Dobrar orçamento dos sobreviventes às 00h

CONSTRUÇÃO DO ECOSSISTEMA ABO → CBO:
- ABO rodando estável por 3 dias com ROAS > 2.5×
- Criar CBO com os mesmos criativos dos conjuntos ABO validados
- CBO distribui budget automaticamente para os melhores
- ABO + CBO rodando em paralelo = ecossistema completo

PROGRESSÃO DA CBO:
- Nunca aumentar mais de 30–50% de uma vez
- Aguardar ROAS estável por 48h antes de cada aumento
- Nenhuma outra edição durante a progressão (criativo, público, configuração)
- Se quiser acelerar: segunda CBO em conta separada, não dobrar a primeira

DIAGNÓSTICO E PRÓXIMOS PASSOS:

1. Está no estágio correto para o volume atual?
2. Pode escalar agora? Por que sim/não?
3. Se pode escalar: qual o próximo valor seguro e quando exatamente?
4. Se não pode escalar: o que precisa acontecer primeiro?
5. Qual o erro mais comum que eu cometeria sem esse diagnóstico?

ENTREGUE:
✅ PODE ESCALAR AGORA? Sim / Não / Aguardar X dias
📊 PRÓXIMO VALOR: R$ {PROXIMO} — quando fazer (data/hora ideal)
🗺️ ROTA COMPLETA até R$ {OBJETIVO}/dia
⚠️ REGRA CRÍTICA para esse estágio específico
🔄 PRÓXIMO CHECK: quando revisar as métricas novamente`,
    variables: [
      { key: "ESTAGIO", label: "Estágio atual", placeholder: "Ex: ABO de escala / CBO em progressão" },
      { key: "ORCAMENTO_ATUAL", label: "Orçamento diário atual (R$)", placeholder: "5000" },
      { key: "ROAS_48H", label: "ROAS últimas 48h (×)", placeholder: "3.9" },
      { key: "ROAS_7D", label: "ROAS últimos 7 dias (×)", placeholder: "3.4" },
      { key: "CPA_ATUAL", label: "CPA atual (R$)", placeholder: "50" },
      { key: "CPA_ALVO", label: "CPA alvo (R$)", placeholder: "30" },
      { key: "DIAS_ROAS", label: "Dias consecutivos com ROAS acima do mínimo", placeholder: "3" },
      { key: "ESTRUTURA", label: "Estrutura atual", placeholder: "Ex: CBO única / ABO+CBO / múltiplas CBOs" },
      { key: "ULTIMA_EDICAO", label: "Última edição (dias atrás)", placeholder: "Ex: 2 dias / 5 dias" },
      { key: "OBJETIVO", label: "Objetivo de gasto diário (R$)", placeholder: "22000" }
    ]
  },
  {
    id: "contingencia_protocolo",
    icon: "🛡️",
    title: "Protocolo de Contingência — BM/Conta Banida",
    desc: "Informe o tipo de problema — sequência exata para as próximas 6h, estimativa de retorno e checklist de prevenção para nunca perder a operação inteira",
    prompt: `Você é especialista em recuperação de operações de tráfego após ban de BM ou conta no Facebook.

TIPO DE PROBLEMA: {TIPO_PROBLEMA}
(Ban de conta de anúncio / Ban de BM / Restrição de perfil / Bloqueio de domínio / Queda de gateway)

ESTADO ATUAL:
- Tinha estrutura de backup montada? {TEM_BACKUP}
- Tinha BM secundária com histórico de gasto? {TEM_BM2}
- Tinha domínio de backup configurado e testado? {TEM_DOMINIO2}
- Gasto acumulado na BM/conta afetada: R$ {GASTO_ACUMULADO}
- Horas desde o problema: {TEMPO_PROBLEMA}
- Recurso já foi aberto? {RECURSO_ABERTO}
- Volume mensal atual da operação: R$ {VOLUME_MENSAL}/mês

IMPACTO POR TIPO DE ATIVO (referência):
- BM: TODAS as contas param. Histórico de aprendizado pode ser perdido. Recuperação: dias a semanas.
- Conta de anúncio: só essa conta para. BM e outras contas continuam. Recuperação: 24h a 7 dias.
- Perfil pessoal: BMs vinculadas podem ser afetadas. Recuperação: difícil.
- Domínio: campanhas param de aprovar. Anúncios em veiculação continuam gastando sem controle. Recuperação: horas com backup.
- Gateway: vendas param, campanhas continuam gastando sem receita. Recuperação: horas a 24h.

SEQUÊNCIA OBRIGATÓRIA (não pular etapas):
01 — Identificar escopo (5min): perfil acessa o gerenciador? BM aparece? Outras contas rodam?
02 — Pausar tudo na estrutura afetada (imediato): campanhas continuam gastando sem controle.
03 — Ativar backup (primeiros 30min): BM secundária + perfil backup + página backup + domínio backup.
04 — Documentar antes de abrir recurso (primeiros 60min): screenshots, IDs, últimas campanhas ativas.
05 — Abrir recurso formal (após 1h, com documentação em mãos): específico sobre a política e histórico.
06 — Monitorar sem interferir (24–72h): não reabrir o caso, não criar estruturas no perfil banido.

REGRAS QUE NÃO PODEM SER QUEBRADAS:
- Não abrir recurso nos primeiros 30 minutos
- Não criar nova conta usando o mesmo perfil banido
- Não acessar de múltiplos dispositivos em sequência rápida
- Não criar novo perfil pessoal (viola políticas e causa ban em cascata)

DIAGNÓSTICO:
1. Qual é o dano real do meu problema específico?
2. Consigo retomar em menos de 48h com o backup que tenho?
3. Qual é a sequência exata para as PRÓXIMAS 6 HORAS?
4. Qual o prazo realista para voltar ao volume de R$ {VOLUME_MENSAL}/mês?
5. O que MONTAR ESTA SEMANA para nunca perder a operação inteira novamente?

ENTREGUE:
🚨 DANO REAL: o que parou + impacto em faturamento por hora
⏱️ PRÓXIMAS 6 HORAS: sequência com horários estimados
🔄 ESTIMATIVA DE RETORNO: ao volume de R$ {VOLUME_MENSAL}/mês
🛡️ PRIORIDADE DE PREVENÇÃO: top 3 itens para montar esta semana`,
    variables: [
      { key: "TIPO_PROBLEMA", label: "Tipo de problema", placeholder: "Ex: Ban de conta de anúncio / Ban de BM / Bloqueio de domínio" },
      { key: "TEM_BACKUP", label: "Tinha backup montado?", placeholder: "Sim / Não / Parcial" },
      { key: "TEM_BM2", label: "Tinha BM secundária com gasto?", placeholder: "Sim com gasto / Sim sem gasto / Não" },
      { key: "TEM_DOMINIO2", label: "Tinha domínio de backup?", placeholder: "Sim configurado / Só registrado / Não" },
      { key: "GASTO_ACUMULADO", label: "Gasto acumulado na estrutura afetada (R$)", placeholder: "15000" },
      { key: "TEMPO_PROBLEMA", label: "Horas desde o problema", placeholder: "2" },
      { key: "RECURSO_ABERTO", label: "Recurso já aberto?", placeholder: "Sim / Não ainda" },
      { key: "VOLUME_MENSAL", label: "Volume mensal da operação (R$)", placeholder: "31000" }
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

const backendPrompts = [
  {
    id: "p1",
    label: "P1 — Extrair Dores da VSL",
    when: "Não tem base de clientes ainda, ou quer mapear o que a VSL instalou na cabeça do comprador.",
    prompt: `Analise detalhadamente a copy dessa VSL e me entregue:

1. O mecanismo único — o que essa solução faz que nenhuma outra faz
2. As 5 maiores dores do público que essa VSL está atacando
3. As principais objeções que a copy está quebrando
4. As crenças instaladas na cabeça do comprador após assistir
5. O estado emocional do lead antes e depois da VSL

Seja específico. Quero a psicologia real, não resumo genérico.
Responda em português brasileiro.

[VSL]: {cole aqui a transcrição completa}`
  },
  {
    id: "p2",
    label: "P2 — Extrair Dores do Formulário",
    when: "Tem 50+ respostas de clientes acumuladas.",
    prompt: `Você é um estrategista de ofertas de direct response.
Analise essas respostas de pesquisa de público e me entregue:

1. As 5 maiores dores presentes — problemas que eles têm AGORA, antes de qualquer resultado. Ordene por frequência e intensidade.

2. As 3 maiores dores futuras — problemas que vão aparecer depois que o produto principal resolver o primeiro.

3. O perfil psicológico do comprador:
   - O que ele mais teme perder
   - O que ele mais deseja conquistar
   - O que já tentou que não funcionou
   - Qual crença está travando ele agora

4. As 3 melhores oportunidades de upsell com base nesses dados.
   Para cada uma: nome, dor que ataca, formato sugerido, faixa de preço.

Use a linguagem exata das respostas quando possível.
Responda em português brasileiro. Seja direto.

[RESPOSTAS]: {cole aqui as respostas do formulário}`
  },
  {
    id: "p3",
    label: "P3 — Mineração de UGC (Internet Pública)",
    when: "Quer dados brutos e psicologicamente profundos sem base de clientes.",
    prompt: `Você é um especialista em mineração de audiência e antropólogo digital.
Sua missão é garimpar a internet pública para encontrar e extrair histórias reais, desabafos, piadas e expressões do público-alvo abaixo.

NÃO resuma. NÃO analise. Extraia citações literais.

Público: [PÚBLICO]
Problema central: [PROBLEMA]

Execute buscas nos seguintes vetores:

1. Desabafos e reclamações (Reddit, YouTube, Facebook público, fóruns)
2. Piadas e zuação (Twitter/X, Reddit, comentários YouTube)
3. Histórias do dia a dia (Blogs pessoais, Reddit, YouTube)

Para cada história encontrada, entregue:
- Plataforma de origem
- Citação literal do usuário (não resuma)
- URL ou contexto da fonte

Priorize UGC real. Evite artigos corporativos e notícias.
Responda em português brasileiro nativo.`
  },
  {
    id: "p4",
    label: "P4 — Gerar 10 Ideias de Order Bump",
    when: "Tem as 5 dores mapeadas e quer gerar as ofertas. Dica: após o output, peça 'Agora seja mais agressivo — nomes melhores e mais específicos'. A segunda rodada é consistentemente melhor.",
    prompt: `Você é um estrategista de ofertas de direct response especializado em criar order bumps de alta conversão.

Produto principal (front-end):
[FRONT-END] — descreva o produto, o mecanismo único e a promessa principal

Dores presentes identificadas na pesquisa:
[DORES] — cole as 5 dores exatamente como saíram da pesquisa

Crie 10 ideias de order bump. Para cada uma entregue:

1. Nome — [Tipo de entrega] + [resultado] + [para quem / em quanto tempo]
2. Dor que ataca — qual das 5 dores essa oferta resolve
3. Transformação — De [estado atual] → Para [estado desejado]
4. Mecanismo único — o que diferencia, uma frase sem jargão
5. Formato de entrega — justificado pelo esforço mínimo pro comprador
6. Faixa de preço sugerida — único valor para o primeiro teste

Seja agressivo nas ofertas. Nome chiclete, desejo imediato.
Priorize dor presente. Responda em português brasileiro.`
  },
  {
    id: "p5",
    label: "P5 — Copy Completa dos 11 Blocos",
    when: "Tem os 6 campos preenchidos e quer o roteiro do vídeo de upsell. Use junto com a skill 'Gerar Copy de Upsell'.",
    prompt: `Você é um copywriter de direct response especializado em upsell.
Escreva a copy completa de um vídeo de upsell usando os 11 blocos abaixo.

DADOS DA OFERTA:
Produto principal (front-end): [descreva]
Oferta do upsell: [nome + o que é + o que entrega]
Dor que ataca: [a dor presente específica]
Transformação: [de onde está para onde vai]
Mecanismo único: [o que diferencia]
Ticket: [preço do upsell]
Âncora de preço: [valor total do stack]
Público: [quem é, vocabulário, nível de consciência]
Provas sociais disponíveis: [depoimentos ou resultados reais]

Escreva o roteiro seguindo os 11 blocos:
BLOCO 01 — Padrão de Interrupção (para antes de sair · não revela oferta)
BLOCO 02 — Validação + Incompletude (alivia ansiedade · planta gap)
BLOCO 03 — Curiosity Gap + Promessa Emocional (tensão antes do reveal)
BLOCO 04 — Micro-Compromisso (pequeno sim que cria momentum)
BLOCO 05 — Reframe Filosófico (eleva acima do funcional · identidade)
BLOCO 06 — Frame de Tribo + Permissão (remove julgamento)
BLOCO 07 — Prova Social — Transformação (2 histórias: antes + resultado)
BLOCO 08 — Value Stacking (entregáveis + título + promessa + valor ancorado)
BLOCO 09 — Ancoragem de Preço (stack → corte → reveal em 3 etapas)
BLOCO 10 — Prova Social — Objeção Específica (ataca dúvida residual)
BLOCO 11 — Escassez Final + CTA (urgência · preço · botão)

Tom: direto. Sem firula.
Vocabulário do público: [insere termos do nicho]
Responda em português brasileiro nativo.`
  },
  {
    id: "p6",
    label: "P6 — Construção da Página Completa",
    when: "Tem a copy dos 11 blocos pronta e quer o briefing de design para builder ou IA de código.",
    prompt: `Você é um especialista em páginas de upsell de alta conversão.

Com base na copy abaixo, crie um prompt completo de construção de página para ser usado em IA de geração de código ou landing page builder.

O prompt deve incluir:
1. Estrutura — ordem exata: pré-headline → headline → vídeo → copy → CTA
2. Design — paleta de cores (hex), tipografia, estilo geral
3. Vídeo e thumbnail — texto exato + dimensões + instrução de NÃO usar autoplay
   (Texto de thumbnail: "Bem-vindo, novo membro" ou "Veja como acessar seu produto")
4. Elementos de conversão — CTA (cor, texto, tamanho) + botão de "não" (discreto, abaixo do CTA)
5. Animações — entrada por seção, hover do botão, destaque no reveal de preço
6. Mobile — adaptações, ordem em tela pequena, tamanho mínimo de fonte e botão
7. Copy formatada — cada bloco com instrução de design

Entregue em formato de prompt único pronto para colar no Claude, Cursor ou qualquer builder de página.

[COPY]: {cole aqui a copy dos 11 blocos gerada pelo P5}`
  }
];

const metricasSecretas = [
  {
    num: "01", name: "Play Rate do Hook", category: "Hook Visual",
    formula: "Reproduções ÷ Impressões × 100",
    benchmark: "> 30%", benchmarkLabel: "hook visual funcionando",
    insight: "Play Rate baixo = hook visual não quebra o scroll. Teste: cor, movimento, rosto, texto no thumbnail.",
    color: "#f97316"
  },
  {
    num: "02", name: "Retenção do Hook", category: "Hook Copy",
    formula: "ThruPlays 3s ÷ Reproduções × 100",
    benchmark: "> 20%", benchmarkLabel: "hook copy retendo",
    insight: "Retenção baixa = visual funcionou, a copy não. Os primeiros argumentos não prendem.",
    color: "#eab308"
  },
  {
    num: "03", name: "Retenção do Body", category: "Body / Edição",
    formula: "ThruPlays 75% ÷ Reproduções × 100",
    benchmark: "Compare criativos", benchmarkLabel: "vencedores como base",
    insight: "Body baixo = problema no formato, edição ou avatar. Pessoas entram mas saem antes do argumento de conversão.",
    color: "#8b5cf6"
  },
  {
    num: "04", name: "Conversão do Body", category: "Argumento Central",
    formula: "Compras ÷ ThruPlays 75% × 100",
    benchmark: "Histórico interno", benchmarkLabel: "a mais importante",
    insight: "Conversão baixa = mensagem central não fecha. O hook funciona, o body não convence.",
    color: "#10b981"
  },
  {
    num: "05", name: "Medidor de CTA", category: "Chamada para Ação",
    formula: "Cliques ÷ ThruPlays 75% × 100",
    benchmark: "> 30%", benchmarkLabel: "CTA funcionando",
    insight: "CTA baixo = body não gerou FOMO. A pessoa assistiu mas não sentiu urgência.",
    color: "#3b82f6"
  }
];

const cenariosFW = [
  {
    num: "1", title: "Hook bom, Body ruim", color: "#f97316",
    metricas: "Play Rate > 30% + Ret. Hook > 20% · Ret. Body abaixo",
    errada: "Pausar o criativo inteiro",
    certa: "Manter o hook, testar novo body",
    acao: "Criar 3 variações de body com ângulos diferentes, mantendo o hook intacto."
  },
  {
    num: "2", title: "Hook ruim, Body bom", color: "#eab308",
    metricas: "Play Rate < 30% · quem fica converte bem",
    errada: "Testar novo body",
    certa: "Manter o body, testar novos hooks visuais",
    acao: "Criar 5 variações de hook visual (cor, movimento, rosto) com o mesmo body."
  },
  {
    num: "3", title: "Tudo bom, CTA fraco", color: "#8b5cf6",
    metricas: "Todas as métricas ok · Medidor de CTA < 30%",
    errada: "Refazer o criativo",
    certa: "Iterar apenas o CTA com mais urgência",
    acao: "Testar 3 variações de CTA: com prazo, com escassez, com benefício específico."
  },
  {
    num: "4", title: "Tudo ruim", color: "#ef4444",
    metricas: "Todas as métricas abaixo do benchmark",
    errada: "Iterar peça a peça",
    certa: "Pausar e criar criativo novo do zero",
    acao: "Voltar ao briefing. Testar ângulo completamente diferente ou formato novo."
  }
];

const sinaisColapso = [
  {
    num: "01", category: "trafego", severity: "alerta",
    name: "Play Rate do Hook em queda",
    formula: "Reprod. ÷ Impressões × 100",
    threshold: "< 30%",
    meaning: "Hook visual não quebra o scroll. A pessoa vê e passa.",
    action: "Trocar os primeiros 2–3s sem regravar o body. Testar cor, movimento, rosto, texto."
  },
  {
    num: "02", category: "trafego", severity: "alerta",
    name: "Retenção do Hook caindo",
    formula: "ThruPlays 3s ÷ Reproduções × 100",
    threshold: "< 20%",
    meaning: "Hook visual funcionou, copy não. Primeiros argumentos não retêm.",
    action: "Criar nova variação de copy do hook mantendo o hook visual que está funcionando."
  },
  {
    num: "03", category: "trafego", severity: "alerta",
    name: "CTR caindo progressivamente",
    formula: "Cliques ÷ Impressões × 100",
    threshold: "Queda 2 dias",
    meaning: "Criativo perdendo relevância. Fadiga antes do CPM explodir e CPA subir.",
    action: "Subir novo criativo com variação de post-test. Testar ângulo de público diferente."
  },
  {
    num: "04", category: "trafego", severity: "alerta",
    name: "CPM subindo sem aumento de gasto",
    formula: "Custo por mil impressões",
    threshold: "Subida contínua",
    meaning: "Facebook perdendo competitividade no leilão — audiência saturando.",
    action: "Checar frequência. Se > 3× em 7 dias: novo criativo. Se frequência normal: checar segmentação."
  },
  {
    num: "05", category: "conversao", severity: "alerta",
    name: "Retenção do Body abaixo do mínimo",
    formula: "ThruPlays 75% ÷ Reproduções × 100",
    threshold: "Abaixo do histórico",
    meaning: "Formato, edição ou avatar desalinhados. Saem antes do argumento de conversão.",
    action: "Identificar qual variável está errada: formato, edição ou avatar."
  },
  {
    num: "06", category: "conversao", severity: "alerta",
    name: "Conversão do Body abaixo do padrão",
    formula: "Compras ÷ ThruPlays 75% × 100",
    threshold: "Abaixo do histórico",
    meaning: "Mensagem central parou de fechar. Invalida o body inteiro.",
    action: "Pausar e criar novo body. Manter hook validado — o problema é o argumento de conversão."
  },
  {
    num: "07", category: "conversao", severity: "alerta",
    name: "Medidor de CTA abaixo de 30%",
    formula: "Cliques ÷ ThruPlays 75% × 100",
    threshold: "< 30%",
    meaning: "Body não gerou FOMO. Assistiu até o fim mas não sentiu urgência para clicar.",
    action: "Testar variações de CTA com mais especificidade e urgência. Adicionar quebra de objeção."
  },
  {
    num: "08", category: "campanha", severity: "critico",
    name: "CPA subindo por 2 dias consecutivos",
    formula: "Gasto ÷ Vendas",
    threshold: "2 dias de alta",
    meaning: "Deterioração estrutural — audiência saturando, algoritmo perdendo eficiência.",
    action: "Se CPA abaixo do máximo: subir novo criativo. Se acima do máximo: pausar e abrir nova estrutura."
  },
  {
    num: "09", category: "campanha", severity: "critico",
    name: "ROAS abaixo de 1.0 por 48h",
    formula: "Receita ÷ Gasto",
    threshold: "< 1.0 por 48h",
    meaning: "Operação em hemorragia. Cada hora aumenta o prejuízo.",
    action: "PAUSAR IMEDIATAMENTE. Diagnosticar criativo, estrutura ou oferta antes de reativar."
  },
  {
    num: "10", category: "campanha", severity: "critico",
    name: "Campanha lucrativa zerada subitamente",
    formula: "Vendas = 0 em campanha ativa",
    threshold: "> 24h sem vendas",
    meaning: "Algoritmo, landing page, gateway fora do ar ou esgotamento brusco da audiência.",
    action: "Checar: (1) landing page funcionando? (2) gateway processando? (3) pixel disparando? Se tudo ok: abrir estrutura nova."
  },
  {
    num: "11", category: "campanha", severity: "monitoramento",
    name: "Frequência acima de 3× em 7 dias",
    formula: "Impressões ÷ Alcance",
    threshold: "> 3× (atenção) / > 5× (pausar)",
    meaning: "Audiência saturando. Facebook entrega para o mesmo grupo — não encontra novo público.",
    action: "Criar novo criativo com post-test de ângulo diferente. Se > 5×: pausar o conjunto."
  }
];

const guiaCriativos = [
  {
    id: "drop", name: "Drop", duration: "8–20s", icon: "⚡", color: "#ef4444",
    desc: "Venda direta, produto físico ou digital simples. Objetivo: maximizar CTR e IC no menor tempo.",
    estrutura: [
      { part: "H — Hook", time: "0–3s", desc: "Interrupção visual + problema imediato. Sem apresentação. Nada de 'hoje vou falar sobre...'" },
      { part: "B — Body", time: "3–12s", desc: "1 benefício central + 1 prova rápida (número ou depoimento curto). Sem rodeios." },
      { part: "C — CTA", time: "12–20s", desc: "Urgência + link. 'Clique agora, oferta acaba em X' ou 'Link na bio, últimas unidades.'" }
    ],
    formats: ["Stories 9:16", "Reels 9:16", "Feed quadrado 1:1"],
    errors: ["Apresentar produto antes de gerar curiosidade", "CTA fraco ou sem urgência", "Passar de 20s"],
    andromeda: "Use palavra-chave do problema nos primeiros 3s do áudio. Ex: 'Se você luta com [problema]...' — Andromeda segmenta pela transcrição."
  },
  {
    id: "nutra", name: "Nutra / Saúde", duration: "45–90s", icon: "🌿", color: "#10b981",
    desc: "Produto de saúde ou estética. Precisa instalar crença antes de vender. Persona especialista funciona bem.",
    estrutura: [
      { part: "H — Hook", time: "0–8s", desc: "Dado ou descoberta surpreendente. 'Estudo revelou que X% de [público] tem [problema] sem saber.'" },
      { part: "B — Body", time: "8–70s", desc: "Mecanismo único com autoridade. 2–3 provas sociais intercaladas que constroem crença progressivamente." },
      { part: "C — CTA", time: "70–90s", desc: "Escassez real + benefício resumido + CTA específico ('link na bio, 47 unidades disponíveis hoje')." }
    ],
    formats: ["Stories 9:16", "Feed 1:1", "Feed horizontal 16:9"],
    errors: ["Começar com a solução antes de ampliar o problema", "Depoimentos genéricos sem números ou contexto", "CTA sem especificidade de escassez"],
    andromeda: "Use terminologia técnica do nicho nos primeiros 5s. Audiência que pesquisou o problema ativa com essas palavras específicas."
  },
  {
    id: "info", name: "Info / Educacional", duration: "60–180s", icon: "📚", color: "#6366f1",
    desc: "Curso, ebook, método. Requer persuasão maior — lead precisa entender o mecanismo antes de comprar.",
    estrutura: [
      { part: "H — Hook", time: "0–10s", desc: "Pergunta que é a dor central + contradição. 'Por que [público inteligente] ainda sofre com [problema]?'" },
      { part: "B — Body", time: "10–150s", desc: "3 partes: (1) Ampliar dor com dados reais → (2) Revelar mecanismo com autoridade → (3) Provas + stack de benefícios." },
      { part: "C — CTA", time: "150–180s", desc: "Ancoragem de preço + urgência de escassez + CTA direto. Mostre o que acessam imediatamente." }
    ],
    formats: ["Horizontal 16:9", "Stories com swipe up", "Feed 4:5"],
    errors: ["Hook vago sem dor específica", "Body longo sem cortes rítmicos de edição", "Não ancorar preço antes do reveal"],
    andromeda: "Mencione o avatar no áudio ('Para mães de bebês 0–24 meses...') — Andromeda usa isso para segmentar exatamente quem pesquisou o problema."
  },
  {
    id: "x1", name: "X1 / WhatsApp", duration: "60–120s", icon: "💬", color: "#25d366",
    desc: "Captura de leads para WhatsApp. Objetivo: IC (iniciar conversa), não venda direta. UGC converte mais que câmera profissional.",
    estrutura: [
      { part: "H — Hook", time: "0–8s", desc: "Dor específica + promessa de solução personalizada. 'Você ainda [problema]? Descobri um método que funcionou para mim em [tempo].'" },
      { part: "B — Body", time: "8–90s", desc: "Persona conta história de transformação (UGC). Planta a solução como acesso exclusivo. NÃO revela o método completo — gera necessidade do IC." },
      { part: "C — CTA", time: "90–120s", desc: "Clique para falar com especialista / entrar no grupo / receber o método. IC é a conversão — não venda direta no criativo." }
    ],
    formats: ["Stories 9:16 UGC", "Reels 9:16", "Feed 1:1 com legenda longa"],
    errors: ["Revelar o método completo (elimina necessidade de clicar)", "CTA genérico sem especificidade da conversa", "Câmera profissional — reduz conversão no X1"],
    andromeda: "Avatar muito específico no áudio do hook. Use nome do público + problema. Ex: 'Mãe exausta com despertares noturnos...' — evite linguagem corporativa."
  }
];

const rotaEscalaProtocol = {
  diagnostico: [
    { num: "01", question: "Já teve algum criativo com 2+ vendas em 2 dias?", pontob: "Sim → problema provavelmente é estrutura, não criativo", pontoa: "Não → problema de criativo confirmado" },
    { num: "02", question: "Quando escalou o orçamento, o CPA subiu imediatamente?", pontob: "Sim → algoritmo reiniciou aprendizado (escala incorreta)", pontoa: "N/A → ainda não validou criativo" },
    { num: "03", question: "Usa 100% CBO sem ABO testado primeiro?", pontob: "Sim → sem ecossistema = sem estabilidade de escala", pontoa: "Não relevante ainda" },
    { num: "04", question: "Dias de ROAS estável antes de escalar?", pontob: "Menos de 3 dias = reinicia aprendizado", pontoa: "0–1 dia = prematuro" },
    { num: "05", question: "Quando trava, o que faz primeiro?", pontob: "Troca criativo sem diagnosticar estrutura = erro clássico de Ponto A para problema de Ponto B", pontoa: "Sempre troca criativo" }
  ],
  protocoloABO: [
    { step: "1 — Validação", detail: "Orçamento: 1/3 do CPA alvo / conjunto", duration: "2 dias", criteria: "✓ 2 vendas em 2 dias = aprovado", color: "#f97316" },
    { step: "2 — ABO de Escala", detail: "Duplicar 30× com R$10/conjunto", duration: "24h análise", criteria: "✓ ROAS > 2.5× = sobrevive. Pausar os demais às 00h.", color: "#eab308" },
    { step: "3 — Construir Ecossistema", detail: "ABO estável por 3 dias com ROAS > 2.5×", duration: "Aguardar 3 dias", criteria: "✓ Criar CBO paralela com os mesmos criativos", color: "#10b981" },
    { step: "4 — Progressão da CBO", detail: "+30% a cada 48h. Zero outras edições.", duration: "48h entre cada aumento", criteria: "✓ ROAS estável por 48h antes de subir. Segunda CBO em conta separada para acelerar.", color: "#3b82f6" }
  ],
  regrasEscala: [
    { icon: "🔴", rule: "Nunca aumentar mais de 30–50% de uma vez", why: "Salto de 100% reinicia o aprendizado. Facebook explora inventory mais caro, CPM sobe, CPA explode." },
    { icon: "⏱️", rule: "Aguardar ROAS estável por 48h antes de cada aumento", why: "Tempo mínimo para o algoritmo confirmar que consegue entregar no novo volume com eficiência." },
    { icon: "🔒", rule: "Zero outras edições durante a progressão", why: "Qualquer edição (criativo, público, orçamento simultâneo) reinicia o aprendizado. Uma variável por vez." },
    { icon: "🔀", rule: "Para acelerar: segunda CBO em conta separada", why: "Duas CBOs em contas diferentes atingem o volume-alvo mais rápido sem estressar o algoritmo de nenhuma." }
  ],
  expansaoInternacional: [
    { num: "01", criteria: "Problema existe no mercado alvo?", check: "Pesquisar 10+ concorrentes ativos na Ad Library do país há +30 dias" },
    { num: "02", criteria: "Mecanismo é transferível?", check: "Produto sem referência cultural específica do Brasil" },
    { num: "03", criteria: "Preço compatível?", check: "Dentro do range do mercado local — pesquisar tickets dos concorrentes" },
    { num: "04", criteria: "Infraestrutura separada?", check: "BM + conta + gateway + domínio .com + LP em inglês — ZERO conexão com a operação BR" },
    { num: "05", criteria: "Criativo nativo?", check: "UGC com atores do país alvo (Fiverr). Copy revisada por falante nativo. Não traduzir literal." }
  ],
  licoesCase: [
    { caso: "Caso 01 — Nutra", resultado: "$3.2k → $31k/mês em 38 dias", licao: "Trocar criativo é a resposta errada para problema de estrutura. 22 criativos foram descartados sendo que 1 funcionava — faltava o ecossistema ABO+CBO correto." },
    { caso: "Caso 02 — Info", resultado: "CPA −44% em 12 dias", licao: "Velocidade de escala ≠ tamanho do aumento. Dobrar de uma vez chegaria ao volume em 1 dia — com CPA 78% acima do alvo. +30% a cada 48h chegou ao mesmo volume com CPA estável." },
    { caso: "Caso 03 — Drop BR → USA", resultado: "$0 → $18k/mês em 52 dias", licao: "A expansão começa na infraestrutura, não no anúncio. 8 dias montando a estrutura americana antes do primeiro ad garantiram que 2 problemas técnicos não afetaram nada do BR." }
  ]
};

const contingenciaAtivos = [
  { ativo: "BM (Business Manager)", impacto: "Todas as contas de anúncio param. Histórico de aprendizado pode ser perdido.", tempo: "Dias a semanas", sev: "critico" },
  { ativo: "Conta de anúncio", impacto: "Campanhas dessa conta param. BM e outras contas continuam funcionando.", tempo: "24h a 7 dias", sev: "alto" },
  { ativo: "Perfil pessoal", impacto: "BMs vinculadas ao perfil podem ser afetadas. Acesso ao gerenciador bloqueado.", tempo: "Difícil de recuperar", sev: "critico" },
  { ativo: "Página do Facebook", impacto: "Campanhas vinculadas param. Histórico orgânico da página perdido.", tempo: "3 a 10 dias", sev: "alto" },
  { ativo: "Domínio / Landing page", impacto: "Novos anúncios param de aprovar. Anúncios em veiculação continuam gastando sem controle.", tempo: "Horas (com backup)", sev: "medio" },
  { ativo: "Gateway de pagamento", impacto: "Vendas param de processar. Campanhas continuam rodando e gastando sem gerar receita.", tempo: "Horas a 24h", sev: "critico" },
  { ativo: "Pixel", impacto: "Dados de conversão param. Algoritmo perde sinal — CPA sobe progressivamente.", tempo: "1 a 3 dias", sev: "alto" }
];

const contingenciaChecklist = [
  { item: "2 BMs ativas simultaneamente (principal + backup)", priority: "critico" },
  { item: "BM de backup com gasto mínimo acumulado (R$2.500+)", priority: "critico" },
  { item: "Cada BM gerenciada por perfil pessoal diferente (real, ativo há +2 anos)", priority: "estrutural" },
  { item: "Mínimo 2 perfis pessoais reais com acesso à operação", priority: "critico" },
  { item: "Mínimo 2 páginas por nicho ativo com histórico orgânico", priority: "prioritario" },
  { item: "Mínimo 2 domínios registrados por oferta ativa", priority: "critico" },
  { item: "LP duplicada no domínio de backup — testada e funcionando", priority: "prioritario" },
  { item: "Pixel instalado nos 2 domínios", priority: "prioritario" },
  { item: "2 gateways configurados e testados com transação real", priority: "critico" },
  { item: "Cartão de backup cadastrado como pagamento alternativo na BM", priority: "prioritario" },
  { item: "IDs de todos os ativos documentados offline (BM, contas, pixels, páginas)", priority: "medio" },
  { item: "Backup offline de criativos, copies e configurações de campanha", priority: "medio" }
];

const contingenciaResposta = [
  { num: "01", action: "Identificar o escopo", timing: "Primeiros 5min", desc: "O perfil ainda acessa o gerenciador? A BM aparece? Outras contas dentro da BM ainda rodam? Esse mapeamento define a resposta.", warning: null },
  { num: "02", action: "Pausar tudo na estrutura afetada", timing: "Imediato", desc: "Campanhas continuam gastando sem controle mesmo após o ban. Pausar tudo o que ainda está ativo.", warning: null },
  { num: "03", action: "Ativar a estrutura de backup", timing: "Primeiros 30min", desc: "BM secundária + perfil backup + página backup + domínio backup. Com prevenção feita, isso leva menos de 30 minutos.", warning: null },
  { num: "04", action: "Documentar antes de abrir recurso", timing: "Primeiros 60min", desc: "Screenshots de erros, IDs afetados, últimas campanhas ativas. Recurso sem documentação tem taxa de sucesso muito menor.", warning: null },
  { num: "05", action: "Abrir recurso formal", timing: "Após 1h (com documentação)", desc: "Especificar qual política foi supostamente violada, histórico de gasto e tempo de conta. Tom profissional — não agressivo.", warning: "Não abrir recurso nos primeiros 30min. Não acessar de múltiplos dispositivos em sequência — sinaliza comportamento suspeito." },
  { num: "06", action: "Monitorar sem interferir", timing: "24–72h", desc: "Não reabrir o mesmo caso, não criar estruturas novas no perfil banido, não fazer contato múltiplo sobre o mesmo problema.", warning: "Não criar novo perfil pessoal — viola políticas e causa ban em cascata." }
];

export default function SpyDashboard() {
  const [activeTab, setActiveTab] = useState("skills");
  const [activeSkill, setActiveSkill] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [expandedAuto, setExpandedAuto] = useState(null);
  const [expandedBackend, setExpandedBackend] = useState(null);

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
            <button onClick={() => setActiveTab("backend")} style={tabStyle(activeTab === "backend")}>
              💰 Backend / Upsell
            </button>
            <button onClick={() => setActiveTab("rotina")} style={tabStyle(activeTab === "rotina")}>
              📋 Rotina Diária
            </button>
            <button onClick={() => setActiveTab("decisao")} style={tabStyle(activeTab === "decisao")}>
              🎯 Métricas Secretas
            </button>
            <button onClick={() => setActiveTab("sinais")} style={tabStyle(activeTab === "sinais")}>
              ⚠️ Sinais de Colapso
            </button>
            <button onClick={() => setActiveTab("criativos")} style={tabStyle(activeTab === "criativos")}>
              🎬 Guia de Criativos
            </button>
            <button onClick={() => setActiveTab("biblioteca")} style={tabStyle(activeTab === "biblioteca")}>
              📚 Biblioteca
            </button>
            <button onClick={() => setActiveTab("escala")} style={tabStyle(activeTab === "escala")}>
              🗺️ Rota de Escala
            </button>
            <button onClick={() => setActiveTab("contingencia")} style={tabStyle(activeTab === "contingencia")}>
              🛡️ Contingência
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

        {/* ─────── BACKEND TAB ─────── */}
        {activeTab === "backend" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                💰 Prompts de Backend — Upsell10x
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: "0 0 10px", lineHeight: 1.6 }}>
                6 prompts prontos para toda a operação de backend. Da extração de dores à construção da página.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {[
                  { label: "Upsell ≠ faturamento — é teto de CPA. Quem tem esteira aguenta pagar mais por clique e vence o leilão.", color: "#22c55e" },
                  { label: "A métrica de backend é ticket médio, não taxa de conversão. Um OB com 8% pode bater um com 50% se o ticket for maior.", color: "#f59e0b" },
                  { label: "Congruência é a variável #1. A oferta que parte da dor instalada pela VSL dispensa nova persuasão.", color: "#f97316" },
                ].map((p, i) => (
                  <div key={i} style={{
                    background: "rgba(0,0,0,0.3)",
                    borderLeft: `3px solid ${p.color}`,
                    borderRadius: 8,
                    padding: "10px 12px"
                  }}>
                    <p style={{ fontSize: 12, color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>{p.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {backendPrompts.map((bp, i) => (
              <div key={bp.id} style={{
                background: "rgba(255,255,255,0.02)",
                border: expandedBackend === i ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                overflow: "hidden"
              }}>
                <button
                  onClick={() => setExpandedBackend(expandedBackend === i ? null : i)}
                  style={{
                    width: "100%", padding: "16px 20px",
                    background: "none", border: "none",
                    cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    color: "inherit"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px", color: "#fafafa" }}>{bp.label}</h3>
                    <p style={{ fontSize: 12, color: "#71717a", margin: 0 }}>{bp.when}</p>
                  </div>
                  <span style={{
                    fontSize: 20, color: "#22c55e",
                    transform: expandedBackend === i ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.2s"
                  }}>+</span>
                </button>

                {expandedBackend === i && (
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                      <button
                        onClick={() => handleCopy(bp.prompt, bp.id)}
                        style={{
                          padding: "8px 16px", borderRadius: 8,
                          background: copiedId === bp.id ? "#22c55e" : "#10b981",
                          border: "none", color: "white", cursor: "pointer",
                          fontSize: 13, fontWeight: 700
                        }}
                      >
                        {copiedId === bp.id ? "✅ Copiado!" : "📋 Copiar Prompt"}
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
                      {bp.prompt}
                    </pre>
                  </div>
                )}
              </div>
            ))}

            <div style={{
              background: "rgba(234,179,8,0.05)",
              border: "1px solid rgba(234,179,8,0.15)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#eab308", margin: "0 0 10px" }}>
                📋 Sequência de uso dos prompts
              </h3>
              <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.8 }}>
                <p style={{ margin: "0 0 4px" }}>⸻ <strong style={{color:"#fafafa"}}>Fase 1 — Descoberta de dores</strong></p>
                <p style={{ margin: "0 0 10px 20px" }}>P1 (tem VSL) → P2 (tem respostas de clientes) → P3 (quer UGC da internet)</p>
                <p style={{ margin: "0 0 4px" }}>⸻ <strong style={{color:"#fafafa"}}>Fase 2 — Criar as ofertas</strong></p>
                <p style={{ margin: "0 0 10px 20px" }}>P4 → gera 10 ideias → filtra as 5 melhores → testa OBs por ticket médio</p>
                <p style={{ margin: "0 0 4px" }}>⸻ <strong style={{color:"#fafafa"}}>Fase 3 — Escrever e construir</strong></p>
                <p style={{ margin: "0 20px" }}>P5 → copy dos 11 blocos → P6 → briefing da página pronto para builder</p>
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

        {/* ─────── MÉTRICAS SECRETAS TAB ─────── */}
        {activeTab === "decisao" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 14, padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                🎯 Métricas Secretas — Framework de Decisão
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: "0 0 12px", lineHeight: 1.6 }}>
                O Facebook registra tudo — mas esconde na visão padrão. Estas 5 métricas calculadas revelam <strong style={{color:"#e4e4e7"}}>exatamente onde no criativo você está perdendo pessoas</strong> e qual elemento iterar (não o criativo inteiro).
              </p>
              <div style={{
                background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "12px 16px",
                fontSize: 12, color: "#a1a1aa", lineHeight: 1.7
              }}>
                <strong style={{color:"#6366f1"}}>Jornada do espectador:</strong>
                {" "}Impressões → <span style={{color:"#f97316"}}>Play Rate</span> → Reproduções → <span style={{color:"#eab308"}}>Ret. Hook</span> → ThruPlay 3s → <span style={{color:"#8b5cf6"}}>Ret. Body</span> → ThruPlay 75% → <span style={{color:"#3b82f6"}}>CTA</span> → Cliques → <span style={{color:"#10b981"}}>Conv. Body</span> → Compras
              </div>
            </div>

            {/* 5 Métricas */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
                As 5 Métricas — Fórmulas e Benchmarks
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {metricasSecretas.map(m => (
                  <div key={m.num} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${m.color}33`,
                    borderLeft: `3px solid ${m.color}`,
                    borderRadius: 10, padding: "14px 16px",
                    display: "grid", gridTemplateColumns: "40px 1fr 1fr", gap: 12, alignItems: "start"
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${m.color}22`, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 900, color: m.color
                    }}>{m.num}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 2 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: m.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{m.category}</div>
                      <div style={{
                        background: "rgba(0,0,0,0.35)", borderRadius: 6,
                        padding: "6px 10px", fontFamily: "monospace",
                        fontSize: 12, color: "#d4d4d8"
                      }}>{m.formula}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#71717a", marginBottom: 4 }}>Benchmark</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: m.color, marginBottom: 2 }}>{m.benchmark}</div>
                      <div style={{ fontSize: 11, color: "#71717a", marginBottom: 8 }}>{m.benchmarkLabel}</div>
                      <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{m.insight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmarks CPM/CTR/CPC */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
                Referência Rápida — CPM · CTR · CPC
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { name: "CPM", low: "< R$15", mid: "R$15–35", high: "> R$35", insight: "CPM subindo sem aumento de orçamento = fadiga. Cheque frequência antes de pausar." },
                  { name: "CTR", low: "< 0,8%", mid: "0,8–1,5%", high: "> 1,5%", insight: "CTR caindo 2 dias seguidos = sinal de fadiga antes do CPA explodir." },
                  { name: "CPC", low: "< R$1,50", mid: "R$1,50–3", high: "> R$3", insight: "CPC alto com boa conversão pode ser sustentável. CPC alto + baixa conversão = desalinhamento criativo-oferta." }
                ].map(b => (
                  <div key={b.name} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: "14px 14px"
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#fafafa", marginBottom: 8 }}>{b.name}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#22c55e" }}>🟢 Bom</span>
                        <span style={{ color: "#d4d4d8", fontWeight: 600 }}>{b.low}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#eab308" }}>🟡 Ok</span>
                        <span style={{ color: "#d4d4d8", fontWeight: 600 }}>{b.mid}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#ef4444" }}>🔴 Alto</span>
                        <span style={{ color: "#d4d4d8", fontWeight: 600 }}>{b.high}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: "#71717a", margin: 0, lineHeight: 1.5 }}>{b.insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Cenários */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
                Framework de Decisão Rápida — 4 Cenários
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cenariosFW.map(c => (
                  <div key={c.num} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${c.color}33`,
                    borderRadius: 12, overflow: "hidden"
                  }}>
                    <div style={{
                      background: `${c.color}15`, padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: 10,
                      borderBottom: `1px solid ${c.color}22`
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: c.color, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 900, color: "white", flexShrink: 0
                      }}>{c.num}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#fafafa" }}>{c.title}</div>
                        <div style={{ fontSize: 11, color: "#a1a1aa" }}>{c.metricas}</div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{
                        background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                        borderRadius: 8, padding: "10px 12px"
                      }}>
                        <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>❌ Decisão errada</div>
                        <div style={{ fontSize: 12, color: "#fca5a5", fontWeight: 600 }}>{c.errada}</div>
                      </div>
                      <div style={{
                        background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
                        borderRadius: 8, padding: "10px 12px"
                      }}>
                        <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>✅ Decisão certa</div>
                        <div style={{ fontSize: 12, color: "#86efac", fontWeight: 600 }}>{c.certa}</div>
                      </div>
                      <div style={{
                        gridColumn: "1 / -1",
                        background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 12px"
                      }}>
                        <div style={{ fontSize: 10, color: c.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>🔧 Ação</div>
                        <div style={{ fontSize: 12, color: "#d4d4d8" }}>{c.acao}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atalho para skill */}
            <div style={{
              background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>
                  🎯 Diagnóstico automático com IA
                </div>
                <div style={{ fontSize: 12, color: "#a1a1aa" }}>
                  Cole os dados brutos do Meta — a IA calcula as 5 métricas, identifica o cenário e entrega a ação.
                </div>
              </div>
              <button
                onClick={() => { setActiveTab("skills"); setActiveSkill("metricas_secretas"); }}
                style={{
                  padding: "10px 18px", borderRadius: 8, flexShrink: 0,
                  background: "#6366f1", border: "none",
                  color: "white", cursor: "pointer",
                  fontSize: 13, fontWeight: 700
                }}
              >
                Abrir skill →
              </button>
            </div>

          </div>
        )}

        {/* ─────── SINAIS DE COLAPSO TAB ─────── */}
        {activeTab === "sinais" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(234,179,8,0.05))",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 14, padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                ⚠️ 11 Sinais de Colapso — Diagnóstico Preventivo
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: "0 0 12px", lineHeight: 1.6 }}>
                Estes sinais aparecem <strong style={{color:"#e4e4e7"}}>24–48h antes</strong> de uma campanha colapsar. Identificá-los cedo evita hemorragia de budget e reinicialização desnecessária de algoritmo.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { label: "🔴 CRÍTICO", desc: "Ação imediata — cada hora aumenta o prejuízo", color: "#ef4444" },
                  { label: "🟡 ALERTA", desc: "Ação nas próximas 24h — deterioração em curso", color: "#eab308" },
                  { label: "🟢 MONITORAMENTO", desc: "Acompanhar mais 1 ciclo antes de agir", color: "#22c55e" }
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderLeft: `3px solid ${s.color}`, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#71717a" }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {["critico", "alerta", "monitoramento"].map(sev => {
              const sevConfig = {
                critico: { label: "🔴 Crítico — Ação Imediata", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
                alerta: { label: "🟡 Alerta — Próximas 24h", color: "#eab308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
                monitoramento: { label: "🟢 Monitoramento", color: "#22c55e", bg: "rgba(34,197,94,0.05)", border: "rgba(34,197,94,0.15)" }
              }[sev];
              const signals = sinaisColapso.filter(s => s.severity === sev);
              return (
                <div key={sev}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: sevConfig.color, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
                    {sevConfig.label}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {signals.map(s => (
                      <div key={s.num} style={{
                        background: sevConfig.bg, border: `1px solid ${sevConfig.border}`,
                        borderLeft: `3px solid ${sevConfig.color}`, borderRadius: 10, padding: "14px 16px"
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, alignItems: "start" }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `${sevConfig.color}22`, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 900, color: sevConfig.color
                          }}>{s.num}</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>{s.name}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                              <div>
                                <div style={{ fontSize: 10, color: "#71717a", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Fórmula</div>
                                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#d4d4d8", background: "rgba(0,0,0,0.3)", borderRadius: 4, padding: "4px 8px" }}>{s.formula}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 10, color: "#71717a", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Gatilho</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: sevConfig.color }}>{s.threshold}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 6, lineHeight: 1.5 }}>
                              <strong style={{color:"#d4d4d8"}}>O que significa:</strong> {s.meaning}
                            </div>
                            <div style={{
                              background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "8px 12px",
                              fontSize: 12, color: "#d4d4d8", lineHeight: 1.5
                            }}>
                              <strong style={{color: sevConfig.color}}>Ação:</strong> {s.action}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>⚠️ Diagnóstico preventivo automático com IA</div>
                <div style={{ fontSize: 12, color: "#a1a1aa" }}>Cole as métricas do dia — a IA identifica quais sinais estão ativos e entrega as ações em ordem de prioridade.</div>
              </div>
              <button onClick={() => { setActiveTab("skills"); setActiveSkill("sinais_colapso"); }} style={{
                padding: "10px 18px", borderRadius: 8, flexShrink: 0,
                background: "#ef4444", border: "none", color: "white",
                cursor: "pointer", fontSize: 13, fontWeight: 700
              }}>Abrir skill →</button>
            </div>
          </div>
        )}

        {/* ─────── GUIA DE CRIATIVOS TAB ─────── */}
        {activeTab === "criativos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 14, padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                🎬 Guia de Criativos por Operação
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: "0 0 12px", lineHeight: 1.6 }}>
                Cada tipo de operação tem uma estrutura H/B/C diferente. Usar a estrutura errada é o principal motivo de criativo bom com CTR fraco.
              </p>
              <div style={{
                background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)",
                borderRadius: 10, padding: "12px 16px"
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#eab308", marginBottom: 4 }}>⚡ Andromeda Update</div>
                <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.6 }}>
                  O Facebook usa <strong style={{color:"#e4e4e7"}}>transcrição de áudio</strong> para segmentar audiência — não só interesses. O vocabulário dos primeiros 5s do áudio ativa (ou afasta) o público certo. Cada operação abaixo tem uma dica específica.
                </div>
              </div>
            </div>

            {guiaCriativos.map(op => (
              <div key={op.id} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${op.color}33`,
                borderRadius: 14, overflow: "hidden"
              }}>
                <div style={{
                  background: `${op.color}12`, padding: "16px 20px",
                  borderBottom: `1px solid ${op.color}22`,
                  display: "flex", alignItems: "center", gap: 12
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${op.color}22`, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0
                  }}>{op.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#fafafa" }}>{op.name}</span>
                      <span style={{
                        background: `${op.color}22`, color: op.color,
                        fontSize: 11, fontWeight: 700, padding: "2px 8px",
                        borderRadius: 20, border: `1px solid ${op.color}44`
                      }}>{op.duration}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#a1a1aa" }}>{op.desc}</div>
                  </div>
                </div>

                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* H/B/C Structure */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: op.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Estrutura H / B / C</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {op.estrutura.map((e, i) => (
                        <div key={i} style={{
                          display: "grid", gridTemplateColumns: "120px 1fr", gap: 10,
                          background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 12px"
                        }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: op.color }}>{e.part}</div>
                            <div style={{ fontSize: 11, color: "#71717a" }}>{e.time}</div>
                          </div>
                          <div style={{ fontSize: 12, color: "#d4d4d8", lineHeight: 1.5 }}>{e.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formats + Errors */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>✅ Formatos</div>
                      {op.formats.map((f, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 3 }}>• {f}</div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>❌ Erros comuns</div>
                      {op.errors.map((e, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 3 }}>• {e}</div>
                      ))}
                    </div>
                  </div>

                  {/* Andromeda tip */}
                  <div style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#eab308", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>🎙️ Dica Andromeda</div>
                    <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{op.andromeda}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>🎬 Diagnóstico H/B/C com IA</div>
                <div style={{ fontSize: 12, color: "#a1a1aa" }}>Informe o tipo de operação e as métricas — a IA identifica qual parte do criativo está quebrando e a iteração exata.</div>
              </div>
              <button onClick={() => { setActiveTab("skills"); setActiveSkill("estrutura_criativo"); }} style={{
                padding: "10px 18px", borderRadius: 8, flexShrink: 0,
                background: "#6366f1", border: "none", color: "white",
                cursor: "pointer", fontSize: 13, fontWeight: 700
              }}>Abrir skill →</button>
            </div>
          </div>
        )}

        {/* ─────── BIBLIOTECA TAB ─────── */}
        {activeTab === "biblioteca" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.04))",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 14, padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>
                📚 Biblioteca de Prompts — IA Especializada
              </h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0, lineHeight: 1.6 }}>
                4 prompts avançados para pesquisa de avatar, auditoria de criativos, decodificação de ads de concorrentes e injeção de contexto completo. Use estes antes de qualquer tarefa de copy ou diagnóstico.
              </p>
            </div>

            {[
              { id: "estudo_publico", icon: "👤", color: "#10b981", title: "Estudo de Público — Avatar Profundo", when: "Use antes de criar qualquer criativo. O avatar é a base — sem ele, qualquer prompt de copy é genérico." },
              { id: "auditor_criativos", icon: "🔬", color: "#f97316", title: "Auditor de Criativos — Método Megaclass", when: "Use quando um criativo não converte ou antes de pausar — o diagnóstico pode revelar o elemento certo a iterar." },
              { id: "decodificador_ads", icon: "🔓", color: "#8b5cf6", title: "Decodificador de Ads V33.0", when: "Use quando encontrar criativo de concorrente escalando. Decodifica o padrão e entrega briefing para modelar sem copiar." },
              { id: "meta_prompt_architect", icon: "🏗️", color: "#3b82f6", title: "Meta-Prompt Architect V18.0", when: "Use para treinar a IA com contexto completo do seu produto antes de qualquer tarefa de copy ou diagnóstico." }
            ].map((item) => (
              <div key={item.id} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${item.color}33`,
                borderRadius: 14, overflow: "hidden"
              }}>
                <div style={{
                  padding: "18px 20px", background: `${item.color}10`,
                  borderBottom: `1px solid ${item.color}22`,
                  display: "flex", alignItems: "center", gap: 12
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${item.color}22`, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fafafa", marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#71717a", lineHeight: 1.4 }}>{item.when}</div>
                  </div>
                  <button
                    onClick={() => { setActiveTab("skills"); setActiveSkill(item.id); }}
                    style={{
                      padding: "8px 16px", borderRadius: 8, flexShrink: 0,
                      background: `${item.color}22`, border: `1px solid ${item.color}44`,
                      color: item.color, cursor: "pointer", fontSize: 12, fontWeight: 700
                    }}
                  >
                    Abrir →
                  </button>
                </div>
                <div style={{ padding: "12px 20px" }}>
                  {item.id === "estudo_publico" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                      {["Parte 1 — Demo & Contexto", "Parte 2 — Dores (5 presentes + 3 futuras)", "Parte 3 — Desejos & Sonhos", "Parte 4 — Crenças & Bloqueios", "Parte 5 — Gatilhos & Vocabulário", "Parte 6 — Diretrizes de Criativo"].map((p, i) => (
                        <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#a1a1aa" }}>{p}</div>
                      ))}
                    </div>
                  )}
                  {item.id === "auditor_criativos" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                      {["Seção 1 — Hook", "Seção 2 — Body", "Seção 3 — CTA", "Seção 4 — Alinhamento criativo-oferta", "Seção 5 — Andromeda", "Seção 6 — Plano de iteração"].map((p, i) => (
                        <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#a1a1aa" }}>{p}</div>
                      ))}
                    </div>
                  )}
                  {item.id === "decodificador_ads" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                      {["C1 — Interrupção", "C2 — Hook Psicológico", "C3 — Crença do Body", "C4 — Padrão de Copy", "C5 — Avatar implícito", "C6 — Conversão", "C7 — Briefing de modelagem", "Avisos anti-plágio"].map((p, i) => (
                        <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#a1a1aa" }}>{p}</div>
                      ))}
                    </div>
                  )}
                  {item.id === "meta_prompt_architect" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                      {["produto (nome, mecanismo, promessa, ticket)", "avatar (dor, desejo, vocabulário, objeção)", "campanha (fase, criativos, CPA alvo)", "histórico (funcionou / não funcionou)"].map((p, i) => (
                        <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#a1a1aa" }}>{p}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div style={{
              background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)",
              borderRadius: 12, padding: "16px 20px"
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#10b981", margin: "0 0 8px" }}>📋 Sequência recomendada</h3>
              <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.8 }}>
                <p style={{ margin: "0 0 4px" }}>1. <strong style={{color:"#fafafa"}}>Meta-Prompt Architect</strong> — injete o contexto do produto na IA primeiro</p>
                <p style={{ margin: "0 0 4px" }}>2. <strong style={{color:"#fafafa"}}>Estudo de Público</strong> — gere o avatar completo antes de criar qualquer copy</p>
                <p style={{ margin: "0 0 4px" }}>3. <strong style={{color:"#fafafa"}}>Decodificador de Ads</strong> — se tiver concorrente escalando, decodifique antes de criar</p>
                <p style={{ margin: 0 }}>4. <strong style={{color:"#fafafa"}}>Auditor de Criativos</strong> — use após 3+ dias de dados para diagnosticar antes de pausar</p>
              </div>
            </div>
          </div>
        )}

        {/* ─────── ROTA DE ESCALA TAB ─────── */}
        {activeTab === "escala" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.05))",
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: 14, padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>🗺️ Rota de Escala — Protocolos Operacionais</h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0, lineHeight: 1.6 }}>
                3 operações reais dissecadas. Sinal detectado, decisão tomada, resultado. Não é teoria — é a rota percorrida em situações reais.
              </p>
            </div>

            {/* Lições dos 3 casos */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>3 Casos Reais — Lições Centrais</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rotaEscalaProtocol.licoesCase.map((c, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(249,115,22,0.2)", borderLeft: "3px solid #f97316", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa" }}>{c.caso}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", whiteSpace: "nowrap" }}>{c.resultado}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{c.licao}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnóstico de Posição */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Diagnóstico de Posição — Ponto A (Criativo) ou B (Estrutura)</h3>
              <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "14px 16px", marginBottom: 8, fontSize: 12, color: "#a1a1aa", lineHeight: 1.6 }}>
                <strong style={{color:"#f97316"}}>Regra:</strong> Antes de trocar qualquer criativo, responda as 5 perguntas. Se as métricas de criativo estiverem boas (Play Rate {">"} 30%, Conv. Body {">"} 2%) mas o CPA não atinge o alvo = Ponto B. Trocar criativo não vai resolver.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rotaEscalaProtocol.diagnostico.map((d, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px", alignItems: "start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#f97316" }}>{d.num}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>{d.question}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fca5a5" }}>
                          <span style={{fontWeight:700, color:"#ef4444"}}>🔴 Ponto A: </span>{d.pontoa}
                        </div>
                        <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fdba74" }}>
                          <span style={{fontWeight:700, color:"#f97316"}}>🟠 Ponto B: </span>{d.pontob}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocolo ABO → CBO */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Protocolo ABO → CBO — 4 Estágios</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rotaEscalaProtocol.protocoloABO.map((p, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 0, background: "rgba(255,255,255,0.02)", border: `1px solid ${p.color}33`, borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ background: `${p.color}15`, padding: "12px 14px", borderRight: `1px solid ${p.color}22` }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: p.color, marginBottom: 4 }}>{p.step}</div>
                      <div style={{ fontSize: 11, color: "#71717a" }}>{p.duration}</div>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 12, color: "#d4d4d8", marginBottom: 4 }}>{p.detail}</div>
                      <div style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.criteria}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regras de Escala */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>4 Regras de Timing de Escala</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rotaEscalaProtocol.regrasEscala.map((r, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 6 }}>{r.icon} {r.rule}</div>
                    <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{r.why}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expansão Internacional */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>5 Critérios — Expansão para Mercado Internacional</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rotaEscalaProtocol.expansaoInternacional.map((e, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px", alignItems: "start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#f97316" }}>{e.num}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", marginBottom: 4 }}>{e.criteria}</div>
                      <div style={{ fontSize: 12, color: "#a1a1aa" }}>{e.check}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs para skills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa" }}>🗺️ Diagnóstico de Posição com IA</div>
                <div style={{ fontSize: 12, color: "#a1a1aa", flex: 1 }}>Responda as 5 perguntas — a IA determina Ponto A ou B e entrega a rota.</div>
                <button onClick={() => { setActiveTab("skills"); setActiveSkill("diagnostico_posicao"); }} style={{ padding: "8px 14px", borderRadius: 8, background: "#f97316", border: "none", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Abrir skill →</button>
              </div>
              <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa" }}>📈 Protocolo de Escala com IA</div>
                <div style={{ fontSize: 12, color: "#a1a1aa", flex: 1 }}>Cole as métricas — a IA calcula o próximo aumento seguro e o timing correto.</div>
                <button onClick={() => { setActiveTab("skills"); setActiveSkill("protocolo_escala"); }} style={{ padding: "8px 14px", borderRadius: 8, background: "#3b82f6", border: "none", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Abrir skill →</button>
              </div>
            </div>
          </div>
        )}

        {/* ─────── CONTINGÊNCIA TAB ─────── */}
        {activeTab === "contingencia" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(234,179,8,0.04))",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 14, padding: "20px 24px"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#fafafa" }}>🛡️ Protocolo de Contingência</h2>
              <p style={{ fontSize: 13, color: "#a1a1aa", margin: "0 0 12px", lineHeight: 1.6 }}>
                A queda de BM não é surpresa — é previsível. A diferença entre quem perde a operação inteira e quem volta em 24h é uma só: <strong style={{color:"#e4e4e7"}}>quem montou o protocolo antes do problema acontecer.</strong>
              </p>
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#fca5a5" }}>
                <strong>Regra de ouro:</strong> Nunca dependa de um único ponto de nenhum ativo. Uma BM, um perfil, uma conta, um domínio, um gateway. Todo ativo crítico precisa ter redundância. Sem redundância, você não tem operação — tem uma aposta.
              </div>
            </div>

            {/* Impacto por ativo */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>O Que Pode Cair — Impacto por Ativo</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {contingenciaAtivos.map((a, i) => {
                  const sevColor = a.sev === "critico" ? "#ef4444" : a.sev === "alto" ? "#f97316" : "#eab308";
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${sevColor}22`, borderLeft: `3px solid ${sevColor}`, borderRadius: 8, padding: "10px 14px", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{a.ativo}</div>
                      <div style={{ fontSize: 12, color: "#a1a1aa" }}>{a.impacto}</div>
                      <div style={{ fontSize: 11, color: sevColor, fontWeight: 600 }}>{a.tempo}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checklist de prevenção */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Checklist de Prevenção — Montar Agora</h3>
              {["critico", "prioritario", "estrutural", "medio"].map(pri => {
                const priConfig = {
                  critico: { label: "🔴 Crítico", color: "#ef4444" },
                  prioritario: { label: "🟡 Prioritário", color: "#eab308" },
                  estrutural: { label: "🟠 Estrutural", color: "#f97316" },
                  medio: { label: "🟢 Médio prazo", color: "#22c55e" }
                }[pri];
                const items = contingenciaChecklist.filter(c => c.priority === pri);
                return (
                  <div key={pri} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: priConfig.color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{priConfig.label}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {items.map((c, j) => (
                        <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 12px" }}>
                          <span style={{ color: priConfig.color, fontSize: 14, marginTop: -1 }}>□</span>
                          <span style={{ fontSize: 12, color: "#d4d4d8" }}>{c.item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sequência de resposta */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Sequência de Resposta — Siga na Ordem</h3>
              <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#eab308", marginBottom: 10 }}>
                ⚠️ Ações erradas nos primeiros minutos podem piorar o problema. Não abra recurso antes de 30min. Não crie nova conta no perfil banido.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {contingenciaResposta.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", alignItems: "start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#ef4444" }}>{r.num}</div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fafafa" }}>{r.action}</span>
                        <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>{r.timing}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5, marginBottom: r.warning ? 6 : 0 }}>{r.desc}</div>
                      {r.warning && (
                        <div style={{ fontSize: 11, color: "#fca5a5", background: "rgba(239,68,68,0.08)", borderRadius: 6, padding: "6px 10px" }}>
                          🚫 {r.warning}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cenários de recuperação */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Tempo de Retorno ao Volume Anterior</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { situacao: "Tinha estrutura de backup completa montada", tempo: "24–48 horas", fator: "Velocidade de ativar o backup e recriar campanhas", color: "#22c55e" },
                  { situacao: "Sem backup, mas com documentação de tudo que rodava", tempo: "3–7 dias", fator: "Velocidade de montar nova estrutura e revalidar criativos", color: "#eab308" },
                  { situacao: "Sem backup e sem documentação", tempo: "2–4 semanas", fator: "Precisa reconstruir tudo do zero, reaquecer contas, revalidar criativos", color: "#ef4444" }
                ].map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${s.color}22`, borderLeft: `3px solid ${s.color}`, borderRadius: 8, padding: "12px 14px", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", marginBottom: 3 }}>{s.situacao}</div>
                      <div style={{ fontSize: 11, color: "#71717a" }}>{s.fator}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: s.color, textAlign: "right" }}>{s.tempo}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>🛡️ Diagnóstico de contingência com IA</div>
                <div style={{ fontSize: 12, color: "#a1a1aa" }}>Informe o tipo de problema — sequência das próximas 6h, estimativa de retorno e checklist de prevenção personalizado.</div>
              </div>
              <button onClick={() => { setActiveTab("skills"); setActiveSkill("contingencia_protocolo"); }} style={{ padding: "10px 18px", borderRadius: 8, flexShrink: 0, background: "#ef4444", border: "none", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Abrir skill →</button>
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
