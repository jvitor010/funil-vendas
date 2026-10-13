import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { paraFirestore, deFirestore, tokenPersonalizado, verificarIdToken, jwtRS256, uidDoEmail } from '../api/_lib/google.js';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const PRIV = privateKey.export({ type: 'pkcs8', format: 'pem' });
const PUB = publicKey.export({ type: 'spki', format: 'pem' });
const SA = { client_email: 'lume@projeto.iam.gserviceaccount.com', private_key: PRIV, project_id: 'lume-app' };
const decodificar = (jwt) => jwt.split('.').slice(0, 2).map((p) => JSON.parse(Buffer.from(p, 'base64url')));

test('valores vão e voltam do formato do Firestore', () => {
  const obj = { email: 'ana@exemplo.com', plano: 'anual', dias: 365, nota: 4.5, ativo: true, quando: new Date('2026-10-13T15:00:00Z'), lista: [1, 'a'], mapa: { x: null } };
  assert.deepEqual(deFirestore(paraFirestore(obj)), obj);
  assert.deepEqual(paraFirestore(365), { integerValue: '365' });
});

test('token personalizado do Firebase tem o formato e a assinatura certos', () => {
  const agora = Date.UTC(2026, 9, 13);
  const t = tokenPersonalizado(SA, 'u123', { lume_email: 'ana@exemplo.com' }, agora);
  const [cabeca, carga] = decodificar(t);
  assert.equal(cabeca.alg, 'RS256');
  assert.equal(carga.aud, 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit');
  assert.equal(carga.iss, SA.client_email);
  assert.equal(carga.uid, 'u123');
  assert.equal(carga.exp - carga.iat, 3600);
  assert.deepEqual(carga.claims, { lume_email: 'ana@exemplo.com' });
  const [h, c, s] = t.split('.');
  assert.ok(crypto.verify('RSA-SHA256', Buffer.from(`${h}.${c}`), PUB, Buffer.from(s, 'base64url')));
});

test('token de login só passa com assinatura, público, emissor e validade certos', async () => {
  const agora = Date.UTC(2026, 9, 13, 12);
  const seg = Math.floor(agora / 1000);
  const assinar = (carga) => {
    const base = `${Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'k1' })).toString('base64url')}.${Buffer.from(JSON.stringify(carga)).toString('base64url')}`;
    return `${base}.${crypto.sign('RSA-SHA256', Buffer.from(base), PRIV).toString('base64url')}`;
  };
  const buscar = async () => ({ json: async () => ({ k1: PUB }) });
  const bom = { aud: 'lume-app', iss: 'https://securetoken.google.com/lume-app', sub: 'u123', exp: seg + 600 };
  assert.equal((await verificarIdToken(assinar(bom), 'lume-app', agora, buscar)).sub, 'u123');
  assert.equal(await verificarIdToken(assinar({ ...bom, aud: 'outro' }), 'lume-app', agora, buscar), null);
  assert.equal(await verificarIdToken(assinar({ ...bom, exp: seg - 1 }), 'lume-app', agora, buscar), null);
  const adulterado = assinar(bom).replace(/\.[^.]+\./, `.${Buffer.from(JSON.stringify({ ...bom, sub: 'outra' })).toString('base64url')}.`);
  assert.equal(await verificarIdToken(adulterado, 'lume-app', agora, buscar), null);
  assert.equal(await verificarIdToken('lixo', 'lume-app', agora, buscar), null);
});

test('mesmo e-mail, mesmo usuário', () => {
  assert.equal(uidDoEmail(' Ana@Exemplo.com'), uidDoEmail('ana@exemplo.com'));
  assert.equal(uidDoEmail('ana@exemplo.com').length, 28);
  assert.ok(jwtRS256({ a: 1 }, PRIV).split('.').length === 3);
});
