// E-mail transacional pelo Brevo (código de acesso, boas-vindas).
export async function enviarEmail({ para, assunto, html, texto }, env = process.env) {
  if (!env.BREVO_API_KEY || !env.BREVO_REMETENTE_EMAIL) return { ok: false, motivo: 'brevo_nao_configurado' };
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: env.BREVO_REMETENTE_EMAIL, name: env.BREVO_REMETENTE_NOME || 'Equipe Lume' },
      to: [{ email: para }],
      subject: assunto,
      htmlContent: html,
      textContent: texto,
    }),
  });
  return { ok: r.ok, status: r.status };
}

// E-mail do código de acesso, no visual do Lume (tema Dia, que lê melhor em qualquer app de e-mail).
export function emailDoCodigo(codigo) {
  const assunto = `Seu código do Lume: ${codigo}`;
  const texto = `Seu código para entrar no Lume é ${codigo}. Ele vale por 10 minutos.\n\nSe não foi você que pediu, pode ignorar este e-mail.\n\nEquipe Lume`;
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f6f8fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#16213a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden" cellpadding="0" cellspacing="0">
<tr><td style="background:#3554e0;padding:24px;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.03em">lume</td></tr>
<tr><td style="padding:28px 24px 8px;font-size:17px;line-height:24px">Seu código para entrar no Lume é:</td></tr>
<tr><td style="padding:8px 24px;font-size:40px;line-height:48px;font-weight:800;letter-spacing:0.12em">${codigo}</td></tr>
<tr><td style="padding:8px 24px 28px;font-size:15px;line-height:22px;color:#56627d">Ele vale por 10 minutos. Se não foi você que pediu, pode ignorar este e-mail.<br><br>Equipe Lume</td></tr>
</table></td></tr></table></body></html>`;
  return { assunto, texto, html };
}
