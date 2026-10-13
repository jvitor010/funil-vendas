// Lume · motor de previsão das janelas de sono.
// Funções puras: recebem dados e datas, devolvem números e textos. Sem DOM e sem armazenamento.
// Fonte das faixas: a tabela do método Código das Janelas de Ouro (WW do app antigo), interpolada por idade em dias.

export const MIN = 60000;
export const DIA = 86400000;

// Idade (dias, já corrigida) → janela acordada em minutos [mín, máx] e sonecas por dia [mín, máx].
export const ANCORAS = [
  { dias: 0, janela: [45, 60], sonecas: [5, 6] },
  { dias: 42, janela: [60, 75], sonecas: [4, 5] },
  { dias: 91, janela: [75, 90], sonecas: [4, 5] },
  { dias: 122, janela: [90, 120], sonecas: [3, 4] },
  { dias: 152, janela: [120, 135], sonecas: [3, 3] },
  { dias: 183, janela: [135, 180], sonecas: [2, 3] },
  { dias: 244, janela: [180, 210], sonecas: [2, 2] },
  { dias: 305, janela: [210, 240], sonecas: [1, 2] },
  { dias: 365, janela: [240, 300], sonecas: [1, 1] },
  { dias: 548, janela: [300, 360], sonecas: [1, 1] },
  { dias: 730, janela: [330, 420], sonecas: [0, 1] },
];

// Regressões e transições de soneca, por idade corrigida em dias, para avisar com antecedência.
export const MARCOS = [
  { id: 'regressao-4m', de: 105, ate: 135, titulo: 'Regressão dos 4 meses', texto: 'O sono amadurece e os despertares podem aumentar por 2 a 4 semanas.' },
  { id: 'transicao-3-2', de: 200, ate: 245, titulo: 'Transição de 3 para 2 sonecas', texto: 'A terceira soneca começa a ficar difícil. O plano vai sugerir quando trocar.' },
  { id: 'regressao-8m', de: 230, ate: 300, titulo: 'Regressão dos 8 a 10 meses', texto: 'Engatinhar e ansiedade de separação mexem com o sono por 1 a 3 semanas.' },
  { id: 'regressao-12m', de: 350, ate: 380, titulo: 'Regressão dos 12 meses', texto: 'Primeiros passos e rotina parecendo quebrada por 1 a 2 semanas.' },
  { id: 'transicao-2-1', de: 395, ate: 545, titulo: 'Transição de 2 para 1 soneca', texto: 'Uma soneca só começa a fazer sentido. O plano ajusta o horário da tarde.' },
  { id: 'regressao-18m', de: 530, ate: 560, titulo: 'Regressão dos 18 meses', texto: 'Fase de testar limites. Mantenha a rotina com acolhimento.' },
];

const AJUSTE_MAX = 15;
const SONECA_CURTA = 40;
const AVISO_ANTES = 15;

const limitar = (v, a, b) => Math.min(b, Math.max(a, v));

