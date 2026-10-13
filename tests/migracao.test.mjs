import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrarDoAppAntigo, CHAVE } from '../Funil CJO/app/migracao.js';

const armazenamento = (dados) => ({ getItem: (k) => (k in dados ? dados[k] : null) });
const em = (a, m, d, h, mi) => new Date(a, m - 1, d, h, mi).getTime();
const AGORA = em(2026, 10, 13, 12, 0);

const ANTIGO = {
  cjo_baby: JSON.stringify({ name: 'Sofia ', birthDate: '2026-05-13', parentName: 'Ana' }),
  cjo_logs: JSON.stringify([
    { id: '1', type: 'night', date: '2026-10-12', start: '19:30', end: '06:40' },
    { id: '2', type: 'nap', date: '2026-10-12', start: '09:00', end: '10:10' },
    { id: '3', type: 'nap', date: 'quebrado', start: '9', end: '10' },
  ]),
  cjo_lw: '2026-10-13T07:00:00',
  cjo_sc: JSON.stringify({ '2026-10-12': 4 }),
  cjo_cl: JSON.stringify({ '0-3m': { a1: true } }),
  cjo_env: JSON.stringify({ c: { blackout: true }, d: '2026-10-12' }),
  cjo_c14: JSON.stringify({ c: { 1: true }, s: '2026-10-10' }),
};

test('migra bebê, registros, último despertar, notas e checklists', () => {
  const novo = migrarDoAppAntigo(armazenamento(ANTIGO), AGORA);
  assert.deepEqual(novo.bebe, { nome: 'Sofia', nascimento: '2026-05-13', idadeGestacional: 40 });
  assert.equal(novo.responsavel, 'Ana');
  assert.equal(novo.sessoes.length, 3, '2 registros válidos + o despertar de hoje; o quebrado fica de fora');
  const noite = novo.sessoes.find((s) => s.id === 'antigo-1');
  assert.equal(noite.tipo, 'noite');
  assert.equal(noite.fim, em(2026, 10, 13, 6, 40), 'noite que cruza a meia-noite termina no dia seguinte');
  assert.equal(novo.sessoes.find((s) => s.id === 'antigo-2').tipo, 'soneca');
  const despertar = novo.sessoes.find((s) => s.inicio === null);
  assert.equal(despertar.fim, em(2026, 10, 13, 7, 0));
  assert.deepEqual(novo.notas, { '2026-10-12': 4 });
  assert.deepEqual(novo.legado.ambiente, { blackout: true });
  assert.deepEqual(novo.legado.desafio14, { 1: true });
});

test('não migra de novo nem inventa perfil', () => {
  assert.equal(migrarDoAppAntigo(armazenamento({ ...ANTIGO, [CHAVE]: '{"versao":1}' }), AGORA), null);
  assert.equal(migrarDoAppAntigo(armazenamento({}), AGORA), null);
  assert.equal(migrarDoAppAntigo(armazenamento({ cjo_baby: 'não é json' }), AGORA), null);
});

test('"Mamãe" padrão do app antigo não vira nome da responsável', () => {
  const novo = migrarDoAppAntigo(armazenamento({ ...ANTIGO, cjo_baby: JSON.stringify({ name: 'Theo', birthDate: '2026-01-02', parentName: 'Mamãe' }) }), AGORA);
  assert.equal(novo.responsavel, '');
});
