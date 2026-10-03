"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  BarChart,
} from "recharts";
import { Select } from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/cn";

export interface MovimentacaoAnalyticsItem {
  id: string;
  tipo: "RECEITA" | "DESPESA";
  valor: number;
  data: string;
  categoria?: string;
  origemReceita?: "COLABORACAO_INTERNA" | "APOIADORES" | "PATROCINADORES" | null;
}

type PeriodoResolvido = { tipo: "MES"; ano: number; mes: number } | { tipo: "ANO"; ano: number };

const INK_SECONDARY = "#c3c2b7";
const INK_MUTED = "#898781";
const GRIDLINE = "#2c2c2a";
const BASELINE = "#383835";
const COR_RECEITA = "#0ca30c";
const COR_DESPESA = "#e66767";
const COR_SALDO = "#3987e5";

const ORIGEM_LABEL: Record<string, string> = {
  COLABORACAO_INTERNA: "Colaboração Interna",
  APOIADORES: "Apoiadores",
  PATROCINADORES: "Patrocinadores",
};
const CORES_ORIGEM = ["#3987e5", "#d95926", "#199e70"];

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatBRLCompacto(valor: number): string {
  return Math.abs(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_LONGOS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function periodoAtualMes(): PeriodoResolvido {
  const agora = new Date();
  return { tipo: "MES", ano: agora.getFullYear(), mes: agora.getMonth() };
}

function resolverPeriodo(selecao: string): PeriodoResolvido {
  const agora = new Date();
  if (selecao === "ESTE_MES") return { tipo: "MES", ano: agora.getFullYear(), mes: agora.getMonth() };
  if (selecao === "ESTE_ANO") return { tipo: "ANO", ano: agora.getFullYear() };

  const [, anoStr, mesStr] = selecao.split("-");
  return { tipo: "MES", ano: Number(anoStr), mes: Number(mesStr) };
}

function mesesAnteriores(movs: MovimentacaoAnalyticsItem[]): { ano: number; mes: number }[] {
  const atual = periodoAtualMes();
  const encontrados = new Map<string, { ano: number; mes: number }>();

  movs.forEach((m) => {
    const d = new Date(m.data);
    const ano = d.getFullYear();
    const mes = d.getMonth();
    if (atual.tipo === "MES" && ano === atual.ano && mes === atual.mes) return;
    encontrados.set(`${ano}-${mes}`, { ano, mes });
  });

  return [...encontrados.values()].sort((a, b) => b.ano - a.ano || b.mes - a.mes);
}

function buildSerieTemporal(movs: MovimentacaoAnalyticsItem[], periodo: PeriodoResolvido) {
  if (periodo.tipo === "MES") {
    const { ano, mes } = periodo;
    const inicioPeriodo = new Date(ano, mes, 1);
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    let acumulado = movs
      .filter((m) => new Date(m.data) < inicioPeriodo)
      .reduce((total, m) => total + (m.tipo === "DESPESA" ? -m.valor : m.valor), 0);

    const pontos = [];
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const doDia = movs.filter((m) => {
        const d = new Date(m.data);
        return d.getFullYear() === ano && d.getMonth() === mes && d.getDate() === dia;
      });
      const receita = doDia.filter((m) => m.tipo === "RECEITA").reduce((t, m) => t + m.valor, 0);
      const despesa = doDia.filter((m) => m.tipo === "DESPESA").reduce((t, m) => t + m.valor, 0);
      acumulado += receita - despesa;
      pontos.push({ label: String(dia), receita, despesa: -despesa, saldo: acumulado });
    }
    return pontos;
  }

  const { ano } = periodo;
  const inicioPeriodo = new Date(ano, 0, 1);
  let acumulado = movs
    .filter((m) => new Date(m.data) < inicioPeriodo)
    .reduce((total, m) => total + (m.tipo === "DESPESA" ? -m.valor : m.valor), 0);

  const pontos = [];
  for (let mes = 0; mes < 12; mes++) {
    const doMes = movs.filter((m) => {
      const d = new Date(m.data);
      return d.getFullYear() === ano && d.getMonth() === mes;
    });
    const receita = doMes.filter((m) => m.tipo === "RECEITA").reduce((t, m) => t + m.valor, 0);
    const despesa = doMes.filter((m) => m.tipo === "DESPESA").reduce((t, m) => t + m.valor, 0);
    acumulado += receita - despesa;
    pontos.push({ label: MESES[mes], receita, despesa: -despesa, saldo: acumulado });
  }
  return pontos;
}

function noPeriodo(data: string, periodo: PeriodoResolvido): boolean {
  const d = new Date(data);
  if (periodo.tipo === "MES") {
    return d.getFullYear() === periodo.ano && d.getMonth() === periodo.mes;
  }
  return d.getFullYear() === periodo.ano;
}

function buildOrigemReceita(movs: MovimentacaoAnalyticsItem[], periodo: PeriodoResolvido) {
  const totals: Record<string, number> = {
    COLABORACAO_INTERNA: 0,
    APOIADORES: 0,
    PATROCINADORES: 0,
  };

  movs
    .filter((m) => m.tipo === "RECEITA" && noPeriodo(m.data, periodo))
    .forEach((m) => {
      const key = m.origemReceita ?? "APOIADORES";
      totals[key] = (totals[key] ?? 0) + m.valor;
    });

  const total = Object.values(totals).reduce((a, b) => a + b, 0);

  return Object.entries(totals).map(([key, valor]) => ({
    key,
    label: ORIGEM_LABEL[key],
    valor,
    pct: total > 0 ? (valor / total) * 100 : 0,
  }));
}

function buildDespesasPorCategoria(movs: MovimentacaoAnalyticsItem[], periodo: PeriodoResolvido) {
  const totals = new Map<string, number>();

  movs
    .filter((m) => m.tipo === "DESPESA" && noPeriodo(m.data, periodo))
    .forEach((m) => {
      const categoria = m.categoria?.trim() || "Sem Categoria";
      totals.set(categoria, (totals.get(categoria) ?? 0) + m.valor);
    });

  const total = [...totals.values()].reduce((a, b) => a + b, 0);

  return [...totals.entries()]
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      pct: total > 0 ? (valor / total) * 100 : 0,
    }))
    .sort((a, b) => b.valor - a.valor);
}

