/* ============================================
   ANTI-SPY SHIELD v2.0 — CJO Método
   Proteção contra espionagem de concorrentes
   ============================================ */

(function(){
  // 1. Bloquear menu de contexto (botão direito)
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); }, false);

  // 2. Bloquear atalhos de DevTools e View Source
  document.addEventListener('keydown', function(e){
    // F12
    if(e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+Shift+I (Inspecionar)
    if(e.ctrlKey && e.shiftKey && e.key === 'I') { e.preventDefault(); return false; }
    // Ctrl+Shift+J (Console)
    if(e.ctrlKey && e.shiftKey && e.key === 'J') { e.preventDefault(); return false; }
    // Ctrl+Shift+C (Seletor de elementos)
    if(e.ctrlKey && e.shiftKey && e.key === 'C') { e.preventDefault(); return false; }
    // Ctrl+U (View Source)
    if(e.ctrlKey && e.key === 'u') { e.preventDefault(); return false; }
    // Ctrl+S (Save Page)
    if(e.ctrlKey && e.key === 's') { e.preventDefault(); return false; }
    // Ctrl+A (Select All)
    if(e.ctrlKey && e.key === 'a') { e.preventDefault(); return false; }
    // Ctrl+C (Copy)
    if(e.ctrlKey && e.key === 'c') { e.preventDefault(); return false; }
    // Ctrl+P (Print)
    if(e.ctrlKey && e.key === 'p') { e.preventDefault(); return false; }
  }, false);

  // 3. Bloquear seleção de texto via CSS injection
  var s = document.createElement('style');
  s.textContent = '*, *::before, *::after { -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; user-select: none !important; } img { -webkit-user-drag: none !important; user-drag: none !important; pointer-events: auto; }';
  document.head.appendChild(s);

  // 4. Bloquear arrastar imagens
  document.addEventListener('dragstart', function(e){ e.preventDefault(); }, false);

  // 5. Bloquear copiar
  document.addEventListener('copy', function(e){ e.preventDefault(); }, false);

  // 6. Detectar DevTools aberto (debugger trap)
  var dt = new Image();
  Object.defineProperty(dt, 'id', {
    get: function(){
      // DevTools está aberto — redirecionar
      window.location.href = 'about:blank';
    }
  });

  // 7. Console warning
  console.log('%c⛔ ACESSO NÃO AUTORIZADO', 'color: red; font-size: 40px; font-weight: bold;');
  console.log('%cEste site é protegido. Qualquer tentativa de cópia, inspeção ou extração de código será registrada.', 'color: gray; font-size: 14px;');

  // 8. Anti-iframe (impede embed em spy tools)
  if(window.top !== window.self){
    window.top.location = window.self.location;
  }

  // 9. Bloquear print screen via CSS
  var ps = document.createElement('style');
  ps.textContent = '@media print { body { display: none !important; } }';
  document.head.appendChild(ps);

})();
