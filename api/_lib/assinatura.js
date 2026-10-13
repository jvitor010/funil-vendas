// Regras de acesso ao Lume a partir dos eventos da Lastlink. Funções puras: o webhook só lê e grava.
import crypto from 'node:crypto';

export const DIA = 86400000;
export const CARENCIA_DIAS = 3;

export function detectarEvento(payload) {
  return String(payload?.Event || payload?.event || payload?.EventType || payload?.eventType || '').toLowerCase();
}

// O que o evento faz com o acesso. Nomes desconhecidos são ignorados (e registrados) até serem mapeados.
export function acaoDoEvento(evento) {
  if (/refund|chargeback|estorn|reembols/.test(evento)) return 'estornar';
  if (/cancel/.test(evento)) return 'cancelar';
  if (/abandon/.test(evento)) return 'ignorar';
  if (/confirm|paid|approved|aprovad|renew|renov|recurr|recorr/.test(evento)) return 'ativar';
  return 'ignorar';
}

function dados(payload) {
  return payload?.Data || payload?.data || payload || {};
}

// Plano comprado: pelo código do produto (LUME_PLANOS) em qualquer parte do evento, ou pelo nome do produto.
export function planoDoEvento(payload, planos = {}) {
  const blob = JSON.stringify(payload || {}).toLowerCase();
  for (const [codigo, p] of Object.entries(planos)) if (codigo && blob.includes(codigo.toLowerCase())) return { codigo, ...p };
  const d = dados(payload);
  const nomes = [d.ProductName, d.productName, d.Product?.Name, d.product?.name, d.Offer?.Name, d.offer?.name, ...(d.Products || d.products || []).map((p) => p?.Name || p?.name)]
    .filter(Boolean).join(' ').toLowerCase();
  if (!/lume/.test(nomes)) return null;
  if (/anual/.test(nomes)) return { codigo: null, plano: 'anual', dias: 365 };
  if (/trimestral/.test(nomes)) return { codigo: null, plano: 'trimestral', dias: 92 };
  if (/mensal/.test(nomes)) return { codigo: null, plano: 'mensal', dias: 31 };
  return null;
}

export function compradorDoEvento(payload) {
  const d = dados(payload);
  const b = d.Buyer || d.buyer || d.Customer || d.customer || {};
  const email = String(b.Email || b.email || d.Email || d.email || payload?.email || '').trim().toLowerCase();
  const nome = String(b.Name || b.name || b.FullName || '').trim();
  return { email, nome };
}

// Chave estável: o mesmo pagamento entregue duas vezes gera a mesma chave.
export function chaveDoEvento(evento, email, payload) {
  const d = dados(payload);
  const pid = d.Purchase?.PaymentId || d.Purchase?.Id || d.PaymentId || d.OrderId || d.Order?.Id || d.Subscription?.Id || '';
  const quando = pid ? '' : String(payload?.CreatedAt || d.CreatedAt || '').slice(0, 16);
  return crypto.createHash('sha1').update([evento, email, pid, quando].join('|')).digest('hex').slice(0, 24);
}

// O novo estado do acesso. `pagoAte` é até onde foi pago; `validoAte` soma a carência para a renovação chegar.
export function novoDireito(atual, acao, plano, agora) {
  const a = atual || {};
  if (a.status === 'vitalicio') return { ...a, atualizadoEm: new Date(agora) };
  const pagoAte = a.pagoAte ? new Date(a.pagoAte).getTime() : 0;
  if (acao === 'ativar') {
    const base = Math.max(pagoAte, agora);
    const novoPagoAte = base + plano.dias * DIA;
    return { status: 'ativo', plano: plano.plano, pagoAte: new Date(novoPagoAte), validoAte: new Date(novoPagoAte + CARENCIA_DIAS * DIA), atualizadoEm: new Date(agora) };
  }
  if (acao === 'cancelar') {
    const fim = pagoAte || agora;
    return { ...a, status: 'cancelado', validoAte: new Date(fim), atualizadoEm: new Date(agora) };
  }
  if (acao === 'estornar') return { ...a, status: 'estornado', validoAte: new Date(agora), atualizadoEm: new Date(agora) };
  return a;
}

export function temAcesso(direito, agora) {
  if (!direito) return false;
  if (direito.status === 'vitalicio') return true;
  if (!['ativo', 'cancelado'].includes(direito.status)) return false;
  return new Date(direito.validoAte).getTime() > agora;
}
