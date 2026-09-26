import { Resend } from "resend";
import { EmailSender } from "@/core/use-cases/_shared/email-sender.port";

export function createResendEmailSender(apiKey: string, from: string): EmailSender {
  const resend = new Resend(apiKey);

  return async ({ to, subject, html }) => {
    const { error } = await resend.emails.send({ from, to, subject, html });

    if (error) {
      throw new Error(`Falha ao enviar e-mail via Resend: ${error.message}`);
    }
  };
}
