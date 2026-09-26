import { EmailSender } from "@/core/use-cases/_shared/email-sender.port";
import { consoleEmailSender } from "./console-email-sender";
import { createResendEmailSender } from "./resend-email-sender";

/**
 * Ponto único de composição do provedor de e-mail. Usa Resend quando
 * RESEND_API_KEY está configurada; caso contrário cai para o fallback de
 * console (dev sem chave configurada ainda).
 */
export function getEmailSender(): EmailSender {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return consoleEmailSender;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Planalto Futsal <onboarding@resend.dev>";
  return createResendEmailSender(apiKey, from);
}
