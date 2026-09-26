import { describe, expect, it } from "vitest";
import { gerarPixCopiaCola } from "@/shared/utils/pix";

describe("gerarPixCopiaCola", () => {
  it("produces a well-formed EMV payload ending in a 4-hex-digit CRC16", () => {
    const payload = gerarPixCopiaCola({
      chave: "planaltofutsal2025@gmail.com",
      nomeBeneficiario: "Planalto Futsal",
      cidade: "Recife",
    });

    expect(payload.startsWith("000201")).toBe(true);
    expect(payload).toContain("br.gov.bcb.pix");
    expect(payload).toContain("planaltofutsal2025@gmail.com");
    expect(payload.slice(-8, -4)).toBe("6304");
    expect(payload.slice(-4)).toMatch(/^[0-9A-F]{4}$/);
  });

  it("includes a fixed amount field when valor is provided", () => {
    const payload = gerarPixCopiaCola({
      chave: "planaltofutsal2025@gmail.com",
      nomeBeneficiario: "Planalto Futsal",
      cidade: "Recife",
      valor: 25,
    });

    expect(payload).toContain("540525.00");
  });

  it("strips accents and truncates the merchant name/city per EMV limits", () => {
    const payload = gerarPixCopiaCola({
      chave: "planaltofutsal2025@gmail.com",
      nomeBeneficiario: "São João da Associação Esportiva Planalto",
      cidade: "São Lourenço da Mata",
    });

    expect(payload).not.toMatch(/[À-ÿ]/);
  });
});
