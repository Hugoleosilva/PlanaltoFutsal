import { redirect } from "next/navigation";

interface JogosPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

export default async function JogosPage({ searchParams }: JogosPageProps): Promise<never> {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.mes) query.set("mes", params.mes);
  if (params.ano) query.set("ano", params.ano);
  const queryString = query.toString();
  redirect(`/agenda${queryString ? `?${queryString}` : ""}#resultados`);
}
