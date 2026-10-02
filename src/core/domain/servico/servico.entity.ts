import { Entity, EntityState } from "../entity";
import {
  InRule,
  MaxItemsRule,
  MaxLengthRule,
  MinItemsRule,
  RequiredRule,
  Validator,
} from "@/shared/validation";
import { CATEGORIAS_SERVICO, type CategoriaServico } from "@/shared/constants/categorias-servico";

export type StatusServico = "PENDENTE_APROVACAO" | "APROVADO" | "REJEITADO";
export type FormaPagamento = "DINHEIRO" | "PIX" | "CARTAO";
export type { CategoriaServico };

export const FORMAS_PAGAMENTO = ["DINHEIRO", "PIX", "CARTAO"] as const;
export const MAX_IMAGENS_SERVICO = 2;

export interface ServicoState extends EntityState {
  titulo: string;
  descricao: string;
  imagensUrls: string[];
  valores?: string;
  formasPagamento: FormaPagamento[];
  categoria: CategoriaServico;
  bairro: string;
  nomeContato: string;
  contato: string;
  autorUserId: string;
  status: StatusServico;
  moderadoPorUserId?: string | null;
  moderadoEm?: Date | null;
}

/**
 * Divulgação de trabalho/serviço por quem tem conta no site (torcedor,
 * atleta ou diretoria) — segue o mesmo fluxo de moderação das fotos
 * enviadas pelo público: nasce PENDENTE_APROVACAO e só aparece no Portal
 * Público depois que a diretoria aprova.
 */
export class Servico extends Entity<ServicoState> {
  private constructor(props: ServicoState) {
    super(props);
    this.validate();
  }

  static create(props: ServicoState): Servico {
    return new Servico(props);
  }

  get titulo(): string {
    return this.props.titulo;
  }

  get descricao(): string {
    return this.props.descricao;
  }

  get imagensUrls(): readonly string[] {
    return this.props.imagensUrls;
  }

  get valores(): string | undefined {
    return this.props.valores;
  }

  get formasPagamento(): readonly FormaPagamento[] {
    return this.props.formasPagamento;
  }

  get categoria(): CategoriaServico {
    return this.props.categoria;
  }

  get bairro(): string {
    return this.props.bairro;
  }

  get nomeContato(): string {
    return this.props.nomeContato;
  }

  get contato(): string {
    return this.props.contato;
  }

  get autorUserId(): string {
    return this.props.autorUserId;
  }

  get status(): StatusServico {
    return this.props.status;
  }

  get moderadoPorUserId(): string | null | undefined {
    return this.props.moderadoPorUserId;
  }

  get moderadoEm(): Date | null | undefined {
    return this.props.moderadoEm;
  }

  aprovar(moderadoPorUserId: string): Servico {
    return this.clone({
      status: "APROVADO",
      moderadoPorUserId,
      moderadoEm: new Date(),
    });
  }

  rejeitar(moderadoPorUserId: string): Servico {
    return this.clone({
      status: "REJEITADO",
      moderadoPorUserId,
      moderadoEm: new Date(),
    });
  }

  editar(props: {
    titulo: string;
    descricao: string;
    imagensUrls: string[];
    valores?: string;
    formasPagamento: FormaPagamento[];
    categoria: CategoriaServico;
    bairro: string;
    nomeContato: string;
    contato: string;
  }): Servico {
    return this.clone(props);
  }

  public validate(): void {
    Validator.validate([
      { code: "titulo", value: this.props.titulo, rules: [new RequiredRule(), new MaxLengthRule(150)] },
      {
        code: "descricao",
        value: this.props.descricao,
        rules: [new RequiredRule(), new MaxLengthRule(1000)],
      },
      {
        code: "imagensUrls",
        value: this.props.imagensUrls,
        rules: [new MinItemsRule(1), new MaxItemsRule(MAX_IMAGENS_SERVICO)],
      },
      {
        code: "formasPagamento",
        value: this.props.formasPagamento,
        rules: [new RequiredRule(), new MinItemsRule(1)],
      },
      {
        code: "categoria",
        value: this.props.categoria,
        rules: [new RequiredRule(), new InRule(CATEGORIAS_SERVICO)],
      },
      {
        code: "bairro",
        value: this.props.bairro,
        rules: [new RequiredRule(), new MaxLengthRule(100)],
      },
      { code: "nomeContato", value: this.props.nomeContato, rules: [new RequiredRule()] },
      { code: "contato", value: this.props.contato, rules: [new RequiredRule()] },
      { code: "autorUserId", value: this.props.autorUserId, rules: [new RequiredRule()] },
      {
        code: "status",
        value: this.props.status,
        rules: [
          new RequiredRule(),
          new InRule(["PENDENTE_APROVACAO", "APROVADO", "REJEITADO"] as const),
        ],
      },
    ]);
  }
}
