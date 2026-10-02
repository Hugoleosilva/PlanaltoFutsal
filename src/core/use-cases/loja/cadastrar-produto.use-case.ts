import { Produto } from "@/core/domain/loja/produto.entity";
import { ProdutoRepository } from "@/core/domain/patrocinio/patrocinio-loja.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CadastrarProdutoIn {
  actor: AuthenticatedActor;
  nome: string;
  descricao?: string;
  preco?: number | null;
  imagensUrls: string[];
  linkWhatsapp?: string;
  destaque?: boolean;
}

export interface CadastrarProdutoOut {
  produto: Produto;
}

export class CadastrarProdutoUseCase implements UseCase<CadastrarProdutoIn, CadastrarProdutoOut> {
  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async execute(input: CadastrarProdutoIn): Promise<CadastrarProdutoOut> {
    assertRole(input.actor, ["ADMIN"]);

    const produto = Produto.create({
      nome: input.nome,
      descricao: input.descricao,
      preco: input.preco ?? null,
      imagensUrls: input.imagensUrls,
      linkWhatsapp: input.linkWhatsapp,
      destaque: input.destaque ?? false,
      ativo: true,
    });

    const salvo = await this.produtoRepository.create(produto);

    return { produto: salvo };
  }
}
