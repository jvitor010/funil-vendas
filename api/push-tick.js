// Chamado a cada minuto pelo cron-job.org: envia os avisos que venceram.
// Env: LUME_CRON_TOKEN, VAPID_PUBLICA, VAPID_PRIVADA, VAPID_ASSUNTO (mailto:...), FIREBASE_SERVICE_ACCOUNT.
import { contaDeServico, firestore } from './_lib/google.js';
import { responder, tokenConfere } from './_lib/http.js';
import { enviarPush } from './_lib/webpush.js';

export const config = { maxDuration: 20 };
const ATRASO_MAXIMO = 30 * 60000;
const ORCAMENTO = 15000;

export default async function handler(req, res) {
  if (!tokenConfere(req, process.env.LUME_CRON_TOKEN)) return responder(res, 401, { erro: 'token_invalido' });
  const sa = contaDeServico();
  const vapid = { publica: process.env.VAPID_PUBLICA, privada: process.env.VAPID_PRIVADA, assunto: process.env.VAPID_ASSUNTO };
  if (!sa || !vapid.publica || !vapid.privada || !vapid.assunto) return responder(res, 503, { erro: 'push_nao_configurado' });

  const db = firestore(sa);
  const inicio = Date.now();
  const vencidos = await db.vencidos('avisos', 'em', new Date(inicio));
  const conta = { enviados: 0, expirados: 0, descartados: 0, falhas: 0 };
  for (const aviso of vencidos) {
    if (Date.now() - inicio > ORCAMENTO) break;
    // Apaga antes de enviar: com o cron de minuto em minuto, a mãe nunca recebe o mesmo aviso duas vezes.
    await db.apagar(`avisos/${aviso.id}`);
    if (inicio - new Date(aviso.em).getTime() > ATRASO_MAXIMO) {
      conta.descartados++;
      continue;
    }
    const push = await db.ler(`push/${aviso.uid}`);
    if (!push?.assinatura) {
      conta.descartados++;
      continue;
    }
    try {
      const r = await enviarPush(push.assinatura, { titulo: aviso.titulo, texto: aviso.texto, tag: aviso.tag, url: '/app' }, vapid);
      if (r.expirada) {
        await db.apagar(`push/${aviso.uid}`);
        conta.expirados++;
      } else if (r.ok) conta.enviados++;
      else conta.falhas++;
    } catch {
      conta.falhas++;
    }
  }
  return responder(res, 200, { ok: true, vencidos: vencidos.length, ...conta });
}
