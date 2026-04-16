/* wa-btn.js — Botón flotante WhatsApp · Muebles Fran */
(function () {
  var PHONE   = '34644484563';
  var MESSAGE = '¡Hola! He visitado vuestra web y me gustaría obtener información y un presupuesto sin compromiso. ¡Gracias! 😊';
  var URL     = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(MESSAGE);

  /* Inyectar estilos inline para no depender del CSS externo */
  var style = document.createElement('style');
  style.textContent = [
    '.wa-fab{position:fixed;bottom:28px;right:28px;z-index:99999;display:flex;align-items:center;gap:10px;text-decoration:none;cursor:pointer;}',
    '.wa-fab-btn{width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(37,211,102,.45);transition:transform .2s,box-shadow .2s;flex-shrink:0;animation:waPulse 2.4s ease-in-out infinite;}',
    '.wa-fab:hover .wa-fab-btn{transform:scale(1.08);box-shadow:0 6px 24px rgba(37,211,102,.6);animation:none;}',
    '.wa-fab-tip{background:#fff;color:#1a1a1a;font-size:.82rem;font-weight:600;padding:7px 13px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.13);white-space:nowrap;opacity:0;transform:translateX(8px);transition:opacity .22s,transform .22s;pointer-events:none;font-family:inherit;}',
    '.wa-fab:hover .wa-fab-tip{opacity:1;transform:translateX(0);}',
    '@keyframes waPulse{0%{box-shadow:0 4px 18px rgba(37,211,102,.45)}50%{box-shadow:0 4px 28px rgba(37,211,102,.75),0 0 0 8px rgba(37,211,102,.12)}100%{box-shadow:0 4px 18px rgba(37,211,102,.45)}}',
    '@media(max-width:600px){.wa-fab{bottom:18px;right:18px;}.wa-fab-btn{width:52px;height:52px;}.wa-fab-tip{display:none;}}'
  ].join('');
  document.head.appendChild(style);

  /* Crear el botón */
  var a = document.createElement('a');
  a.className = 'wa-fab';
  a.href = URL;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', 'Contactar por WhatsApp');

  var tip = document.createElement('span');
  tip.className = 'wa-fab-tip';
  tip.textContent = '¡Escríbenos por WhatsApp!';

  var btn = document.createElement('span');
  btn.className = 'wa-fab-btn';

  /* SVG con width y height explícitos */
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" fill="#fff"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.736 5.469 2.027 7.773L0 32l8.476-2.002A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.74-1.833l-.484-.287-5.03 1.188 1.21-4.897-.317-.503A13.261 13.261 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.29-9.878c-.398-.2-2.358-1.162-2.723-1.295-.366-.133-.633-.2-.9.2-.266.4-1.032 1.295-1.265 1.561-.233.266-.466.3-.864.1-.398-.2-1.68-.619-3.2-1.973-1.183-1.054-1.982-2.355-2.215-2.755-.233-.4-.025-.616.175-.815.18-.179.398-.466.598-.699.2-.233.266-.4.4-.666.133-.266.066-.5-.033-.699-.1-.2-.9-2.168-1.232-2.968-.325-.78-.656-.674-.9-.686l-.766-.013c-.266 0-.699.1-1.065.5-.366.4-1.398 1.366-1.398 3.333s1.432 3.866 1.632 4.132c.2.266 2.817 4.3 6.826 6.033.954.411 1.699.657 2.281.842.958.305 1.831.262 2.52.159.769-.115 2.358-.964 2.69-1.895.333-.932.333-1.73.233-1.895-.1-.166-.366-.266-.764-.466z"/></svg>';

  a.appendChild(tip);
  a.appendChild(btn);

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(a);
  });

  // Si el DOM ya cargó (script al final del body)
  if (document.readyState !== 'loading') {
    document.body.appendChild(a);
  }
})();
