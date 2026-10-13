// Fluxos das funções /api com Firestore, OAuth e Brevo simulados em memória (sem rede).
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { paraFirestore, deFirestore } from '../api/_lib/google.js';

const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({ project_id: 'lume-teste', client_email: 'sa@lume-teste.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }), private_key_id: 'k1' });
process.env.LASTLINK_TOKEN_LUME = 'segredo';
process.env.LUME_PLANOS = JSON.stringify({ CANUAL01: { plano: 'anual', dias: 365 } });
process.env.BREVO_API_KEY = 'x';
process.env.BREVO_REMETENTE_EMAIL = 'ola@lume.app';

let banco;
let emails;
const RAIZ = '/v1/projects/lume-teste/databases/(default)/documents/';

globalThis.fetch = async (url, opcoes = {}) => {
  const u = new URL(url);
  const resposta = (status, corpo) => ({ ok: status < 300, status, text: async () => (corpo == null ? '' : JSON.stringify(corpo)), json: async () => corpo });
  if (u.host === 'oauth2.googleapis.com') return resposta(200, { access_token: 't', expires_in: 3600 });
  if (u.host === 'api.brevo.com') {
    emails.push(JSON.parse(opcoes.body));
    return resposta(201, {});
  }
  const caminho = decodeURIComponent(u.pathname.slice(RAIZ.length));
  const metodo = opcoes.method || 'GET';
  if (metodo === 'GET') return banco.has(caminho) ? resposta(200, { fields: banco.get(caminho) }) : resposta(404, {});
  if (metodo === 'PATCH') {
    const campos = JSON.parse(opcoes.body).fields;
    banco.set(caminho, { ...(banco.get(caminho) || {}), ...campos });
    return resposta(200, { fields: banco.get(caminho) });
  }
  if (metodo === 'POST') {
    const id = `${caminho}/${u.searchParams.get('documentId')}`;
    if (banco.has(id)) return resposta(409, {});
    banco.set(id, JSON.parse(opcoes.body).fields);
    return resposta(200, {});
  }
  if (metodo === 'DELETE') {
    banco.delete(caminho);
    return resposta(200, {});
  }
  throw new Error(`chamada inesperada ${metodo} ${url}`);
};

const ler = (p) => (banco.has(p) ? deFirestore({ mapValue: { fields: banco.get(p) } }) : null);
const chamar = async (handler, { method = 'POST', headers = {}, body = {}, query = {} } = {}) => {
  let status = 0;
  let dados = null;
  const res = { status(s) { status = s; return this; }, json(d) { dados = d; return this; } };
  await handler({ method, headers, body, query }, res);
  return { status, dados };
};
const compra = (Event, PaymentId = 'pay_1') => ({ Event, Data: { Buyer: { Email: 'Ana@Exemplo.com', Name: 'Ana' }, Products: [{ Id: 'CANUAL01', Name: 'Lume Anual' }], Purchase: { PaymentId } } });

const { default: webhook } = await import('../api/lastlink-webhook-cjo.js');
const { default: authCode } = await import('../api/auth-code.js');

beforeEach(() => {
  banco = new Map();
  emails = [];
});

test('webhook recusa sem token', async () => {
  const r = await chamar(webhook, { body: compra('Purchase_Order_Confirmed') });
  assert.equal(r.status, 401);
});

test('compra ativa o acesso; o mesmo aviso de novo não soma dias; estorno corta', async () => {
  const h = { 'x-lastlink-token': 'segredo' };
  const r1 = await chamar(webhook, { headers: h, body: compra('Purchase_Order_Confirmed') });
  assert.equal(r1.status, 200);
  assert.equal(r1.dados.status, 'ativo');
  const d1 = ler('entitlements/ana@exemplo.com');
  assert.equal(d1.plano, 'anual');
  const r2 = await chamar(webhook, { headers: h, body: compra('Purchase_Order_Confirmed') });
  assert.equal(r2.dados.duplicado, true);
  assert.equal(ler('entitlements/ana@exemplo.com').pagoAte.getTime(), d1.pagoAte.getTime());
  const r3 = await chamar(webhook, { headers: h, body: compra('Purchase_Request_Refunded', 'pay_1') });
  assert.equal(r3.dados.status, 'estornado');
});

test('produto de outro funil é ignorado', async () => {
  const outro = { Event: 'Purchase_Order_Confirmed', Data: { Buyer: { Email: 'x@y.com' }, Products: [{ Id: 'CMELASMA', Name: 'Código Xô Melasma' }] } };
  const r = await chamar(webhook, { headers: { 'x-lastlink-token': 'segredo' }, body: outro });
  assert.equal(r.dados.motivo, 'produto_fora_do_lume');
  assert.equal(ler('entitlements/x@y.com'), null);
});

test('login por código: só envia com acesso, aceita o código certo uma vez e bloqueia depois de 5 erros', async () => {
  const semAcesso = await chamar(authCode, { body: { acao: 'enviar', email: 'nao@cliente.com' } });
  assert.equal(semAcesso.status, 200);
  assert.equal(emails.length, 0, 'sem assinatura: mesma resposta, nenhum e-mail');

  await chamar(webhook, { headers: { 'x-lastlink-token': 'segredo' }, body: compra('Purchase_Order_Confirmed') });
  await chamar(authCode, { body: { acao: 'enviar', email: 'ana@exemplo.com' } });
  assert.equal(emails.length, 1);
  const codigo = emails[0].textContent.match(/(\d{6})/)[1];

  const errado = await chamar(authCode, { body: { acao: 'validar', email: 'ana@exemplo.com', codigo: codigo === '000000' ? '111111' : '000000' } });
  assert.equal(errado.dados.erro, 'codigo_errado');
  const certo = await chamar(authCode, { body: { acao: 'validar', email: 'ana@exemplo.com', codigo } });
  assert.equal(certo.status, 200);
  assert.equal(certo.dados.token.split('.').length, 3);
  const deNovo = await chamar(authCode, { body: { acao: 'validar', email: 'ana@exemplo.com', codigo } });
  assert.equal(deNovo.dados.erro, 'codigo_expirado', 'o código só vale uma vez');

  banco.delete(`codigos/${[...banco.keys()].find((k) => k.startsWith('codigos/'))?.split('/')[1]}`);
  await chamar(authCode, { body: { acao: 'enviar', email: 'ana@exemplo.com' } });
  const chave = [...banco.keys()].find((k) => k.startsWith('codigos/'));
  banco.set(chave, { ...banco.get(chave), tentativas: paraFirestore(5) });
  const bloqueado = await chamar(authCode, { body: { acao: 'validar', email: 'ana@exemplo.com', codigo: '123456' } });
  assert.equal(bloqueado.status, 429);
});
