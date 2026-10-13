// Login por código de 6 dígitos no e-mail da compra (no iPhone, link mágico abre no Safari e o app instalado fica deslogado).
// { acao: 'enviar', email } → manda o código, se houver acesso.  { acao: 'validar', email, codigo } → devolve o token de login.
import crypto from 'node:crypto';
import { contaDeServico, firestore, normalizarEmail, uidDoEmail, tokenPersonalizado } from './_lib/google.js';
import { corpoJson, responder, emailValido } from './_lib/http.js';
import { enviarEmail, emailDoCodigo } from './_lib/brevo.js';
import { temAcesso } from './_lib/assinatura.js';

const VALIDADE = 10 * 60000;
const TENTATIVAS = 5;
const ESPERA_REENVIO = 60000;

const hashDoCodigo = (email, codigo, segredo) => crypto.createHash('sha256').update(`${email}:${codigo}:${segredo}`).digest('hex');

export default async function handler(req, res) {
  if (req.method !== 'POST') return responder(res, 405, { erro: 'metodo_nao_permitido' });
  const sa = contaDeServico();
  if (!sa) return responder(res, 503, { erro: 'firebase_nao_configurado' });

  const c = corpoJson(req);
  const email = normalizarEmail(c.email);
  if (!emailValido(email)) return responder(res, 400, { erro: 'email_invalido' });
  const db = firestore(sa);
  const uid = uidDoEmail(email);
  const segredo = process.env.LUME_SEGREDO_CODIGO || sa.private_key_id || sa.client_email;
  const agora = Date.now();

  if (c.acao === 'enviar') {
    // A resposta é a mesma com ou sem assinatura: ninguém descobre quem é cliente digitando e-mails.
    const direito = await db.ler(`entitlements/${email}`);
    if (!temAcesso(direito, agora)) return responder(res, 200, { ok: true });
    const anterior = await db.ler(`codigos/${uid}`);
    if (anterior && agora - new Date(anterior.criadoEm).getTime() < ESPERA_REENVIO) return responder(res, 200, { ok: true });
    const codigo = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    await db.gravar(`codigos/${uid}`, { hash: hashDoCodigo(email, codigo, segredo), expira: new Date(agora + VALIDADE), tentativas: 0, criadoEm: new Date(agora) });
    const envio = await enviarEmail({ para: email, ...emailDoCodigo(codigo) });
    if (!envio.ok) return responder(res, 502, { erro: 'email_nao_enviado' });
    return responder(res, 200, { ok: true });
  }

  if (c.acao === 'validar') {
    const registro = await db.ler(`codigos/${uid}`);
    if (!registro || new Date(registro.expira).getTime() < agora) return responder(res, 400, { erro: 'codigo_expirado' });
    if ((registro.tentativas || 0) >= TENTATIVAS) return responder(res, 429, { erro: 'tentativas_esgotadas' });
    const esperado = Buffer.from(registro.hash, 'hex');
    const recebido = Buffer.from(hashDoCodigo(email, String(c.codigo || '').replace(/\D/g, ''), segredo), 'hex');
    if (esperado.length !== recebido.length || !crypto.timingSafeEqual(esperado, recebido)) {
      await db.gravar(`codigos/${uid}`, { tentativas: (registro.tentativas || 0) + 1 });
      return responder(res, 400, { erro: 'codigo_errado' });
    }
    await db.apagar(`codigos/${uid}`);
    const direito = await db.ler(`entitlements/${email}`);
    if (!temAcesso(direito, agora)) return responder(res, 403, { erro: 'sem_acesso' });
    const token = tokenPersonalizado(sa, uid, { lume_email: email, plano: direito.status === 'vitalicio' ? 'vitalicio' : direito.plano || '' });
    return responder(res, 200, { ok: true, token });
  }

  return responder(res, 400, { erro: 'acao_invalida' });
}