function ChartCard({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}): React.ReactElement {
  const [aberto, setAberto] = useState(true);

  return (
    <div className="rounded-lg border border-surface/10 bg-card">
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h2 className="font-heading text-lg font-bold text-foreground">{titulo}</h2>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {aberto ? "Ocultar" : "Mostrar"}
          <ChevronDown size={18} className={cn("transition-transform", aberto && "rotate-180")} />
        </span>
      </button>

      {aberto ? <div className="border-t border-surface/10 px-6 py-4">{children}</div> : null}
    </div>
  );
}

function TooltipCombo({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;

  const receita = payload.find((p) => p.dataKey === "receita")?.value ?? 0;
  const despesa = payload.find((p) => p.dataKey === "despesa")?.value ?? 0;
  const saldo = payload.find((p) => p.dataKey === "saldo")?.value ?? 0;

  return (
    <div className="rounded-md border border-surface/10 bg-[#1a1a19] px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <p style={{ color: COR_RECEITA }}>Receita: {formatBRL(receita)}</p>
      <p style={{ color: COR_DESPESA }}>Despesa: {formatBRL(Math.abs(despesa))}</p>
      <p style={{ color: COR_SALDO }}>Saldo acumulado: {formatBRL(saldo)}</p>
    </div>
  );
}

export function FinanceiroAnalytics({
  movimentacoes,
}: {
  movimentacoes: MovimentacaoAnalyticsItem[];
}): React.ReactElement {
  const [selecaoPeriodo, setSelecaoPeriodo] = useState("ESTE_MES");
  const periodo = useMemo(() => resolverPeriodo(selecaoPeriodo), [selecaoPeriodo]);
  const opcoesMesesAnteriores = useMemo(() => mesesAnteriores(movimentacoes), [movimentacoes]);

  const serieTemporal = useMemo(() => buildSerieTemporal(movimentacoes, periodo), [movimentacoes, periodo]);
  const origemReceita = useMemo(() => buildOrigemReceita(movimentacoes, periodo), [movimentacoes, periodo]);
  const despesasPorCategoria = useMemo(
    () => buildDespesasPorCategoria(movimentacoes, periodo),
    [movimentacoes, periodo],
  );

  const rotuloPeriodo =
    periodo.tipo === "MES" ? `${MESES_LONGOS[periodo.mes]}/${periodo.ano}` : `Ano de ${periodo.ano}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Balanço Financeiro</h2>
          <p className="text-xs text-muted-foreground">{rotuloPeriodo}</p>
        </div>
        <Select
          value={selecaoPeriodo}
          onChange={(event) => setSelecaoPeriodo(event.target.value)}
          className="w-48"
        >
          <option value="ESTE_MES">Este mês</option>
          <option value="ESTE_ANO">Este ano</option>
          {opcoesMesesAnteriores.length > 0 ? (
            <optgroup label="Meses anteriores">
              {opcoesMesesAnteriores.map(({ ano, mes }) => (
                <option key={`${ano}-${mes}`} value={`MES-${ano}-${mes}`}>
                  {MESES_LONGOS[mes]}/{ano}
                </option>
              ))}
            </optgroup>
          ) : null}
        </Select>
      </div>

      <ChartCard titulo="Receitas, Despesas e Saldo Acumulado">
        <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COR_RECEITA }} />
            Receita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COR_DESPESA }} />
            Despesa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-3 rounded-sm" style={{ backgroundColor: COR_SALDO }} />
            Saldo acumulado
          </span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={serieTemporal} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={GRIDLINE} />
            <XAxis
              dataKey="label"
              tick={{ fill: INK_MUTED, fontSize: 11 }}
              axisLine={{ stroke: BASELINE }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: INK_MUTED, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatBRLCompacto(v)}
            />
            <ReferenceLine y={0} stroke={BASELINE} />
            <Tooltip content={<TooltipCombo />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="receita" fill={COR_RECEITA} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="despesa" fill={COR_DESPESA} radius={[0, 0, 4, 4]} maxBarSize={28} />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke={COR_SALDO}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard titulo="Origem das Receitas">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ResponsiveContainer width="100%" height={220} className="max-w-[220px]">
            <PieChart>
              <Pie
                data={origemReceita}
                dataKey="valor"
                nameKey="label"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke="#1a1a19"
                strokeWidth={2}
              >
                {origemReceita.map((entry, index) => (
                  <Cell key={entry.key} fill={CORES_ORIGEM[index % CORES_ORIGEM.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => [
                  `${formatBRL(Number(value))} (${(item?.payload as { pct: number })?.pct.toFixed(1)}%)`,
                  (item?.payload as { label: string })?.label,
                ]}
                contentStyle={{
                  backgroundColor: "#1a1a19",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-2">
            {origemReceita.map((item, index) => (
              <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: CORES_ORIGEM[index % CORES_ORIGEM.length] }}
                  />
                  {item.label}
                </span>
                <span className="font-medium text-foreground">
                  {formatBRL(item.valor)}{" "}
                  <span className="text-xs text-muted-foreground">({item.pct.toFixed(1)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard titulo="Despesas por categoria">
        {despesasPorCategoria.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma despesa nesse período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(120, despesasPorCategoria.length * 42)}>
            <BarChart
              data={despesasPorCategoria}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke={GRIDLINE} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="categoria"
                tick={{ fill: INK_SECONDARY, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip
                formatter={(value, _name, item) => [
                  `${formatBRL(Number(value))} (${(item?.payload as { pct: number })?.pct.toFixed(1)}%)`,
                  "Despesa",
                ]}
                contentStyle={{
                  backgroundColor: "#1a1a19",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="valor" fill={COR_DESPESA} radius={[0, 4, 4, 0]} maxBarSize={22}>
                {despesasPorCategoria.map((entry) => (
                  <Cell key={entry.categoria} fill={COR_DESPESA} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        {despesasPorCategoria.length > 0 ? (
          <div className="mt-3 space-y-1">
            {despesasPorCategoria.map((item) => (
              <div key={item.categoria} className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.categoria}</span>
                <span className="font-medium text-foreground">
                  {formatBRL(item.valor)} ({item.pct.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </ChartCard>
    </div>
  );
}
