import { UseCase } from "../../use-case";
import { StrongPasswordRule, Validator } from "@/shared/validation";
import { Usuario, UsuarioRepository, CryptoProvider } from "../../domain/usuario";

export interface RegistrarUsuarioIn {
  nome: string;
  email: string;
  senha: string;
  role: "ADMIN" | "ATLETA" | "USER";
}

export class RegistrarUsuario implements UseCase<RegistrarUsuarioIn, void> {
  constructor(
    private readonly cryptoProvider: CryptoProvider,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(input: RegistrarUsuarioIn): Promise<void> {
    Validator.validate([
      {
        code: "usuario.senha",
        value: input.senha,
        rules: [new StrongPasswordRule()],
      },
    ]);

    const senhaHash = await this.cryptoProvider.encrypt(input.senha);
    const usuario = new Usuario({
      nome: input.nome,
      email: input.email,
      senhaHash,
      role: input.role,
    });

    usuario.validate();

    await this.usuarioRepository.create(usuario);
  }
}
