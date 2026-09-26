export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export type EmailSender = (message: EmailMessage) => Promise<void>;
