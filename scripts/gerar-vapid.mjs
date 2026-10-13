// Gera o par de chaves VAPID do Lume (avisos no celular). Uso: node scripts/gerar-vapid.mjs
// Cole as duas linhas nas variáveis de ambiente da Vercel. A privada nunca vai para o repositório nem para conversa.
import { gerarChavesVapid } from '../api/_lib/webpush.js';

const { publica, privada } = gerarChavesVapid();
console.log(`VAPID_PUBLICA=${publica}`);
console.log(`VAPID_PRIVADA=${privada}`);
