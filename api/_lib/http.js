// Utilitários das funções /api do Lume.

export function corpoJson(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === 'string') {
    try { return JSON.parse(b); } catch { return {}; }
  }
  return b;
}

export const responder = (res, status, dados) => res.status(status).json(dados);

// Token compartilhado (webhook, cron): cabeçalho, Bearer ou ?token=. Aceita vários separados por vírgula.
export function tokenConfere(req, esperado) {
  const permitidos = String(esperado || '').split(',').map((t) => t.trim()).filter(Boolean);
  if (!permitidos.length) return false;
  const bearer = req.headers.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
  const recebido = req.headers['x-lastlink-token'] || req.headers['x-lume-token'] || bearer || req.query?.token;
  return permitidos.includes(String(recebido || ''));
}

export const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || '').trim());
