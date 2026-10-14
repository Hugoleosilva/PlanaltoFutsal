import { NextRequest, NextResponse } from "next/server";
import { getEmailSender } from "@/infrastructure/notifications/get-email-sender";

/**
 * Rota temporária de diagnóstico (caminho não listado em lugar nenhum) —
 * confirma que o envio de e-mail funciona pro domínio verificado. Remover
 * depois de confirmar.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const destino = request.nextUrl.searchParams.get("para");
  if (!destino) {
    return NextResponse.json({ error: "informe ?para=email@exemplo.com" }, { status: 400 });
  }

  const diagnostico = {
    temResendApiKey: Boolean(process.env.RESEND_API_KEY),
    resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "(padrão onboarding@resend.dev)",
  };

  try {
    await getEmailSender()({
      to: destino,
      subject: "Teste de diagnóstico — Planalto Futsal",
      html: "<p>Teste de envio de e-mail com o domínio verificado.</p>",
    });
    return NextResponse.json({ ok: true, ...diagnostico });
  } catch (error) {
    return NextResponse.json(
      { ok: false, ...diagnostico, erro: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
