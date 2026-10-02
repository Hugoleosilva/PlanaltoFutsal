"use client";

import { useMemo, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Select } from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/cn";
import { DeleteMovimentacaoButton } from "./delete-movimentacao-button";

interface MovimentacaoItem {
  id: string;
  descricao: string;
  data: Date;
  categoria?: string;
  tipo: "RECEITA" | "DESPESA";
  valor: number;
  comprovanteUrl?: string | null;
}

type Ordenacao = "recente" | "antiga";
type FiltroTipo = "TODOS" | "RECEITA" | "DESPESA";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(data: Date): string {
  return data.toLocaleDateString("pt-BR");
}

export function MovimentacoesList({
  movimentacoes,
}: {
  movimentacoes: MovimentacaoItem[];
}): React.ReactElement {
  const [aberto, setAberto] = useState(true);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recente");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("TODOS");

  const listaExibida = useMemo(() => {
    const filtrada =
      filtroTipo === "TODOS"
        ? movimentacoes
        : movimentacoes.filter((mov) => mov.tipo === filtroTipo);

    return [...filtrada].sort((a, b) =>
      ordenacao === "recente"
        ? b.data.getTime() - a.data.getTime()
        : a.data.getTime() - b.data.getTime(),
    );
  }, [movimentacoes, ordenacao, filtroTipo]);

  return (
    <div className="rounded-lg border border-white/10 bg-card">
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h2 className="font-heading text-lg font-bold text-planalto-white">
          Movimentações recentes
        </h2>
        <span className="flex items-center gap-2 text-sm text-planalto-gray">
          {aberto ? "Ocultar" : "Mostrar"}
          <ChevronDown size={18} className={cn("transition-transform", aberto && "rotate-180")} />
        </span>
      </button>

      {aberto ? (
        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <Select
              value={ordenacao}
              onChange={(event) => setOrdenacao(event.target.value as Ordenacao)}
              className="w-44"
            >
              <option value="recente">Mais recente</option>
              <option value="antiga">Mais antiga</option>
            </Select>

            <Select
              value={filtroTipo}
              onChange={(event) => setFiltroTipo(event.target.value as FiltroTipo)}
              className="w-40"
            >
              <option value="TODOS">Receita e despesa</option>
              <option value="RECEITA">Só receita</option>
              <option value="DESPESA">Só despesa</option>
            </Select>
          </div>

          {listaExibida.length === 0 ? (
            <p className="mt-4 text-sm text-planalto-gray">Nenhuma movimentação para esse filtro.</p>
          ) : (
            <div className="mt-4 divide-y divide-white/10">
              {listaExibida.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-planalto-white">{mov.descricao}</p>
                    <p className="text-xs text-planalto-gray">
                      {formatData(mov.data)} {mov.categoria ? `· ${mov.categoria}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {mov.comprovanteUrl ? (
                      <a
                        href={mov.comprovanteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Ver comprovante"
                        className="text-planalto-gray hover:text-planalto-white"
                      >
                        <FileText size={16} />
                      </a>
                    ) : null}
                    <Badge tone={mov.tipo === "RECEITA" ? "success" : "danger"}>
                      {mov.tipo === "RECEITA" ? "+" : "-"}
                      {formatBRL(mov.valor)}
                    </Badge>
                    <DeleteMovimentacaoButton id={mov.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
