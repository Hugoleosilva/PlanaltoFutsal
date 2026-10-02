export const POSICOES_ATLETA = [
  "GOLEIRO",
  "GOLEIRO_LINHA",
  "FIXO",
  "ALA",
  "PIVO",
  "ATACANTE",
  "MEIA",
  "MEIO_CAMPO",
  "ZAGUEIRO",
  "TECNICO",
  "AUXILIAR_TECNICO",
] as const;

export type PosicaoAtleta = (typeof POSICOES_ATLETA)[number];

export const POSICAO_ATLETA_LABEL: Record<PosicaoAtleta, string> = {
  GOLEIRO: "Goleiro",
  GOLEIRO_LINHA: "Goleiro Linha",
  FIXO: "Fixo",
  ALA: "Ala",
  PIVO: "Pivô",
  ATACANTE: "Atacante",
  MEIA: "Meia",
  MEIO_CAMPO: "Meio Campo",
  ZAGUEIRO: "Zagueiro",
  TECNICO: "Técnico",
  AUXILIAR_TECNICO: "Aux. Técnico",
};
