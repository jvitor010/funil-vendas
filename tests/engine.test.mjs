import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN, DIA, ANCORAS, idadeEmDias, janelaBase, sonecasAlvo, janelaDaVez, calibrar, classificarDespertar,
  inicioDoDiaDe, planoDoDia, estadoAgora, hora, duracao, idadeTexto, explicacao, marcosProximos,
} from '../Funil CJO/app/engine.js';

// Datas sempre no fuso local, como o app usa.
const em = (a, m, d, h = 0, mi = 0) => new Date(a, m - 1, d, h, mi).getTime();
const HOJE = (h, mi = 0) => em(2026, 10, 13, h, mi);
const SOFIA = { nome: 'Sofia', nascimento: '2026-05-13', idadeGestacional: 40 };
const noite = (inicio, fim, extra = {}) => ({ tipo: 'noite', inicio, fim, ...extra });
const soneca = (inicio, fim, extra = {}) => ({ tipo: 'soneca', inicio, fim, ...extra });

test('idade em dias, com correção de prematuro até os 24 meses', () => {
  assert.equal(idadeEmDias('2026-05-13', HOJE(12)), 153);
  assert.equal(idadeEmDias('2026-05-13', HOJE(12), 36), 153 - 28);
  assert.equal(idadeEmDias('2026-10-20', HOJE(12)), 0, 'data futura não dá idade negativa');
  assert.equal(idadeEmDias('2024-01-01', HOJE(12), 30), idadeEmDias('2024-01-01', HOJE(12)), 'depois dos 24 meses não corrige');
});

test('janela base bate com a tabela do método nas âncoras e interpola entre elas', () => {
  for (const a of ANCORAS) assert.deepEqual(janelaBase(a.dias), { min: a.janela[0], max: a.janela[1] });
  const meio = janelaBase(137);
  assert.ok(meio.min > 90 && meio.min < 120 && meio.max > 120 && meio.max < 135);
  assert.deepEqual(janelaBase(5000), { min: 330, max: 420 });
});

test('sonecas por dia seguem a faixa da idade', () => {
  assert.equal(sonecasAlvo(10), 6);
  assert.equal(sonecasAlvo(153), 3);
  assert.equal(sonecasAlvo(260), 2);
  assert.equal(sonecasAlvo(400), 1);
  assert.ok(sonecasAlvo(900) >= 1);
});

test('janelas crescem ao longo do dia e a última chega ao máximo', () => {
  const f = janelaBase(153);
  const js = [0, 1, 2, 3].map((i) => janelaDaVez(f, i, 4).ideal);
  for (let i = 1; i < js.length; i++) assert.ok(js[i] > js[i - 1]);
  assert.equal(js[3], f.max);
  assert.ok(js[0] >= f.min);
});

test('ajuste pessoal nunca tira a janela da faixa da idade', () => {
  const f = janelaBase(153);
  assert.equal(janelaDaVez(f, 3, 4, { ajuste: 60 }).ideal, f.max);
  assert.equal(janelaDaVez(f, 0, 4, { ajuste: -60 }).ideal, f.min);
});

test('soneca curta encurta a janela seguinte, sem passar de 85% do mínimo', () => {
  const f = janelaBase(153);
  const normal = janelaDaVez(f, 1, 4).ideal;
  const curta = janelaDaVez(f, 1, 4, { curta: true }).ideal;
  assert.ok(curta < normal);
  assert.ok(curta >= Math.round(f.min * 0.85));
});

test('faixa de abertura tem de 5 a 20 min para cada lado', () => {
  const j = janelaDaVez(janelaBase(153), 1, 4);
  assert.ok(j.ideal - j.abre >= 5 && j.ideal - j.abre <= 20);
  assert.equal(j.fecha - j.ideal, j.ideal - j.abre);
});

test('despertar de madrugada não começa o dia', () => {
  assert.equal(classificarDespertar(HOJE(3, 10)), 'noite');
  assert.equal(classificarDespertar(HOJE(5, 30)), 'duvida');
  assert.equal(classificarDespertar(HOJE(6, 45)), 'dia');
});

test('o dia começa no fim do sono da noite, mesmo cruzando a meia-noite', () => {
  const sessoes = [noite(em(2026, 10, 12, 19, 0), HOJE(6, 30))];
  assert.equal(inicioDoDiaDe(sessoes, HOJE(9)), HOJE(6, 30));
  assert.equal(inicioDoDiaDe([noite(em(2026, 10, 12, 19), HOJE(2))], HOJE(9)), null, 'acordar às 2h não é começo de dia');
});

test('sem a hora em que acordou, o plano pede esse dado', () => {
  const p = planoDoDia({ bebe: SOFIA, sessoes: [], agora: HOJE(9) });
  assert.equal(p.precisaAcordou, true);
  assert.equal(estadoAgora(p, HOJE(9)).estado, 'sem-dados');
});

