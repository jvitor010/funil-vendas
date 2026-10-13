// Acesso ao Firebase do Lume pelo servidor, sem dependência: conta de serviço, Firestore (REST),
// token de login personalizado e verificação do token de quem está logado.
import crypto from 'node:crypto';

const b64u = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');

// FIREBASE_SERVICE_ACCOUNT: o JSON da conta de serviço, inteiro numa linha ou em base64.
export function contaDeServico(env = process.env) {
  const bruto = (env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (!bruto) return null;
  const json = bruto.startsWith('{') ? bruto : Buffer.from(bruto, 'base64').toString('utf8');
  const sa = JSON.parse(json);
  return { ...sa, private_key: String(sa.private_key).replace(/\\n/g, '\n') };
}

export function jwtRS256(carga, chavePem) {
  const base = `${b64u({ alg: 'RS256', typ: 'JWT' })}.${b64u(carga)}`;
  return `${base}.${crypto.sign('RSA-SHA256', Buffer.from(base), chavePem).toString('base64url')}`;
}

let cache = { token: null, exp: 0 };
async function tokenGoogle(sa) {
  const agora = Math.floor(Date.now() / 1000);
  if (cache.token && cache.exp - 60 > agora) return cache.token;
  const asser = jwtRS256({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: agora, exp: agora + 3600 }, sa.private_key);
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${asser}`,
  });
  const d = await r.json();
  if (!d.access_token) throw new Error('google_token_falhou');
  cache = { token: d.access_token, exp: agora + (d.expires_in || 3600) };
  return d.access_token;
}

// ── conversão JS ⇄ formato de valores do Firestore ──
export function paraFirestore(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(paraFirestore) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, paraFirestore(x)])) } };
}

export function deFirestore(v) {
  if (!v) return null;
  if ('nullValue' in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('stringValue' in v) return v.stringValue;
  if ('timestampValue' in v) return new Date(v.timestampValue);
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(deFirestore);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, deFirestore(x)]));
  return null;
}

export const campos = (obj) => paraFirestore(obj).mapValue.fields;
const doc = (d) => (d && d.fields ? deFirestore({ mapValue: { fields: d.fields } }) : null);

export function firestore(sa) {
  const raiz = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`;
  const chamar = async (url, opcoes = {}) => {
    const r = await fetch(url, { ...opcoes, headers: { Authorization: `Bearer ${await tokenGoogle(sa)}`, 'Content-Type': 'application/json', ...(opcoes.headers || {}) } });
    const texto = await r.text();
    return { ok: r.ok, status: r.status, dados: texto ? JSON.parse(texto) : null };
  };
  const caminho = (p) => p.split('/').map(encodeURIComponent).join('/');
  return {
    async ler(p) {
      const r = await chamar(`${raiz}/${caminho(p)}`);
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`firestore_ler_${r.status}`);
      return doc(r.dados);
    },
    // Grava os campos dados (mescla), sem apagar os outros campos do documento.
    async gravar(p, obj) {
      const mascara = Object.keys(obj).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
      const r = await chamar(`${raiz}/${caminho(p)}?${mascara}`, { method: 'PATCH', body: JSON.stringify({ fields: campos(obj) }) });
      if (!r.ok) throw new Error(`firestore_gravar_${r.status}`);
      return doc(r.dados);
    },
    // Cria só se não existir. Devolve false quando o documento já existia (idempotência do webhook).
    async criar(colecao, id, obj) {
      const r = await chamar(`${raiz}/${caminho(colecao)}?documentId=${encodeURIComponent(id)}`, { method: 'POST', body: JSON.stringify({ fields: campos(obj) }) });
      if (r.status === 409) return false;
      if (!r.ok) throw new Error(`firestore_criar_${r.status}`);
      return true;
    },
    async apagar(p) {
      const r = await chamar(`${raiz}/${caminho(p)}`, { method: 'DELETE' });
      if (!r.ok && r.status !== 404) throw new Error(`firestore_apagar_${r.status}`);
    },
    // Documentos de uma coleção com um campo de data <= limite, em ordem.
    async vencidos(colecao, campo, limite, maximo = 200) {
      const r = await chamar(`${raiz}:runQuery`, {
        method: 'POST',
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: colecao }],
            where: { fieldFilter: { field: { fieldPath: campo }, op: 'LESS_THAN_OR_EQUAL', value: paraFirestore(limite) } },
            orderBy: [{ field: { fieldPath: campo }, direction: 'ASCENDING' }],
            limit: maximo,
          },
        }),
      });
      if (!r.ok) throw new Error(`firestore_consulta_${r.status}`);
      return (r.dados || []).filter((x) => x.document).map((x) => ({ id: x.document.name.split('/').pop(), ...doc(x.document) }));
    },
  };
}

// Token de login personalizado do Firebase (o app troca por uma sessão com signInWithCustomToken).
export function tokenPersonalizado(sa, uid, claims = {}, agora = Date.now()) {
  const iat = Math.floor(agora / 1000);
  return jwtRS256({
    iss: sa.client_email,
    sub: sa.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat,
    exp: iat + 3600,
    uid,
    claims,
  }, sa.private_key);
}

// Confere o token de quem está logado no app (Firebase ID token) e devolve seu conteúdo, ou null.
let certs = { lista: null, ate: 0 };
export async function verificarIdToken(idToken, projectId, agora = Date.now(), buscar = fetch) {
  try {
    const [h, c, s] = String(idToken).split('.');
    const cabeca = JSON.parse(Buffer.from(h, 'base64url'));
    const carga = JSON.parse(Buffer.from(c, 'base64url'));
    if (cabeca.alg !== 'RS256') return null;
    if (!certs.lista || certs.ate < agora) {
      const r = await buscar('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
      certs = { lista: await r.json(), ate: agora + 3600 * 1000 };
    }
    const cert = certs.lista[cabeca.kid];
    if (!cert) return null;
    const valido = crypto.verify('RSA-SHA256', Buffer.from(`${h}.${c}`), cert, Buffer.from(s, 'base64url'));
    const seg = Math.floor(agora / 1000);
    if (!valido || carga.aud !== projectId || carga.iss !== `https://securetoken.google.com/${projectId}` || carga.exp < seg || !carga.sub) return null;
    return carga;
  } catch {
    return null;
  }
}

// O mesmo e-mail sempre vira o mesmo usuário.
export const uidDoEmail = (email) => 'u' + crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex').slice(0, 27);
export const normalizarEmail = (email) => String(email || '').trim().toLowerCase();
