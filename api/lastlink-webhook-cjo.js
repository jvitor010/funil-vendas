// Webhook da Lastlink para o Lume: ativa, renova, cancela e estorna o acesso de cada e-mail.
// Painel Lastlink → Webhooks: URL https://www.fluxovital.top/api/lastlink-webhook-cjo, cabeçalho X-Lastlink-Token.
// Env: LASTLINK_TOKEN_LUME, LUME_PLANOS (JSON {"<código do produto>": {"plano": "anual", "dias": 365}}), FIREBASE_SERVICE_ACCOUNT.
import { contaDeServico, firestore } from './_lib/google.js';
import { corpoJson, responder, tokenConfere } from './_lib/http.js';
import { detectarEvento, acaoDoEvento, planoDoEvento, compradorDoEvento, chaveDoEvento, novoDireito } from './_lib/assinatura.js';

function planosConfigurados() {
  try {
    return JSON.parse(process.env.LUME_PLANOS || '{}');
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return responder(res, 405, { erro: 'metodo_nao_permitido' });
  if (!tokenConfere(req, process.env.LASTLINK_TOKEN_LUME)) return responder(res, 401, { erro: 'token_invalido' });
  const sa = contaDeServico();
  if (!sa) return responder(res, 503, { erro: 'firebase_nao_configurado' });

  const payload = corpoJson(req);
  const evento = detectarEvento(payload);
  const acao = acaoDoEvento(evento);
  const { email, nome } = compradorDoEvento(payload);
  const plano = planoDoEvento(payload, planosConfigurados());
  const db = firestore(sa);
  const chave = chaveDoEvento(evento, email, payload);

  // Registra o evento antes de agir: o mesmo pagamento entregue de novo não soma dias duas vezes.
  const novo = await db.criar('eventos', chave, { evento, acao, email, plano: plano?.plano || null, recebidoEm: new Date() });
  if (!novo) return responder(res, 200, { ok: true, duplicado: true });

  if (!email || !plano || acao === 'ignorar') {
    const motivo = !email ? 'sem_email' : !plano ? 'produto_fora_do_lume' : 'evento_sem_efeito';
    return responder(res, 200, { ok: true, acao: 'ignorado', motivo, evento });
  }

  try {
    const atual = await db.ler(`entitlements/${email}`);
    const direito = novoDireito(atual, acao, plano, Date.now());
    await db.gravar(`entitlements/${email}`, { ...direito, email, nome: nome || atual?.nome || '', origem: atual?.origem || 'lastlink', ultimoEvento: evento });
    return responder(res, 200, { ok: true, acao, plano: plano.plano, status: direito.status });
  } catch (erro) {
    // Desfaz o registro para a Lastlink poder reenviar e o acesso não se perder.
    await db.apagar(`eventos/${chave}`).catch(() => {});
    return responder(res, 500, { erro: 'falha_ao_gravar', detalhe: erro.message });
  }
}
