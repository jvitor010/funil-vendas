// Gera o CSS do app a partir do design system Lume (design/lume): tokens.css e componentes.css.
// Uso: node scripts/gerar-css-lume.mjs   (rode de novo sempre que tokens.json ou componentes.css mudarem)
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(join(raiz, 'design/lume/tokens.json'), 'utf8'));
const temas = t.color.themes.map((x) => x.id);
const valor = (tok, tema) => (typeof tok.value === 'string' ? tok.value : tok.value[tema] ?? tok.value[temas[0]]);
const porTema = [...t.color.tokens, ...(t.shadow?.tokens || [])];

const linhas = ['/* Lume — generated from tokens.json */'];
temas.forEach((tema, i) => {
  linhas.push(`${i === 0 ? `:root, [data-theme="${tema}"]` : `[data-theme="${tema}"]`} {`);
  for (const tok of porTema) linhas.push(`  --${tok.name}: ${valor(tok, tema)};`);
  linhas.push(`  color-scheme: ${tema === 'dia' ? 'light' : 'dark'};`, '}');
});
linhas.push(':root {');
for (const familia of ['spacing', 'radius', 'alvo']) for (const tok of t[familia].tokens) linhas.push(`  --${tok.name}: ${tok.value};`);
for (const [k, v] of Object.entries(t.type.families)) linhas.push(`  --font-${k}: ${v};`);
linhas.push('}');
for (const g of t.type.groups) {
  for (const s of g.styles) {
    const ls = s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : '';
    linhas.push(`.${s.name} { font-family: var(--font-${s.family || g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${ls} }`);
  }
}
writeFileSync(join(raiz, 'Funil CJO/app/tokens.css'), linhas.join('\n') + '\n');
copyFileSync(join(raiz, 'design/lume/componentes.css'), join(raiz, 'Funil CJO/app/componentes.css'));
console.log('tokens.css e componentes.css gerados em Funil CJO/app/');
