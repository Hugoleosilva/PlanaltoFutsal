import { describe, expect, it } from "vitest";
import { PhoneBrRule } from "@/shared/validation/rules/phone-br.rule";

describe("PhoneBrRule", () => {
  const rule = new PhoneBrRule();

  it.each([
    "81999999999",
    "(81) 99999-9999",
    "81 99999-9999",
    "+5581999999999",
    "5581999999999",
    "8199999999",
  ])("accepts %s", (value) => {
    expect(rule.validate(value)).toBeNull();
  });

  it.each(["123", "not-a-phone", "819999999999999"])("rejects %s", (value) => {
    expect(rule.validate(value)).toBe("invalid_phone_br");
  });
});
