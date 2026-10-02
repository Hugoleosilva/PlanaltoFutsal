export function tituloConfronto(adversario: string, mandante: "PLANALTO" | "ADVERSARIO"): string {
  return mandante === "PLANALTO" ? `Planalto Futsal x ${adversario}` : `${adversario} x Planalto Futsal`;
}
