// Guarda a assinatura de push do aparelho e os avisos das próximas horas.
// GET → { publica } (chave VAPID para o navegador assinar).  POST { idToken, assinatura, avisos[] } → agenda.
import { contaDeServico, firestore, verificarIdToken } from './_lib/google.js';
import { corpoJson, responder } from './_lib/http.js';

const TAGS = ['janela-15', 'janela-0', 'dormir-15'];
const HORIZONTE = 24 * 3600000;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!process.env.VAPID_PUBLICA) return responder(res, 503, { erro: 'push_nao_configurado' });
    return responder(res, 200, { publica: process.env.VAPID_PUBLICA });
  }
  if (req.method !== 'POST') return responder(res, 405, { erro: 'metodo_nao_permitido' });
  const sa = contaDeServico();
  if (!sa) return responder(res, 503, { erro: 'firebase_nao_configurado' });

  const c = corpoJson(req);
  const usuario = await verificarIdToken(c.idToken, sa.project_id);
  if (!usuario) return responder(res, 401, { erro: 'nao_logado' });
  const a = c.assinatura || {};
  if (!/^https:\/\//.test(a.endpoint || '') || !a.keys?.p256dh || !a.keys?.auth) return responder(res, 400, { erro: 'assinatura_invalida' });

  const db = firestore(sa);
  const uid = usuario.sub;
  await db.gravar(`push/${uid}`, { assinatura: { endpoint: a.endpoint, keys: { p256dh: a.keys.p256dh, auth: a.keys.auth } }, atualizadoEm: new Date() });

  const agora = Date.now();
  const porTag = new Map((Array.isArray(c.avisos) ? c.avisos : []).map((x) => [x?.tag, x]));
  let agendados = 0;
  for (const tag of TAGS) {
    const x = porTag.get(tag);
    const em = x ? new Date(x.em).getTime() : NaN;
    if (x && em > agora && em < agora + HORIZONTE) {
      await db.gravar(`avisos/${uid}_${tag}`, { uid, tag, em: new Date(em), titulo: String(x.titulo || '').slice(0, 80), texto: String(x.texto || '').slice(0, 140) });
      agendados++;
    } else {
      await db.apagar(`avisos/${uid}_${tag}`);
    }
  }
  return responder(res, 200, { ok: true, agendados });
}
