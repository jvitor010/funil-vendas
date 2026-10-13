import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { cifrar, cabecalhoVapid, gerarChavesVapid, b64u, deB64u } from '../api/_lib/webpush.js';

// RFC 8291, seção 5 e apêndice A.
const RFC = {
  texto: 'When I grow up, I want to be a watermelon',
  asPrivada: 'yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw',
  uaPublica: 'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4',
  sal: 'DGv6ra1nlYgDCS1FRnbzlw',
  auth: 'BTBZMqHH6r4Tts7J_aSIgg',
  mensagem: 'DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN',
};

test('cifra exatamente como o exemplo da RFC 8291', () => {
  const saida = cifrar(RFC.texto, RFC.uaPublica, RFC.auth, { sal: RFC.sal, chavePrivada: RFC.asPrivada });
  assert.equal(b64u(saida), RFC.mensagem);
});

test('cabeçalho VAPID é um JWT ES256 válido para a origem do endpoint', () => {
  const chaves = gerarChavesVapid();
  const endpoint = 'https://fcm.googleapis.com/fcm/send/abc123';
  const h = cabecalhoVapid(endpoint, { ...chaves, assunto: 'mailto:contato@exemplo.com' }, Date.UTC(2026, 9, 13));
  const [, t, k] = h.match(/^vapid t=([^,]+), k=(.+)$/);
  assert.equal(k, chaves.publica);
  const [cabeca, carga, assinatura] = t.split('.');
  assert.deepEqual(JSON.parse(deB64u(cabeca)), { typ: 'JWT', alg: 'ES256' });
  const c = JSON.parse(deB64u(carga));
  assert.equal(c.aud, 'https://fcm.googleapis.com');
  assert.equal(c.sub, 'mailto:contato@exemplo.com');
  const pub = deB64u(chaves.publica);
  const chavePublica = crypto.createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33)) }, format: 'jwk' });
  assert.ok(crypto.verify('sha256', Buffer.from(`${cabeca}.${carga}`), { key: chavePublica, dsaEncoding: 'ieee-p1363' }, deB64u(assinatura)));
});
