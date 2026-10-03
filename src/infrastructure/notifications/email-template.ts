interface EmailTemplateInput {
  origin: string;
  titulo: string;
  paragrafos: string[];
  linkBotao: string;
  textoBotao: string;
  avisoRodape?: string;
}

/**
 * Template HTML compartilhado pelos e-mails transacionais (verificação de
 * cadastro, redefinição de senha etc.) — mesma identidade visual do site:
 * fundo escuro, faixa vermelha com o escudo, botão de ação em destaque.
 */
export function emailTemplateBranded({
  origin,
  titulo,
  paragrafos,
  linkBotao,
  textoBotao,
  avisoRodape,
}: EmailTemplateInput): string {
  const corpoParagrafos = paragrafos
    .map((paragrafo) => `<p style="margin:0 0 16px;line-height:1.5;color:#d4d4d4;">${paragrafo}</p>`)
    .join("");

  return `
    <div style="background-color:#0d0d0d;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:480px;margin:0 auto;background-color:#161616;border-radius:10px;overflow:hidden;border:1px solid #2a2a2a;">
        <div style="background-color:#C41E24;padding:28px 24px;text-align:center;">
          <img src="${origin}/images/marca/escudo-planalto-futsal.png" alt="Planalto Futsal" width="56" height="56" style="border-radius:50%;display:inline-block;" />
          <p style="margin:12px 0 0;color:#ffffff;font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Planalto Futsal</p>
        </div>
        <div style="padding:28px 24px;">
          <h1 style="color:#ffffff;font-size:20px;margin:0 0 16px;">${titulo}</h1>
          ${corpoParagrafos}
          <p style="text-align:center;margin:28px 0 8px;">
            <a href="${linkBotao}" style="background-color:#C41E24;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">${textoBotao}</a>
          </p>
          <p style="font-size:12px;color:#777;word-break:break-all;margin:16px 0 0;">${linkBotao}</p>
          ${avisoRodape ? `<p style="font-size:12px;color:#777;margin:20px 0 0;">${avisoRodape}</p>` : ""}
        </div>
      </div>
    </div>
  `;
}
