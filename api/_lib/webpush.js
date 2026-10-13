// Web Push sem dependência: criptografia aes128gcm (RFC 8291) e assinatura VAPID (RFC 8292), só com node:crypto.
import crypto from 'node:crypto';

export const b64u = (buf) => Buffer.from(buf).toString('base64url');
export const deB64u = (s) => Buffer.from(s, 'base64url');
const hmac = (chave, dados) => crypto.createHmac('sha256', chave).update(dados).digest();

// Cifra a mensagem para a assinatura do navegador. `teste` aceita sal e chave fixos (para o exemplo da RFC).
export function cifrar(texto, p256dh, auth, teste = {}) {
  const uaPublica = deB64u(p256dh);
  const segredo = deB64u(auth);
  const ecdh = crypto.createECDH('prime256v1');
  if (teste.chavePrivada) ecdh.setPrivateKey(deB64u(teste.chavePrivada));
  else ecdh.generateKeys();
  const asPublica = ecdh.getPublicKey();
  const compartilhado = ecdh.computeSecret(uaPublica);

  const prkChave = hmac(segredo, compartilhado);
  const infoChave = Buffer.concat([Buffer.from('WebPush: info\0'), uaPublica, asPublica]);
  const ikm = hmac(prkChave, Buffer.concat([infoChave, Buffer.from([1])]));
  const sal = teste.sal ? deB64u(teste.sal) : crypto.randomBytes(16);
  const prk = hmac(sal, ikm);
  const cek = hmac(prk, Buffer.from('Content-Encoding: aes128gcm\0\x01', 'binary')).subarray(0, 16);
  const nonce = hmac(prk, Buffer.from('Content-Encoding: nonce\0\x01', 'binary')).subarray(0, 12);

  const cifra = crypto.createCipheriv('aes-128-gcm', cek, nonce);
  const corpo = Buffer.concat([cifra.update(Buffer.concat([Buffer.from(texto), Buffer.from([2])])), cifra.final(), cifra.getAuthTag()]);
  const rs = Buffer.alloc(4);
  rs.writeUInt32BE(4096);
  return Buffer.concat([sal, rs, Buffer.from([asPublica.length]), asPublica, corpo]);
}

// Cabeçalho Authorization VAPID para o serviço de push do endpoint.
export function cabecalhoVapid(endpoint, { publica, privada, assunto }, agora = Date.now()) {
  const pub = deB64u(publica);
  const chave = crypto.createPrivateKey({
    key: { kty: 'EC', crv: 'P-256', d: privada, x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33, 65)) },
    format: 'jwk',
  });
  const cabeca = b64u(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const carga = b64u(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(agora / 1000) + 12 * 3600, sub: assunto }));
  const assinatura = crypto.sign('sha256', Buffer.from(`${cabeca}.${carga}`), { key: chave, dsaEncoding: 'ieee-p1363' });
  return `vapid t=${cabeca}.${carga}.${b64u(assinatura)}, k=${publica}`;
}

// Envia um aviso. Devolve { ok, status, expirada } — expirada: a assinatura não existe mais (404/410) e deve ser apagada.
export async function enviarPush(assinatura, aviso, vapid) {
  const corpo = cifrar(JSON.stringify(aviso), assinatura.keys.p256dh, assinatura.keys.auth);
  const r = await fetch(assinatura.endpoint, {
    method: 'POST',
    headers: {
      Authorization: cabecalhoVapid(assinatura.endpoint, vapid),
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: '1800',
      Urgency: 'high',
    },
    body: corpo,
  });
  return { ok: r.ok, status: r.status, expirada: r.status === 404 || r.status === 410 };
}

// Par de chaves VAPID novo, em base64url, para as variáveis de ambiente.
export function gerarChavesVapid() {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  return { publica: b64u(ecdh.getPublicKey()), privada: b64u(ecdh.getPrivateKey()) };
}