test('plano da Sofia: acordou às 7h, soneca 1 das 9:05 às 10:15, agora são 12h', () => {
  const sessoes = [noite(em(2026, 10, 12, 19), HOJE(7)), soneca(HOJE(9, 5), HOJE(10, 15))];
  const p = planoDoDia({ bebe: SOFIA, sessoes, agora: HOJE(12) });
  assert.equal(p.total, 3);
  assert.equal(p.itens.length, 4, '3 sonecas e a noite');
  assert.equal(p.itens[0].status, 'feito');
  assert.equal(p.itens[0].duracao, 70);
  assert.equal(p.proxima.indice, 1);
  const ideal = hora(p.proxima.previsto);
  assert.ok(ideal >= '12:15' && ideal <= '12:30', `próxima janela às ${ideal}`);
  assert.equal(p.itens[3].tipo, 'noite');
  const dormir = hora(p.horaDeDormir);
  assert.ok(dormir >= '18:00' && dormir <= '19:30', `dormir às ${dormir}`);
  const e = estadoAgora(p, HOJE(12));
  assert.equal(e.estado, 'aguardando');
  assert.ok(e.progresso > 0.75 && e.progresso < 0.9);
});

test('estado da janela: abrindo, aberta e passou', () => {
  const sessoes = [noite(em(2026, 10, 12, 19), HOJE(7)), soneca(HOJE(9, 5), HOJE(10, 15))];
  const p = planoDoDia({ bebe: SOFIA, sessoes, agora: HOJE(12) });
  assert.equal(estadoAgora(p, p.abre - 10 * MIN).estado, 'aguardando');
  assert.equal(estadoAgora(p, p.proxima.abre - 10 * MIN).estado, 'abrindo');
  assert.equal(estadoAgora(p, p.proxima.previsto).estado, 'aberta');
  assert.equal(estadoAgora(p, p.proxima.fecha + MIN).estado, 'passou');
});

test('soneca em andamento deixa o estado como dormindo', () => {
  const sessoes = [noite(em(2026, 10, 12, 19), HOJE(7)), soneca(HOJE(9, 5), null)];
  const p = planoDoDia({ bebe: SOFIA, sessoes, agora: HOJE(9, 40) });
  assert.equal(p.itens[0].status, 'dormindo');
  assert.equal(estadoAgora(p, HOJE(9, 40)).estado, 'dormindo');
});

test('soneca curta antecipa a próxima janela no plano', () => {
  const base = [noite(em(2026, 10, 12, 19), HOJE(7))];
  const longa = planoDoDia({ bebe: SOFIA, sessoes: [...base, soneca(HOJE(9, 5), HOJE(10, 15))], agora: HOJE(10, 20) });
  const curta = planoDoDia({ bebe: SOFIA, sessoes: [...base, soneca(HOJE(9, 5), HOJE(9, 35))], agora: HOJE(9, 40) });
  assert.equal(curta.proxima.curta, true);
  assert.ok(curta.proxima.janela < longa.proxima.janela);
});

test('calibração precisa de 3 registros e fica entre -15 e +15 min', () => {
  const sessoes = [];
  for (let d = 1; d <= 6; d++) {
    const dia = (h, mi) => HOJE(h, mi) - d * DIA;
    sessoes.push(noite(dia(-5, 0), dia(7, 0)));
    sessoes.push(soneca(dia(10, 0), dia(11, 0), { avaliacao: 'chorou' }));
  }
  const ajuste = calibrar(sessoes, SOFIA, HOJE(12));
  assert.ok(ajuste < 0, 'acordada 3h e chorando: adianta');
  assert.ok(ajuste >= -15);
  assert.equal(calibrar(sessoes.slice(0, 4), SOFIA, HOJE(12)), 0, 'com 2 registros não ajusta');
});

test('textos: hora, duração, idade e explicação sem gênero', () => {
  assert.equal(hora(HOJE(7, 5)), '07:05');
  assert.equal(duracao(45), '45 min');
  assert.equal(duracao(135), '2h15');
  assert.equal(duracao(120), '2h');
  assert.equal(idadeTexto(10), '10 dias');
  assert.equal(idadeTexto(35), '5 semanas');
  assert.equal(idadeTexto(153), '5 meses');
  const sessoes = [noite(em(2026, 10, 12, 19), HOJE(7)), soneca(HOJE(9, 5), HOJE(10, 15))];
  const t = explicacao(planoDoDia({ bebe: SOFIA, sessoes, agora: HOJE(12) }), 'Sofia');
  assert.match(t, /^Aos 5 meses, Sofia costuma aguentar de 2h(0\d)? a 2h1\d entre um sono e outro\./);
  assert.match(t, /Acordou da soneca às 10:15/);
  assert.doesNotMatch(t, /acordada|acordado|\bela\b|\bele\b/);
});

test('marcos avisam até 14 dias antes', () => {
  assert.deepEqual(marcosProximos(95).map((m) => m.id), ['regressao-4m']);
  assert.equal(marcosProximos(95)[0].agora, false);
  assert.equal(marcosProximos(110)[0].agora, true);
  assert.deepEqual(marcosProximos(60), []);
});
