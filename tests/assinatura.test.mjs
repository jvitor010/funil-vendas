import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acaoDoEvento, planoDoEvento, compradorDoEvento, chaveDoEvento, novoDireito, temAcesso, DIA, CARENCIA_DIAS } from '../api/_lib/assinatura.js';
import { tokenConfere } from '../api/_lib/http.js';

const AGORA = Date.UTC(2026, 9, 13, 15);
const PLANOS = { CANUAL01: { plano: 'anual', dias: 365 }, CTRIM01: { plano: 'trimestral', dias: 92 }, CMENS01: { plano: 'mensal', dias: 31 } };
const evento = (Event, extra = {}) => ({ Event, Data: { Buyer: { Email: ' Ana@Exemplo.com ', Name: 'Ana' }, Products: [{ Id: 'CANUAL01', Name: 'Lume Anual' }], Purchase: { PaymentId: 'pay_1' }, ...extra } });

test('eventos viram ativar, cancelar, estornar ou ignorar', () => {
  assert.equal(acaoDoEvento('purchase_order_confirmed'), 'ativar');
  assert.equal(acaoDoEvento('recurrent_payment'), 'ativar');
  assert.equal(acaoDoEvento('subscription_canceled'), 'cancelar');
  assert.equal(acaoDoEvento('purchase_request_refunded'), 'estornar');
  assert.equal(acaoDoEvento('chargeback'), 'estornar');
  assert.equal(acaoDoEvento('purchase_order_abandoned'), 'ignorar');
  assert.equal(acaoDoEvento('algo_novo'), 'ignorar');
});

test('plano pelo código do produto, com o nome como reserva, e nada para outros produtos', () => {
  assert.equal(planoDoEvento(evento('x'), PLANOS).plano, 'anual');
  const porNome = { Data: { Products: [{ Name: 'Lume Trimestral' }] } };
  assert.equal(planoDoEvento(porNome, {}).plano, 'trimestral');
  assert.equal(planoDoEvento({ Data: { Products: [{ Name: 'Código Xô Melasma' }] } }, PLANOS), null);
});

test('comprador com e-mail normalizado', () => {
  assert.deepEqual(compradorDoEvento(evento('x')), { email: 'ana@exemplo.com', nome: 'Ana' });
});

test('mesmo pagamento entregue duas vezes tem a mesma chave', () => {
  const a = chaveDoEvento('purchase_order_confirmed', 'ana@exemplo.com', evento('x'));
  const b = chaveDoEvento('purchase_order_confirmed', 'ana@exemplo.com', evento('x'));
  const c = chaveDoEvento('purchase_order_confirmed', 'ana@exemplo.com', evento('x', { Purchase: { PaymentId: 'pay_2' } }));
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test('compra ativa e soma a carência; renovação estende a partir do que já estava pago', () => {
  const plano = { plano: 'mensal', dias: 31 };
  const d1 = novoDireito(null, 'ativar', plano, AGORA);
  assert.equal(d1.status, 'ativo');
  assert.equal(d1.pagoAte.getTime(), AGORA + 31 * DIA);
  assert.equal(d1.validoAte.getTime(), AGORA + (31 + CARENCIA_DIAS) * DIA);
  const d2 = novoDireito(d1, 'ativar', plano, AGORA + 30 * DIA);
  assert.equal(d2.pagoAte.getTime(), AGORA + 62 * DIA, 'renovou 1 dia antes: não perde o dia que faltava');
  assert.ok(temAcesso(d2, AGORA + 60 * DIA));
});

test('cancelar mantém o acesso até o fim do que foi pago; estorno corta na hora', () => {
  const d = novoDireito(null, 'ativar', { plano: 'anual', dias: 365 }, AGORA);
  const cancelado = novoDireito(d, 'cancelar', null, AGORA + 10 * DIA);
  assert.equal(cancelado.status, 'cancelado');
  assert.ok(temAcesso(cancelado, AGORA + 300 * DIA));
  assert.ok(!temAcesso(cancelado, AGORA + 366 * DIA));
  const estornado = novoDireito(d, 'estornar', null, AGORA + 2 * DIA);
  assert.ok(!temAcesso(estornado, AGORA + 2 * DIA + 1000));
});

test('compradora antiga com acesso vitalício nunca perde o acesso por evento', () => {
  const v = { status: 'vitalicio', origem: 'compra-cjo-27' };
  assert.ok(temAcesso(novoDireito(v, 'estornar', null, AGORA), AGORA + 9999 * DIA));
  assert.ok(!temAcesso(null, AGORA));
  assert.ok(!temAcesso({ status: 'estornado', validoAte: new Date(AGORA + DIA) }, AGORA));
});

test('token do webhook: cabeçalho, Bearer ou ?token=, e nunca sem token configurado', () => {
  const req = (headers = {}, query = {}) => ({ headers, query });
  assert.ok(tokenConfere(req({ 'x-lastlink-token': 'abc' }), 'abc'));
  assert.ok(tokenConfere(req({ authorization: 'Bearer abc' }), 'xyz, abc'));
  assert.ok(tokenConfere(req({}, { token: 'abc' }), 'abc'));
  assert.ok(!tokenConfere(req({}, {}), 'abc'));
  assert.ok(!tokenConfere(req({ 'x-lastlink-token': 'abc' }), ''));
});