function inicioDoDiaLocal(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function minutosDoDia(ms) {
  const d = new Date(ms);
  return d.getHours() * 60 + d.getMinutes();
}

// Idade em dias, corrigida para prematuros (idadeGestacional em semanas ao nascer; 40 = a termo).
// A correção vale até os 24 meses de idade cronológica.
export function idadeEmDias(nascimento, agora, idadeGestacional = 40) {
  const [a, m, d] = nascimento.split('-').map(Number);
  const nasc = new Date(a, m - 1, d).getTime();
  const cronologica = Math.floor((inicioDoDiaLocal(agora) - nasc) / DIA);
  const semanasAntes = Math.max(0, 40 - (idadeGestacional || 40));
  if (cronologica >= 730 || semanasAntes === 0) return Math.max(0, cronologica);
  return Math.max(0, cronologica - semanasAntes * 7);
}

function faixaDe(dias) {
  let i = 0;
  while (i < ANCORAS.length - 1 && ANCORAS[i + 1].dias <= dias) i++;
  return i;
}

// Janela acordada da idade, interpolada entre as âncoras para não dar saltos de um mês para o outro.
export function janelaBase(dias) {
  const i = faixaDe(dias);
  const a = ANCORAS[i];
  const b = ANCORAS[i + 1];
  if (!b) return { min: a.janela[0], max: a.janela[1] };
  const t = (dias - a.dias) / (b.dias - a.dias);
  return {
    min: Math.round(a.janela[0] + (b.janela[0] - a.janela[0]) * t),
    max: Math.round(a.janela[1] + (b.janela[1] - a.janela[1]) * t),
  };
}

// Quantas sonecas planejar: o máximo da faixa na primeira metade dela, o mínimo na segunda.
export function sonecasAlvo(dias) {
  const i = faixaDe(dias);
  const a = ANCORAS[i];
  const b = ANCORAS[i + 1];
  const [lo, hi] = a.sonecas;
  if (lo === hi) return lo || 1;
  const t = b ? (dias - a.dias) / (b.dias - a.dias) : 1;
  return Math.max(1, t < 0.5 ? hi : lo);
}

// Duração típica da soneca (min) quando ainda não há histórico.
export function duracaoTipica(dias, indice, total) {
  if (dias < 91) return 45;
  if (dias < 183) return indice >= 2 && indice === total - 1 ? 40 : 75;
  if (dias < 365) return 75;
  return 120;
}

// Janela da vez: a primeira do dia perto do mínimo, a última antes da noite no máximo.
// `curta`: a soneca anterior durou menos de 40 min. `ajuste`: calibração pessoal em minutos.
export function janelaDaVez(faixa, indice, totalJanelas, { curta = false, ajuste = 0 } = {}) {
  const fator = totalJanelas <= 1 ? 0.5 : 0.2 + 0.8 * (indice / (totalJanelas - 1));
  let ideal = faixa.min + (faixa.max - faixa.min) * fator;
  if (curta) ideal = Math.max(faixa.min * 0.85, ideal * 0.85);
  else ideal = limitar(ideal + ajuste, faixa.min, faixa.max);
  ideal = Math.round(ideal);
  const meia = limitar(Math.round((faixa.max - faixa.min) * 0.25), 5, 20);
  return { ideal, abre: ideal - meia, fecha: ideal + meia };
}

// Calibração pessoal: aprende com como foi adormecer nos últimos 7 dias.
// facil → aproxima do tempo que funcionou; lutou/chorou depois do meio da faixa → adianta; antes → atrasa.
export function calibrar(sessoes, bebe, agora) {
  const desde = agora - 7 * DIA;
  const ordenadas = [...sessoes].filter((s) => s.inicio != null).sort((x, y) => x.inicio - y.inicio);
  const sinais = [];
  for (let k = 0; k < ordenadas.length; k++) {
    const s = ordenadas[k];
    if (!s.avaliacao || s.inicio < desde || s.inicio > agora) continue;
    const anterior = ordenadas[k - 1];
    if (!anterior || anterior.fim == null || anterior.fim > s.inicio) continue;
    const acordado = (s.inicio - anterior.fim) / MIN;
    const faixa = janelaBase(idadeEmDias(bebe.nascimento, s.inicio, bebe.idadeGestacional));
    const meio = (faixa.min + faixa.max) / 2;
    if (acordado > faixa.max * 1.5) continue;
    if (s.avaliacao === 'facil') sinais.push((acordado - meio) * 0.5);
    else if (acordado > meio) sinais.push(-(acordado - meio) - 5);
    else sinais.push((meio - acordado) * 0.5 + 5);
  }
  if (sinais.length < 3) return 0;
  const media = sinais.reduce((a, b) => a + b, 0) / sinais.length;
  return limitar(Math.round(media), -AJUSTE_MAX, AJUSTE_MAX);
}

// Despertar entre 0h e 5h é da noite; das 5h às 6h, pergunte se o dia começou; depois, é o começo do dia.
export function classificarDespertar(ms) {
  const m = minutosDoDia(ms);
  if (m < 5 * 60) return 'noite';
  if (m < 6 * 60) return 'duvida';
  return 'dia';
}

// O começo do dia: o fim do sono da noite que terminou hoje entre 4h e 11h.
export function inicioDoDiaDe(sessoes, agora) {
  const hoje = inicioDoDiaLocal(agora);
  const candidatos = sessoes
    .filter((s) => s.tipo === 'noite' && s.fim != null && s.fim >= hoje + 4 * 60 * MIN && s.fim <= Math.min(agora, hoje + 11 * 60 * MIN))
    .map((s) => s.fim)
    .sort((a, b) => b - a);
  return candidatos[0] ?? null;
}

function mediana(xs) {
  const v = [...xs].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : Math.round((v[m - 1] + v[m]) / 2);
}

// Duração esperada da soneca de índice i: a mediana das últimas 7 com o mesmo índice, ou a típica da idade.
export function duracaoEsperada(sessoes, dias, indice, total, agora) {
  const desde = agora - 7 * DIA;
  const porDia = new Map();
  for (const s of sessoes) {
    if (s.tipo !== 'soneca' || s.fim == null || s.inicio < desde || s.inicio >= inicioDoDiaLocal(agora)) continue;
    const chave = inicioDoDiaLocal(s.inicio);
    if (!porDia.has(chave)) porDia.set(chave, []);
    porDia.get(chave).push(s);
  }
  const amostras = [];
  for (const lista of porDia.values()) {
    lista.sort((a, b) => a.inicio - b.inicio);
    if (lista[indice]) amostras.push(Math.round((lista[indice].fim - lista[indice].inicio) / MIN));
  }
  return amostras.length >= 3 ? limitar(mediana(amostras), 20, 180) : duracaoTipica(dias, indice, total);
}

// O plano do dia: as sonecas (feitas, em curso e previstas) e a hora de dormir.
export function planoDoDia({ bebe, sessoes = [], agora, inicioDoDia = null }) {
  const dias = idadeEmDias(bebe.nascimento, agora, bebe.idadeGestacional);
  const faixa = janelaBase(dias);
  const ajuste = calibrar(sessoes, bebe, agora);
  const acordou = inicioDoDia ?? inicioDoDiaDe(sessoes, agora);
  const base = { dias, faixa, ajuste, acordou };
  if (acordou == null) return { ...base, total: sonecasAlvo(dias), precisaAcordou: true, itens: [], proxima: null };

  const sonecasHoje = sessoes
    .filter((s) => s.tipo === 'soneca' && s.inicio != null && s.inicio >= acordou && s.inicio <= agora)
    .sort((a, b) => a.inicio - b.inicio);
  const total = Math.max(sonecasAlvo(dias), sonecasHoje.length);

  const itens = [];
  let cursor = acordou;
  let curta = false;
  for (let i = 0; i <= total; i++) {
    const noite = i === total;
    const j = janelaDaVez(faixa, i, total + 1, { curta, ajuste });
    const item = {
      tipo: noite ? 'noite' : 'soneca',
      indice: i,
      acordadoDesde: cursor,
      janela: j.ideal,
      curta,
      previsto: cursor + j.ideal * MIN,
      abre: cursor + j.abre * MIN,
      fecha: cursor + j.fecha * MIN,
    };
    const real = noite ? null : sonecasHoje[i];
    if (real) {
      item.inicio = real.inicio;
      item.fim = real.fim ?? null;
      item.status = real.fim != null ? 'feito' : 'dormindo';
      const dur = real.fim != null ? Math.round((real.fim - real.inicio) / MIN) : duracaoEsperada(sessoes, dias, i, total, agora);
      item.duracao = dur;
      cursor = real.fim ?? real.inicio + dur * MIN;
      curta = real.fim != null && dur < SONECA_CURTA && dias >= 91;
    } else {
      item.status = 'previsto';
      if (!noite) {
        item.duracaoPrevista = duracaoEsperada(sessoes, dias, i, total, agora);
        cursor = item.previsto + item.duracaoPrevista * MIN;
      }
      curta = false;
    }
    itens.push(item);
  }

  const proxima = itens.find((it) => it.status === 'previsto') ?? null;
  const dormir = itens[itens.length - 1];
  const horaDormir = minutosDoDia(dormir.previsto);
  const alertas = [];
  if (dias >= 91 && horaDormir < 18 * 60) alertas.push('dormir-cedo');
  if (dias >= 91 && horaDormir > 21 * 60) alertas.push('dormir-tarde');
  return { ...base, total, itens, proxima, horaDeDormir: dormir.previsto, alertas, dormindo: itens.some((it) => it.status === 'dormindo') };
}

// Em que pé está a próxima janela agora: aguardando, abrindo (15 min antes), aberta ou passou.
export function estadoAgora(plano, agora) {
  if (!plano || plano.precisaAcordou) return { estado: 'sem-dados' };
  if (plano.dormindo) return { estado: 'dormindo' };
  const p = plano.proxima;
  if (!p) return { estado: 'sem-dados' };
  const total = p.previsto - p.acordadoDesde;
  const progresso = limitar((agora - p.acordadoDesde) / total, 0, 1);
  const faltam = Math.round((p.abre - agora) / MIN);
  let estado = 'aguardando';
  if (agora > p.fecha) estado = 'passou';
  else if (agora >= p.abre) estado = 'aberta';
  else if (faltam <= AVISO_ANTES) estado = 'abrindo';
  return { estado, progresso, faltamParaAbrir: Math.max(0, faltam), acordadoHa: Math.round((agora - p.acordadoDesde) / MIN) };
}

// ── textos ──

export function hora(ms) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function duracao(min) {
  const m = Math.max(0, Math.round(min));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
}

export function idadeTexto(dias) {
  if (dias < 14) return `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  if (dias < 56) return `${Math.floor(dias / 7)} semanas`;
  const meses = Math.floor(dias / 30.4375);
  if (meses < 24) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  return '2 anos';
}

// "Por que 12:20?": a conta explicada com os dados do bebê, sem palavras com gênero.
export function explicacao(plano, nome) {
  const p = plano?.proxima;
  if (!p) return '';
  const partes = [
    `Aos ${idadeTexto(plano.dias)}, ${nome} costuma aguentar de ${duracao(plano.faixa.min)} a ${duracao(plano.faixa.max)} entre um sono e outro.`,
  ];
  const origem = p.indice === 0 ? 'Acordou' : 'Acordou da soneca';
  partes.push(`${origem} às ${hora(p.acordadoDesde)}, então a próxima janela abre às ${hora(p.abre)}.`);
  if (p.curta) partes.push('A soneca anterior foi curta, então a janela vem um pouco antes.');
  else if (plano.ajuste) partes.push(`Pelo que você registrou nos últimos dias, o Lume ${plano.ajuste < 0 ? 'adiantou' : 'atrasou'} a janela em ${Math.abs(plano.ajuste)} min.`);
  if (p.tipo === 'noite') partes.push('Esta é a última janela do dia: depois dela vem o sono da noite.');
  return partes.join(' ');
}

// Marcos que começam nos próximos 14 dias ou que estão acontecendo agora.
export function marcosProximos(dias) {
  return MARCOS.filter((m) => dias >= m.de - 14 && dias <= m.ate).map((m) => ({ ...m, agora: dias >= m.de }));
}
