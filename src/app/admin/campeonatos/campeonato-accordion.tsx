"use client";

import { useActionState, useState } from "react";
import { ChevronDown } from "lucide-react";
import { vincularAtletaAction, type ActionState } from "./actions";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/cn";

const INITIAL_STATE: ActionState = { error: null };

const STATUS_LABEL: Record<string, string> = {
  OPORTUNIDADE: "Oportunidade",
  INSCRITO: "Inscrito",
  EM_ANDAMENTO: "Em andamento",
  ENCERRADO: "Encerrado",
};

interface AtletaVinculado {
  atletaId: string;
  apelido: string;
  categoria?: string;
}

interface AtletaOpcao {
  id: string;
  apelido: string;
}

interface CampeonatoAccordionProps {
  campeonatoId: string;
  nome: string;
  status: string;
  taxaInscricao: number | null;
  taxaArbitragem: number | null;
  inscritos: AtletaVinculado[];
  atletasDisponiveis: AtletaOpcao[];
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CampeonatoAccordion({
  campeonatoId,
  nome,
  status,
  taxaInscricao,
  taxaArbitragem,
  inscritos,
  atletasDisponiveis,
}: CampeonatoAccordionProps): React.ReactElement {
  const [expandido, setExpandido] = useState(false);
  const [state, formAction, isPending] = useActionState(vincularAtletaAction, INITIAL_STATE);

  return (
    <div className="rounded-lg border border-white/10 bg-card">
      <button
        type="button"
        onClick={() => setExpandido((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <p className="font-semibold text-planalto-white">{nome}</p>
          <p className="text-xs text-planalto-gray">
            {inscritos.length} atleta(s) vinculado(s)
            {taxaInscricao != null
              ? ` · inscrição ${taxaInscricao === 0 ? "grátis" : formatBRL(taxaInscricao)}`
              : ""}
            {taxaArbitragem != null
              ? ` · arbitragem ${taxaArbitragem === 0 ? "grátis" : formatBRL(taxaArbitragem)}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{STATUS_LABEL[status] ?? status}</Badge>
          <ChevronDown
            size={18}
            className={cn("text-planalto-gray transition-transform", expandido && "rotate-180")}
          />
        </div>
      </button>

      {expandido ? (
        <div className="space-y-4 border-t border-white/10 px-5 py-4">
          {inscritos.length === 0 ? (
            <p className="text-sm text-planalto-gray">Nenhum atleta vinculado ainda.</p>
          ) : (
            <ul className="space-y-1">
              {inscritos.map((inscrito) => (
                <li key={inscrito.atletaId} className="text-sm text-planalto-white">
                  {inscrito.apelido}
                  {inscrito.categoria ? (
                    <span className="text-planalto-gray"> · {inscrito.categoria}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="campeonatoId" value={campeonatoId} />

            <div className="space-y-1">
              <label className="text-xs text-planalto-gray" htmlFor={`atleta-${campeonatoId}`}>
                Atleta
              </label>
              <Select id={`atleta-${campeonatoId}`} name="atletaId" required className="min-w-[180px]">
                <option value="">Selecione...</option>
                {atletasDisponiveis.map((atleta) => (
                  <option key={atleta.id} value={atleta.id}>
                    {atleta.apelido}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-planalto-gray" htmlFor={`categoria-${campeonatoId}`}>
                Categoria (opcional)
              </label>
              <Input id={`categoria-${campeonatoId}`} name="categoria" placeholder="Sub-20" className="w-32" />
            </div>

            <Button type="submit" variant="secondary" disabled={isPending}>
              {isPending ? "Vinculando..." : "Vincular"}
            </Button>
          </form>

          {state.error ? <p className="text-xs text-planalto-red">{state.error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
