// Lume · traz os dados do app antigo (app.html, chaves cjo_* no localStorage) para o formato novo.
// Roda uma vez, no mesmo endereço (www.fluxovital.top), e nunca apaga as chaves antigas.

export const CHAVE = 'lume_v1';

function ler(storage, chave, padrao) {
  try {
    const v = storage.getItem(chave);
    return v == null || v === '' ? padrao : JSON.parse(v);
  } catch {
    return padrao;
  }
}

function emLocal(data, hhmm) {
  const [a, m, d] = data.split('-').map(Number);
  const [h, mi] = hhmm.split(':').map(Number);
  return new Date(a, m - 1, d, h, mi).getTime();
}

const valida = (data, hhmm) => /^\d{4}-\d{2}-\d{2}$/.test(data || '') && /^\d{2}:\d{2}$/.test(hhmm || '');

// Devolve o estado novo montado a partir do antigo, ou null se não houver app antigo (ou se já migrou).
export function migrarDoAppAntigo(storage, agora = Date.now()) {
  if (ler(storage, CHAVE, null)) return null;
  const bebe = ler(storage, 'cjo_baby', null);
  if (!bebe || !bebe.name || !bebe.birthDate) return null;

  const sessoes = [];
  for (const l of ler(storage, 'cjo_logs', [])) {
    if (!l || !valida(l.date, l.start) || !valida(l.date, l.end)) continue;
    const inicio = emLocal(l.date, l.start);
    let fim = emLocal(l.date, l.end);
    if (fim <= inicio) fim += 86400000;
    sessoes.push({ id: `antigo-${l.id || inicio}`, tipo: l.type === 'night' ? 'noite' : 'soneca', inicio, fim, origem: 'app-antigo' });
  }

  const ultimoDespertar = storage.getItem('cjo_lw');
  if (ultimoDespertar && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(ultimoDespertar)) {
    const fim = emLocal(ultimoDespertar.slice(0, 10), ultimoDespertar.slice(11, 16));
    const h = new Date(fim).getHours();
    const jaExiste = sessoes.some((s) => s.fim === fim);
    if (!jaExiste && h >= 4 && h < 11 && fim <= agora) sessoes.push({ id: `antigo-despertar-${fim}`, tipo: 'noite', inicio: null, fim, origem: 'app-antigo' });
  }
  sessoes.sort((a, b) => (a.fim ?? a.inicio) - (b.fim ?? b.inicio));

  const env = ler(storage, 'cjo_env', {});
  const c14 = ler(storage, 'cjo_c14', {});
  return {
    versao: 1,
    bebe: { nome: String(bebe.name).trim(), nascimento: bebe.birthDate, idadeGestacional: 40 },
    responsavel: bebe.parentName && bebe.parentName !== 'Mamãe' ? String(bebe.parentName).trim() : '',
    sessoes,
    notas: ler(storage, 'cjo_sc', {}),
    legado: { checklist: ler(storage, 'cjo_cl', {}), ambiente: env.c || {}, ambienteData: env.d || null, desafio14: c14.c || {}, desafio14Inicio: c14.s || null },
    migradoEm: agora,
  };
}
