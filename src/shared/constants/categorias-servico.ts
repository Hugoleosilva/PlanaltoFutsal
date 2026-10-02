export const CATEGORIAS_SERVICO = [
  "SERVICOS_AUTONOMOS",
  "CUIDADOS_BEM_ESTAR",
  "ALIMENTACAO",
  "EDUCACAO_APOIO",
] as const;

export type CategoriaServico = (typeof CATEGORIAS_SERVICO)[number];

export const CATEGORIA_SERVICO_LABEL: Record<CategoriaServico, string> = {
  SERVICOS_AUTONOMOS: "Serviços Autônomos",
  CUIDADOS_BEM_ESTAR: "Cuidados e Bem-Estar",
  ALIMENTACAO: "Alimentação",
  EDUCACAO_APOIO: "Educação e Apoio",
};

export const CATEGORIA_SERVICO_DESCRICAO: Record<CategoriaServico, string> = {
  SERVICOS_AUTONOMOS: "Eletricistas, encanadores, costureiras, pedreiros e pintores",
  CUIDADOS_BEM_ESTAR: "Cuidadores de idosos, babás, passeadores de cães e manicures",
  ALIMENTACAO: "Confeiteiras, marmitas caseiras e mercadinhos do bairro",
  EDUCACAO_APOIO: "Aulas de reforço escolar, monitoria e doações",
};
