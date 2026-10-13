// Lume · app (Fase 2, base): primeiro acesso, tela Hoje com o motor de previsão, registro com um toque,
// correção de horários, despertar de madrugada, migração do app antigo, tema automático e offline.
// Login, sincronização na nuvem e avisos no celular entram na Fase 3.
import { planoDoDia, estadoAgora, explicacao, hora, duracao, idadeTexto, classificarDespertar, marcosProximos, MIN } from './engine.js';
import { migrarDoAppAntigo, CHAVE } from './migracao.js';

const app = document.getElementById('app');
const sheet = document.getElementById('sheet');
const toast = document.getElementById('toast');
const DEMO = new URLSearchParams(location.search).has('demo');

const ICONES = {
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  lua: '<path d="M19.5 14.6A7.5 7.5 0 0 1 9.4 4.5a7.5 7.5 0 1 0 10.1 10.1z"/>',
  sino: '<path d="M6.5 16.5v-5a5.5 5.5 0 0 1 11 0v5l1.5 2h-14z"/><path d="M10 21h4"/>',
  check: '<path d="M5 12.5 9.5 17 19 7.5"/>',
  porque: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.4"/>',
  programa: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8.5 3v4M15.5 3v4"/>',
};
const ic = (n, sm = false) => `<svg class="lu-icone${sm ? ' lu-icone--sm' : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[n]}</svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dataLocal = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ── estado ──
let ui = { porque: false };
let estado = carregar();

function estadoDemo() {
  const agora = Date.now();
  const acordou = agora - 300 * MIN;
  return {
    versao: 1,
    demo: true,
    bebe: { nome: 'Sofia', nascimento: dataLocal(agora - 153 * 86400000), idadeGestacional: 40 },
    diaComecou: { data: dataLocal(agora), em: acordou },
    sessoes: [
      { id: 'd1', tipo: 'noite', inicio: acordou - 690 * MIN, fim: acordou },
      { id: 'd2', tipo: 'soneca', inicio: acordou + 125 * MIN, fim: acordou + 195 * MIN },
    ],
    notas: {},
  };
}

function carregar() {
  if (DEMO) return estadoDemo();
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo?.bebe) return salvo;
    const migrado = migrarDoAppAntigo(localStorage);
    if (migrado) {
      localStorage.setItem(CHAVE, JSON.stringify(migrado));
      setTimeout(() => avisar(`Trouxemos ${migrado.sessoes.length} registros do app antigo.`), 600);
      return migrado;
    }
  } catch {
    // Sem acesso ao armazenamento (janela anônima): o app funciona, mas não guarda.
  }
  return { versao: 1, bebe: null, sessoes: [], notas: {} };
}

function salvar() {
  if (DEMO) return;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    avisar('Não foi possível salvar neste aparelho.');
  }
}

const sessaoAberta = () => estado.sessoes.find((s) => s.inicio != null && s.fim == null) || null;
const inicioDeHoje = (agora) => (estado.diaComecou?.data === dataLocal(agora) ? estado.diaComecou.em : null);
const planoAtual = (agora = Date.now()) => planoDoDia({ bebe: estado.bebe, sessoes: estado.sessoes, agora, inicioDoDia: inicioDeHoje(agora) });

function registrarInicioDoDia(ms) {
  estado.diaComecou = { data: dataLocal(ms), em: ms };
  if (!estado.sessoes.some((s) => s.fim === ms)) estado.sessoes.push({ id: novoId(), tipo: 'noite', inicio: null, fim: ms, marcador: true });
}

// ── avisos rápidos e sheet ──
let tempoToast;
function avisar(texto) {
  toast.textContent = texto;
  toast.hidden = false;
  clearTimeout(tempoToast);
  tempoToast = setTimeout(() => { toast.hidden = true; }, 3500);
}

function abrirSheet(html) {
  toast.hidden = true;
  sheet.innerHTML = `<div class="sheet__caixa" role="dialog" aria-modal="true"><span class="sheet__alca" aria-hidden="true"></span>${html}</div>`;
  sheet.hidden = false;
  sheet.querySelector('input, button')?.focus();
}
function fecharSheet() {
  sheet.hidden = true;
  sheet.innerHTML = '';
}
sheet.addEventListener('click', (e) => {
  if (e.target === sheet) fecharSheet();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !sheet.hidden) fecharSheet();
});

// Hora "HH:MM" de hoje; se ficar no futuro, é de ontem.
function horaParaMs(hhmm, referencia = Date.now()) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(referencia);
  d.setHours(h, m, 0, 0);
  return d.getTime() > referencia + MIN ? d.getTime() - 86400000 : d.getTime();
}

// ── telas ──
function aplicarTema() {
  const h = new Date().getHours();
  const tema = h >= 21 || h < 6 ? 'madrugada' : 'anoitecer';
  document.documentElement.dataset.theme = tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'madrugada' ? '#0d0705' : '#141c3b');
}

function renderInicio() {
  app.innerHTML = `<div class="tela"><div class="tela__corpo inicio">
  <div class="inicio__marca"><img src="/app/icones/icone-192.png" alt="" width="48" height="48"><span class="inicio__nome">lume</span></div>
  <div><h1 class="titulo-1">Vamos montar o plano do seu bebê</h1>
  <p class="chamada cinza" style="margin-top: var(--space-2)">Com o nome e a data de nascimento, o Lume já calcula a próxima janela de sono.</p></div>
  <form class="form" id="form-inicio" novalidate>
    <label class="campo"><span class="rotulo campo__rotulo">Nome do bebê</span><input id="f-nome" type="text" autocomplete="off" maxlength="40" required></label>
    <label class="campo"><span class="rotulo campo__rotulo">Data de nascimento</span><input id="f-nasc" type="date" required max="${dataLocal(Date.now())}"></label>
    <label class="marcar"><input id="f-prem" type="checkbox"><span class="corpo">Nasceu antes de 37 semanas</span></label>
    <label class="campo" id="campo-semanas" hidden><span class="rotulo campo__rotulo">Com quantas semanas nasceu?</span><input id="f-semanas" type="number" inputmode="numeric" min="24" max="36" value="34"></label>
    <p class="nota erro" id="f-erro" hidden></p>
    <button class="lu-btn lu-btn--primario lu-btn--bloco destaque" type="submit">Começar</button>
    <p class="nota cinza">Por enquanto, os dados ficam só neste aparelho. Quando você entrar com o e-mail da compra, eles passam a ficar salvos na sua conta.</p>
  </form></div></div>`;
  const prem = document.getElementById('f-prem');
  prem.addEventListener('change', () => { document.getElementById('campo-semanas').hidden = !prem.checked; });
  document.getElementById('form-inicio').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('f-nome').value.trim();
    const nasc = document.getElementById('f-nasc').value;
    const erro = document.getElementById('f-erro');
    const idade = (Date.now() - new Date(`${nasc}T12:00`).getTime()) / 86400000;
    let msg = '';
    if (!nome) msg = 'Escreva o nome do bebê.';
    else if (!nasc) msg = 'Escolha a data de nascimento.';
    else if (idade < -1) msg = 'A data de nascimento está no futuro.';
    else if (idade > 3 * 365) msg = 'O Lume foi feito para bebês de até 2 anos.';
    if (msg) {
      erro.textContent = msg;
      erro.hidden = false;
      return;
    }
    const semanas = prem.checked ? Math.min(36, Math.max(24, Number(document.getElementById('f-semanas').value) || 34)) : 40;
    estado.bebe = { nome, nascimento: nasc, idadeGestacional: semanas };
    salvar();
    render();
  });
}

function cabecalho(plano, agora) {
  const dia = new Date(agora).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return `<header class="cab"><div><p class="legenda cinza">${esc(dia)}</p><h1 class="titulo-grande">Hoje</h1></div>
  <span class="legenda chip">${esc(estado.bebe.nome)} · ${esc(idadeTexto(plano.dias))}</span></header>`;
}

function cartao(plano, st, agora) {
  const nome = esc(estado.bebe.nome);
  const aberta = sessaoAberta();
  if (aberta) {
    const minutos = Math.round((agora - aberta.inicio) / MIN);
    const titulo = aberta.tipo === 'noite' ? 'Sono da noite' : `Soneca ${plano.itens.findIndex((i) => i.status === 'dormindo') + 1 || ''}`.trim();
    const despertares = (aberta.despertares || []).length;
    return `<article class="lu-janela" aria-label="Sono em andamento"><span class="lu-janela__sol" aria-hidden="true"></span>
    <p class="rotulo lu-janela__rotulo">${esc(titulo)} em andamento</p><p class="relogio lu-janela__hora">${duracao(minutos)}</p>
    <p class="subtitulo lu-janela__faixa">Dormiu às ${hora(aberta.inicio)}${despertares ? ` · ${despertares} ${despertares === 1 ? 'despertar' : 'despertares'}` : ''}</p>
    <div class="lu-janela__rodape"><span class="lu-selo lu-selo--bom legenda">${ic('lua', true)}Dormindo</span></div></article>`;
  }
  if (plano.precisaAcordou) {
    return `<article class="lu-janela" aria-label="Começo do dia"><span class="lu-janela__sol" aria-hidden="true"></span>
    <p class="rotulo lu-janela__rotulo">Para montar o dia</p><p class="titulo-1 lu-janela__titulo">Que horas ${nome} acordou hoje?</p>
    <p class="subtitulo lu-janela__faixa">Toque em Acordou quando acontecer, ou escolha a hora.</p>
    <div class="lu-janela__acoes"><button class="lu-btn lu-btn--suave destaque" type="button" data-acao="escolher-acordou">Escolher a hora</button></div></article>`;
  }
  const p = plano.proxima;
  const rotulo = p.tipo === 'noite' ? `Hora de dormir de ${nome}` : `Próxima janela de ${nome}`;
  const direita = {
    aguardando: `abre em ${duracao(st.faltamParaAbrir)}`,
    abrindo: `abre em ${st.faltamParaAbrir} min`,
    aberta: `aberta até ${hora(p.fecha)}`,
    passou: `fechou às ${hora(p.fecha)}`,
  }[st.estado];
  const selo = {
    aguardando: `<span class="lu-selo legenda">${ic('sino', true)}Abre às ${hora(p.abre)}</span>`,
    abrindo: `<span class="lu-selo legenda">${ic('sino', true)}Prepare o ritual</span>`,
    aberta: `<span class="lu-selo lu-selo--bom legenda">${ic('check', true)}Janela aberta</span>`,
    passou: `<span class="lu-selo lu-selo--atencao legenda">${ic('sino', true)}Passou da janela</span>`,
  }[st.estado];
  return `<article class="lu-janela" aria-label="Próxima janela de sono"><span class="lu-janela__sol" aria-hidden="true"></span>
  <p class="rotulo lu-janela__rotulo">${rotulo}</p><p class="relogio lu-janela__hora">${hora(p.previsto)}</p>
  <p class="subtitulo lu-janela__faixa">entre ${hora(p.abre)} e ${hora(p.fecha)}</p>
  <div class="lu-janela__progresso"><div class="lu-progresso lu-progresso--ceu" style="--p:${st.progresso.toFixed(3)}" role="progressbar" aria-label="Tempo acordado até a janela" aria-valuenow="${Math.round(st.progresso * 100)}" aria-valuemin="0" aria-valuemax="100"><div class="lu-progresso__valor"></div></div>
  <div class="lu-janela__legenda nota"><span>Acordou há ${duracao(st.acordadoHa)}</span><span>${direita}</span></div></div>
  <div class="lu-janela__rodape">${selo}<button class="lu-janela__porque destaque" type="button" data-acao="porque" aria-expanded="${ui.porque}">Por que ${hora(p.previsto)}?</button></div></article>`;
}

function dicas(plano, st) {
  let html = '';
  if (st.estado === 'passou') {
    html += `<aside class="lu-dica"><span class="lu-dica__icone">${ic('porque', true)}</span><p class="destaque lu-dica__titulo">Ainda dá tempo</p>
    <p class="chamada lu-dica__texto">Comece agora o ritual mais calmo: luz baixa, voz baixa e berço. O próximo horário se ajusta sozinho.</p></aside>`;
  }
  if (ui.porque && plano.proxima) {
    html += `<aside class="lu-dica" id="porque"><span class="lu-dica__icone">${ic('porque', true)}</span><p class="destaque lu-dica__titulo">Por que ${hora(plano.proxima.previsto)}?</p>
    <p class="chamada lu-dica__texto">${esc(explicacao(plano, estado.bebe.nome))}</p></aside>`;
  }
  const m = marcosProximos(plano.dias)[0];
  if (m) {
    html += `<aside class="lu-dica"><span class="lu-dica__icone">${ic('programa', true)}</span><p class="destaque lu-dica__titulo">${esc(m.titulo)}</p>
    <p class="chamada lu-dica__texto">${esc(m.texto)}${m.agora ? '' : ' Pode começar nas próximas 2 semanas.'}</p></aside>`;
  }
  return html;
}

function linhaDoTempo(plano, st) {
  if (plano.precisaAcordou) return '';
  const linhas = [`<li class="lu-tempo__item lu-tempo__item--feito"><span class="subtitulo lu-tempo__hora">${hora(plano.acordou)}</span><span class="corpo lu-tempo__titulo">Acordou</span><span class="nota lu-tempo__estado">Feito</span></li>`];
  for (const it of plano.itens) {
    const titulo = it.tipo === 'noite' ? 'Hora de dormir' : `Soneca ${it.indice + 1}`;
    let classe = 'previsto';
    let quando = it.previsto;
    let texto = 'Prevista';
    if (it.status === 'feito') {
      classe = 'feito';
      quando = it.inicio;
      texto = `Dormiu ${duracao(it.duracao)}`;
    } else if (it.status === 'dormindo') {
      classe = 'agora';
      quando = it.inicio;
      texto = 'Dormindo';
    } else if (it === plano.proxima) {
      classe = 'agora';
      texto = st.estado === 'aberta' || st.estado === 'abrindo' ? 'Agora' : 'Próxima';
    }
    linhas.push(`<li class="lu-tempo__item lu-tempo__item--${classe}"><span class="subtitulo lu-tempo__hora">${hora(quando)}</span><span class="corpo lu-tempo__titulo">${titulo}</span><span class="nota lu-tempo__estado">${texto}</span></li>`);
  }
  return `<section aria-label="Plano do dia"><p class="rotulo lu-lista__titulo">Plano de hoje</p><ol class="lu-tempo">${linhas.join('')}</ol></section>`;
}

function registro() {
  return `<div class="lu-registro"><div class="lu-registro__botoes">
  <button class="lu-btn lu-btn--primario destaque" type="button" data-acao="acordou">${ic('sol')}Acordou</button>
  <button class="lu-btn lu-btn--ceu destaque" type="button" data-acao="dormiu">${ic('lua')}Dormiu</button></div>
  <button class="lu-btn lu-btn--texto destaque" type="button" data-acao="corrigir">Corrigir o último registro</button></div>`;
}

function render() {
  aplicarTema();
  if (!estado.bebe) return renderInicio();
  const agora = Date.now();
  const plano = planoAtual(agora);
  const st = estadoAgora(plano, agora);
  app.innerHTML = `<div class="tela"><div class="tela__corpo">${cabecalho(plano, agora)}${cartao(plano, st, agora)}${dicas(plano, st)}${linhaDoTempo(plano, st)}</div>
  <div class="tela__pe">${registro()}</div></div>`;
}

// ── ações ──
function acordou() {
  const agora = Date.now();
  const nome = estado.bebe.nome;
  const aberta = sessaoAberta();
  if (aberta) {
    const quando = classificarDespertar(agora);
    if (aberta.tipo === 'noite' && quando === 'noite') {
      aberta.despertares = [...(aberta.despertares || []), agora];
      salvar();
      avisar(`Despertar das ${hora(agora)} registrado. A noite continua.`);
      return render();
    }
    if (aberta.tipo === 'noite' && quando === 'duvida') return perguntarSeComecou(aberta, agora);
    aberta.fim = agora;
    if (aberta.tipo === 'noite') registrarInicioDoDia(agora);
    salvar();
    avisar(`${nome} acordou às ${hora(agora)}.`);
    return render();
  }
  if (!inicioDeHoje(agora) && planoAtual(agora).precisaAcordou && classificarDespertar(agora) !== 'noite') {
    registrarInicioDoDia(agora);
    salvar();
    avisar(`Bom dia! O plano começa às ${hora(agora)}.`);
    return render();
  }
  avisar('Não há sono em andamento. Para mudar um horário, toque em Corrigir o último registro.');
}

function perguntarSeComecou(aberta, agora) {
  abrirSheet(`<p class="titulo-2">São ${hora(agora)}. O dia começou?</p>
  <p class="chamada cinza">Se for só um despertar, o Lume continua contando a noite.</p>
  <button class="lu-btn lu-btn--primario lu-btn--bloco destaque" type="button" data-sheet="comecou">Sim, começou o dia</button>
  <button class="lu-btn lu-btn--suave lu-btn--bloco destaque" type="button" data-sheet="despertar">Não, foi um despertar</button>`);
  sheet.onclick = (e) => {
    const b = e.target.closest('[data-sheet]');
    if (!b) return;
    if (b.dataset.sheet === 'comecou') {
      aberta.fim = agora;
      registrarInicioDoDia(agora);
      avisar(`Bom dia! O plano começa às ${hora(agora)}.`);
    } else {
      aberta.despertares = [...(aberta.despertares || []), agora];
      avisar(`Despertar das ${hora(agora)} registrado.`);
    }
    salvar();
    fecharSheet();
    sheet.onclick = null;
    render();
  };
}

function dormiu() {
  const agora = Date.now();
  const aberta = sessaoAberta();
  if (aberta) return avisar(`Já está registrado: dormiu às ${hora(aberta.inicio)}.`);
  const h = new Date(agora).getHours();
  const plano = estado.bebe ? planoAtual(agora) : null;
  const pertoDaNoite = plano?.horaDeDormir && agora >= plano.horaDeDormir - 90 * MIN;
  const tipo = h < 5 || h >= 19 || pertoDaNoite ? 'noite' : 'soneca';
  estado.sessoes.push({ id: novoId(), tipo, inicio: agora, fim: null });
  salvar();
  avisar(tipo === 'noite' ? `Boa noite. O sono da noite começou às ${hora(agora)}.` : `Soneca começou às ${hora(agora)}.`);
  render();
}

function escolherAcordou() {
  abrirSheet(`<p class="titulo-2">Que horas ${esc(estado.bebe.nome)} acordou?</p>
  <label class="campo"><span class="rotulo campo__rotulo">Hora</span><input id="s-hora" type="time" value="${hora(Date.now())}"></label>
  <button class="lu-btn lu-btn--primario lu-btn--bloco destaque" type="button" data-sheet="salvar">Salvar</button>`);
  sheet.onclick = (e) => {
    if (!e.target.closest('[data-sheet="salvar"]')) return;
    const v = document.getElementById('s-hora').value;
    if (!v) return;
    registrarInicioDoDia(horaParaMs(v));
    salvar();
    fecharSheet();
    sheet.onclick = null;
    render();
  };
}

function corrigir() {
  const ultima = [...estado.sessoes].filter((s) => !s.marcador && s.inicio != null).sort((a, b) => b.inicio - a.inicio)[0];
  if (!ultima) return avisar('Ainda não há registros para corrigir.');
  const nomeSessao = ultima.tipo === 'noite' ? 'Sono da noite' : 'Soneca';
  abrirSheet(`<p class="titulo-2">${nomeSessao}</p>
  <label class="campo"><span class="rotulo campo__rotulo">Dormiu às</span><input id="s-ini" type="time" value="${hora(ultima.inicio)}"></label>
  ${ultima.fim != null ? `<label class="campo"><span class="rotulo campo__rotulo">Acordou às</span><input id="s-fim" type="time" value="${hora(ultima.fim)}"></label>` : ''}
  <button class="lu-btn lu-btn--primario lu-btn--bloco destaque" type="button" data-sheet="salvar">Salvar</button>
  <button class="lu-btn lu-btn--texto destaque" type="button" data-sheet="apagar">Apagar este registro</button>`);
  sheet.onclick = (e) => {
    const b = e.target.closest('[data-sheet]');
    if (!b) return;
    if (b.dataset.sheet === 'apagar') {
      estado.sessoes = estado.sessoes.filter((s) => s !== ultima);
      avisar('Registro apagado.');
    } else {
      const ini = document.getElementById('s-ini').value;
      const fim = document.getElementById('s-fim')?.value;
      if (ini) ultima.inicio = horaParaMs(ini, ultima.inicio + 12 * 60 * MIN);
      if (fim) {
        let f = horaParaMs(fim, ultima.fim + 12 * 60 * MIN);
        if (f <= ultima.inicio) f += 86400000;
        ultima.fim = f;
      }
      avisar('Horários corrigidos.');
    }
    salvar();
    fecharSheet();
    sheet.onclick = null;
    render();
  };
}

app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-acao]');
  if (!b) return;
  const acao = b.dataset.acao;
  if (acao === 'acordou') acordou();
  else if (acao === 'dormiu') dormiu();
  else if (acao === 'escolher-acordou') escolherAcordou();
  else if (acao === 'corrigir') corrigir();
  else if (acao === 'porque') {
    ui.porque = !ui.porque;
    render();
    if (ui.porque) document.getElementById('porque')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

// Atualiza o relógio a cada 30 s e quando o app volta para a frente, sem atrapalhar formulário ou sheet abertos.
const atualizar = () => {
  if (estado.bebe && sheet.hidden) render();
};
setInterval(atualizar, 30000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) atualizar();
});

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/lume-sw.js', { scope: '/app' }).catch(() => {});
}
