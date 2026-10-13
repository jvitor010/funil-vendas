// Guarda as respostas do quiz com o e-mail, para o app abrir já configurado depois da compra.
// Só grava com o consentimento marcado (LGPD, dados de criança: art. 14).
import { contaDeServico, firestore, normalizarEmail, uidDoEmail } from './_lib/google.js';
import { corpoJson, responder, emailValido } from './_lib/http.js';

const curto = (v, max = 80) => (v == null ? '' : String(v).trim().slice(0, max));

export default async function handler(req, res) {
  if (req.method !== 'POST') return responder(res, 405, { erro: 'metodo_nao_permitido' });
  const sa = contaDeServico();
  if (!sa) return responder(res, 503, { erro: 'firebase_nao_configurado' });

  const c = corpoJson(req);
  const email = normalizarEmail(c.email);
  if (!emailValido(email)) return responder(res, 400, { erro: 'email_invalido' });
  if (c.consentimento !== true) return responder(res, 400, { erro: 'sem_consentimento' });
  const respostas = c.respostas && typeof c.respostas === 'object' ? c.respostas : {};
  if (JSON.stringify(respostas).length > 8000) return responder(res, 413, { erro: 'respostas_grandes_demais' });

  const bebe = c.bebe || {};
  const utm = Object.fromEntries(Object.entries(c.utm || {}).slice(0, 8).map(([k, v]) => [curto(k, 20), curto(v, 160)]));
  await firestore(sa).gravar(`leads/${uidDoEmail(email)}`, {
    email,
    bebe: { nome: curto(bebe.nome, 40), nascimento: /^\d{4}-\d{2}-\d{2}$/.test(bebe.nascimento || '') ? bebe.nascimento : '', idadeGestacional: Number(bebe.idadeGestacional) || 40 },
    respostas,
    utm,
    consentimentoEm: new Date(),
    atualizadoEm: new Date(),
  });
  return responder(res, 200, { ok: true });
}
