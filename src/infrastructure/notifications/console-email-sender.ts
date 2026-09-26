import { EmailSender } from "@/core/use-cases/_shared/email-sender.port";

/**
 * Adaptador provisório: nenhum provedor de e-mail (Resend, Gmail SMTP etc.)
 * foi configurado ainda, então em vez de falhar silenciosamente o link de
 * verificação é logado no console do servidor — dá pra testar o fluxo
 * completo em dev. Trocar por um adaptador real antes de ir pra produção.
 */
export const consoleEmailSender: EmailSender = async ({ to, subject, html }) => {
  console.log("\n[email:console-fallback] Nenhum provedor de e-mail configurado.");
  console.log(`  Para: ${to}`);
  console.log(`  Assunto: ${subject}`);
  console.log(`  Conteúdo:\n${html}\n`);
};
