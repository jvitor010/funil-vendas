// Dá acesso vitalício ao Lume para quem comprou o CJO de R$27 (o app era bônus da compra).
// Uso: node scripts/importar-compradoras.mjs vendas.csv            → só mostra quantos e-mails achou
//      node scripts/importar-compradoras.mjs vendas.csv --gravar   → grava no Firestore
// Precisa de FIREBASE_SERVICE_ACCOUNT no ambiente. O CSV é a exportação de vendas da Lastlink: usa a coluna cujo nome tem "mail".
import { readFileSync } from 'node:fs';
import { contaDeServico, firestore, normalizarEmail } from '../api/_lib/google.js';

const [arquivo, ...flags] = process.argv.slice(2);
if (!arquivo) {
  console.error('Informe o CSV: node scripts/importar-compradoras.mjs vendas.csv [--gravar]');
  process.exit(1);
}

const linhas = readFileSync(arquivo, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
const separador = (linhas[0].match(/;/g) || []).length > (linhas[0].match(/,/g) || []).length ? ';' : ',';
const colunas = linhas[0].split(separador).map((c) => c.replace(/"/g, '').trim().toLowerCase());
const coluna = colunas.findIndex((c) => c.includes('mail'));
if (coluna < 0) {
  console.error(`Não achei coluna de e-mail. Colunas: ${colunas.join(' | ')}`);
  process.exit(1);
}

const emails = [...new Set(linhas.slice(1).map((l) => normalizarEmail(l.split(separador)[coluna]?.replace(/"/g, ''))).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)))];
console.log(`${emails.length} e-mails únicos encontrados.`);
if (!flags.includes('--gravar')) {
  console.log('Nada foi gravado. Rode de novo com --gravar para liberar o acesso.');
  process.exit(0);
}

const sa = contaDeServico();
if (!sa) {
  console.error('Defina FIREBASE_SERVICE_ACCOUNT antes de gravar.');
  process.exit(1);
}
const db = firestore(sa);
let novos = 0;
for (const email of emails) {
  const atual = await db.ler(`entitlements/${email}`);
  if (atual?.status === 'vitalicio') continue;
  await db.gravar(`entitlements/${email}`, { email, status: 'vitalicio', origem: 'compra-cjo-27', atualizadoEm: new Date() });
  novos++;
}
console.log(`Acesso vitalício gravado para ${novos} e-mails (${emails.length - novos} já tinham).`);
