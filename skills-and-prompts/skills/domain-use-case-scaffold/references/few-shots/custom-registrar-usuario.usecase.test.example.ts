import { ValidationException } from "@/infrastructure/errors";
import { Usuario, FakeUsuarioRepository, FakeCryptoProvider } from "../../domain/usuario";
import { RegistrarUsuario } from "./registrar-usuario.usecase";

describe("RegistrarUsuario", () => {
  test("deve validar, transformar dependencias e persistir no caminho feliz", async () => {
    const cryptoProvider = new FakeCryptoProvider();
    const usuarioRepository = new FakeUsuarioRepository();
    const validateSpy = jest.spyOn(Usuario.prototype, "validate");
    const useCase = new RegistrarUsuario(cryptoProvider, usuarioRepository);

    await expect(
      useCase.execute({
        nome: "Joao Silva",
        email: "joao@silva.com",
        senha: "Strong@123",
        role: "ATLETA",
      }),
    ).resolves.toBeUndefined();

    expect(cryptoProvider.encryptedPasswords).toEqual(["Strong@123"]);
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.createdUsuarios).toHaveLength(1);

    validateSpy.mockRestore();
  });

  test("deve interromper o fluxo antes do efeito colateral quando a validacao falhar", async () => {
    const cryptoProvider = new FakeCryptoProvider();
    const usuarioRepository = new FakeUsuarioRepository();
    const useCase = new RegistrarUsuario(cryptoProvider, usuarioRepository);

    await expect(
      useCase.execute({
        nome: "Joao Silva",
        email: "joao@silva.com",
        senha: "123456",
        role: "ATLETA",
      }),
    ).rejects.toThrow(ValidationException);

    expect(cryptoProvider.encryptedPasswords).toEqual([]);
    expect(usuarioRepository.createdUsuarios).toEqual([]);
  });
});
