// Lume · service worker (escopo /app). Fica na raiz porque o app abre em /app, sem barra no fim.
// Funciona offline e recebe os avisos (Web Push). Mude VERSAO a cada publicação que altere arquivos do app.
const VERSAO = 'lume-2026-10-13-1';
const FONTES = 'lume-fontes';
const SHELL = [
  '/app',
  '/app/app.css',
  '/app/tokens.css',
  '/app/componentes.css',
  '/app/app.js',
  '/app/engine.js',
  '/app/migracao.js',
  '/app/manifest.json',
  '/app/icones/icone-192.png',
  '/app/icones/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO && n !== FONTES).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

const doApp = (url) => url.origin === self.location.origin && (url.pathname === '/app' || url.pathname.startsWith('/app/'));

async function redePrimeiro(req) {
  try {
    const r = await fetch(req);
    if (r.ok) (await caches.open(VERSAO)).put('/app', r.clone());
    return r;
  } catch {
    return (await caches.match('/app')) || Response.error();
  }
}

async function cacheEAtualiza(req, nome) {
  const cache = await caches.open(nome);
  const guardado = await cache.match(req);
  const busca = fetch(req).then((r) => {
    if (r.ok || r.type === 'opaque') cache.put(req, r.clone());
    return r;
  }).catch(() => guardado);
  return guardado || busca;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (doApp(url)) {
    e.respondWith(req.mode === 'navigate' ? redePrimeiro(req) : cacheEAtualiza(req, VERSAO));
  } else if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    e.respondWith(cacheEAtualiza(req, FONTES));
  }
});

self.addEventListener('push', (e) => {
  let d = {};
  try {
    d = e.data ? e.data.json() : {};
  } catch {
    d = { titulo: 'Lume', texto: e.data ? e.data.text() : '' };
  }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Lume', {
    body: d.texto || '',
    tag: d.tag || 'lume',
    renotify: true,
    icon: '/app/icones/icone-192.png',
    badge: '/app/icones/icone-192.png',
    data: { url: d.url || '/app' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const destino = e.notification.data?.url || '/app';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      const aberto = lista.find((c) => new URL(c.url).pathname.startsWith('/app'));
      return aberto ? aberto.focus() : self.clients.openWindow(destino);
    }),
  );
});
