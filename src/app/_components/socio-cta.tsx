"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { HeartHandshake, ChevronDown, Trophy, Percent, Gift, Sparkles } from "lucide-react";
import { tornarSocioAction, type ActionState } from "@/app/apoie/actions";
import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/cn";
import { PixValorFixo } from "./pix-valor-fixo";

const INITIAL_STATE: ActionState = { error: null };

const VALORES_MENSAIS = [5, 10, 15];
const VALORES_UNICOS_SUGERIDOS = [20, 50, 100];
const DIAS_VENCIMENTO = Array.from({ length: 28 }, (_, i) => i + 1);

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const VANTAGENS = [
  { icon: Trophy, texto: "Acesso a jogos (ilustrativo — em breve)" },
  { icon: Percent, texto: "Descontos em produtos da loja" },
  { icon: Gift, texto: "Participação em sorteios" },
  { icon: Sparkles, texto: "E mais vantagens a caminho" },
];

export function SocioCta({
  logado,
  jaEhSocio,
  planoAtual,
  contribuicaoPendenteValor,
}: {
  logado: boolean;
  jaEhSocio: boolean;
  planoAtual: { tipo: "MENSAL" | "UNICO"; valor: number; diaVencimento?: number | null } | null;
  contribuicaoPendenteValor: number | null;
}): React.ReactElement {
  const [state, formAction, isPending] = useActionState(tornarSocioAction, INITIAL_STATE);
  const [saibaMaisAberto, setSaibaMaisAberto] = useState(false);
  const [tipo, setTipo] = useState<"MENSAL" | "UNICO">("MENSAL");
  const [valorSelecionado, setValorSelecionado] = useState<number | "OUTRO">(5);
  const [valorCustom, setValorCustom] = useState("");
  const [diaVencimento, setDiaVencimento] = useState(5);

  const virouSocioAgora = state.sucesso === true && state.contribuicaoValor;
  const pixParaMostrar = virouSocioAgora ? state.contribuicaoValor! : contribuicaoPendenteValor;

  const valorFinal = valorSelecionado === "OUTRO" ? Number(valorCustom) : valorSelecionado;

  return (
    <div className="rounded-lg border border-white/10 bg-card p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-planalto-red">
        <HeartHandshake size={22} />
        <p className="font-heading text-lg font-bold text-planalto-white">
          Planalto Meu Amor! — Dá essa moral, apoiando nosso time?
        </p>
      </div>
      <p className="mt-2 text-sm text-planalto-gray">
        A partir de <span className="font-semibold text-planalto-white">R$ 5</span> por mês você já
        ajuda a manter as despesas do time — arbitragem, uniformes e inscrições em campeonatos.
      </p>

      <button
        type="button"
        onClick={() => setSaibaMaisAberto((prev) => !prev)}
        className="mx-auto mt-3 flex items-center gap-1 text-xs font-semibold text-planalto-white hover:underline"
      >
        Saiba mais
        <ChevronDown size={14} className={cn("transition-transform", saibaMaisAberto && "rotate-180")} />
      </button>

      {saibaMaisAberto ? (
        <div className="mx-auto mt-3 max-w-md space-y-2 rounded-md bg-black/20 p-4 text-left">
          <p className="text-xs text-planalto-gray">
            Sendo sócio Planalto Meu Amor!, você ajuda a manter o time de pé e ainda fica de olho em
            vantagens que vamos liberando aos poucos:
          </p>
          {VANTAGENS.map(({ icon: Icon, texto }) => (
            <p key={texto} className="flex items-center gap-2 text-xs text-planalto-white">
              <Icon size={14} className="shrink-0 text-planalto-red" />
              {texto}
            </p>
          ))}
        </div>
      ) : null}

      {!logado ? (
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/login?callbackUrl=/apoie"
            className="rounded-md bg-planalto-red px-4 py-2 text-sm font-semibold text-white hover:bg-planalto-red-dark"
          >
            Fazer Login
          </Link>
          <Link
            href="/cadastro"
            className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Criar conta
          </Link>
        </div>
      ) : jaEhSocio && planoAtual ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-semibold text-planalto-white">
            Você já é sócio Planalto Meu Amor! Valeu por fazer parte disso! 💜
          </p>
          <p className="text-xs text-planalto-gray">
            Plano atual:{" "}
            {planoAtual.tipo === "MENSAL"
              ? `mensal de ${formatBRL(planoAtual.valor)}, todo dia ${planoAtual.diaVencimento}`
              : `aporte único de ${formatBRL(planoAtual.valor)}`}
          </p>
          {pixParaMostrar ? (
            <div>
              <p className="mb-2 text-xs text-planalto-gray">
                Você tem uma contribuição pendente — pague pelo Pix abaixo:
              </p>
              <PixValorFixo valor={pixParaMostrar} />
            </div>
          ) : (
            <p className="text-xs text-planalto-gray">Nenhuma contribuição pendente no momento.</p>
          )}
        </div>
      ) : virouSocioAgora ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-planalto-white">
            Prontinho! Você agora é sócio Planalto Meu Amor! 💜 Pague sua primeira contribuição:
          </p>
          <PixValorFixo valor={state.contribuicaoValor!} />
        </div>
      ) : (
        <form action={formAction} className="mt-5 space-y-4 text-left">
          {jaEhSocio ? (
            <p className="text-center text-sm font-semibold text-planalto-white">
              Você já é sócio Planalto Meu Amor! Falta só escolher seu plano de contribuição:
            </p>
          ) : null}
          <input type="hidden" name="tipo" value={tipo} />
          <input type="hidden" name="valor" value={valorFinal || ""} />
          <input type="hidden" name="diaVencimento" value={diaVencimento} />

          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTipo("MENSAL");
                setValorSelecionado(5);
              }}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition",
                tipo === "MENSAL"
                  ? "bg-planalto-red text-white"
                  : "bg-white/10 text-planalto-gray hover:bg-white/20",
              )}
            >
              Apoio mensal
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo("UNICO");
                setValorSelecionado(20);
              }}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition",
                tipo === "UNICO"
                  ? "bg-planalto-red text-white"
                  : "bg-white/10 text-planalto-gray hover:bg-white/20",
              )}
            >
              Aporte único
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {(tipo === "MENSAL" ? VALORES_MENSAIS : VALORES_UNICOS_SUGERIDOS).map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setValorSelecionado(valor)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition",
                  valorSelecionado === valor
                    ? "border-planalto-red bg-planalto-red/20 text-planalto-white"
                    : "border-white/10 text-planalto-gray hover:border-white/30",
                )}
              >
                {formatBRL(valor)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setValorSelecionado("OUTRO")}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition",
                valorSelecionado === "OUTRO"
                  ? "border-planalto-red bg-planalto-red/20 text-planalto-white"
                  : "border-white/10 text-planalto-gray hover:border-white/30",
              )}
            >
              Outro valor
            </button>
          </div>

          {valorSelecionado === "OUTRO" ? (
            <div className="mx-auto flex max-w-[200px] items-center gap-2">
              <span className="text-sm text-planalto-gray">R$</span>
              <input
                type="number"
                min={1}
                step="0.01"
                value={valorCustom}
                onChange={(event) => setValorCustom(event.target.value)}
                placeholder="0,00"
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-white outline-none focus:border-planalto-red"
              />
            </div>
          ) : null}

          {tipo === "MENSAL" ? (
            <div className="mx-auto flex max-w-[240px] items-center justify-center gap-2">
              <span className="text-xs text-planalto-gray">Todo dia</span>
              <Select
                value={diaVencimento}
                onChange={(event) => setDiaVencimento(Number(event.target.value))}
                className="w-20"
              >
                {DIAS_VENCIMENTO.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </Select>
              <span className="text-xs text-planalto-gray">do mês</span>
            </div>
          ) : null}

          <p className="text-center text-xs text-planalto-gray">
            Sua primeira contribuição já é gerada agora, com Pix pra pagar na hora. Como não temos
            gateway de pagamento, os próximos meses dependem de você mesmo pagar na data escolhida —
            a diretoria confirma o recebimento.
          </p>

          <div className="flex justify-center">
            <Button type="submit" disabled={isPending || !valorFinal || valorFinal <= 0}>
              {isPending ? "Confirmando..." : jaEhSocio ? "Confirmar plano" : "Quero ser sócio"}
            </Button>
          </div>

          {state.error ? <p className="text-center text-sm text-planalto-red">{state.error}</p> : null}
        </form>
      )}
    </div>
  );
}
