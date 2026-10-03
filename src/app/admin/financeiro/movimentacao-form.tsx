"use client";

import { useActionState, useState } from "react";
import { ChevronDown } from "lucide-react";
import { registrarMovimentacaoAction, type ActionState } from "./actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { ComprovanteUpload } from "@/shared/components/comprovante-upload";
import { cn } from "@/shared/utils/cn";

const INITIAL_STATE: ActionState = { error: null };

export function MovimentacaoForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState(registrarMovimentacaoAction, INITIAL_STATE);
  const [comprovanteUrl, setComprovanteUrl] = useState<string | undefined>();
  const [aberto, setAberto] = useState(true);
  const [tipo, setTipo] = useState<"RECEITA" | "DESPESA">("RECEITA");

  return (
    <div className="rounded-lg border border-surface/10 bg-card">
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h2 className="font-heading text-lg font-bold text-foreground">Nova Movimentação</h2>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {aberto ? "Ocultar" : "Mostrar"}
          <ChevronDown size={18} className={cn("transition-transform", aberto && "rotate-180")} />
        </span>
      </button>

      {aberto ? (
      <form action={formAction} className="grid grid-cols-1 gap-4 border-t border-surface/10 px-6 py-4 sm:grid-cols-2">
        <input type="hidden" name="comprovanteUrl" value={comprovanteUrl ?? ""} />

        <div className="space-y-1">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            id="tipo"
            name="tipo"
            value={tipo}
            onChange={(event) => setTipo(event.target.value as "RECEITA" | "DESPESA")}
          >
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input id="valor" name="valor" type="number" step="0.01" min="0" required />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" name="descricao" required maxLength={300} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="data">Data</Label>
          <Input id="data" name="data" type="date" required />
        </div>

        {tipo === "RECEITA" ? (
          <div className="space-y-1">
            <Label htmlFor="origemReceita">Origem da Receita</Label>
            <Select id="origemReceita" name="origemReceita" defaultValue="APOIADORES">
              <option value="COLABORACAO_INTERNA">Colaboração Interna (Dirigentes/Atletas)</option>
              <option value="APOIADORES">Apoiadores (Comunidade Local)</option>
              <option value="PATROCINADORES">Patrocinadores (Empresas/Parceiros)</option>
              <option value="VENDAS">Vendas (Produtos/Serviços)</option>
            </Select>
          </div>
        ) : (
          <div className="space-y-1">
            <Label htmlFor="categoria">Categoria (Opcional)</Label>
            <Input id="categoria" name="categoria" placeholder="Ex: arbitragem, uniformes..." />
          </div>
        )}

        {state.error ? (
          <p className="text-sm text-planalto-red sm:col-span-2">{state.error}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <ComprovanteUpload
            value={comprovanteUrl}
            onUploaded={setComprovanteUrl}
            onRemover={() => setComprovanteUrl(undefined)}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Registrar movimentação"}
          </Button>
        </div>
      </form>
      ) : null}
    </div>
  );
}
