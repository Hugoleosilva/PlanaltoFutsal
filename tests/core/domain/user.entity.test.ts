import { describe, expect, it } from "vitest";
import { User } from "@/core/domain/user/user.entity";
import { ValidationException } from "@/infrastructure/errors";

function buildUserProps(overrides: Partial<Parameters<typeof User.create>[0]> = {}) {
  return {
    name: "Maria Diretora",
    email: "maria@planaltofutsal.com",
    passwordHash: "hashed-password",
    role: "ADMIN" as const,
    status: "ATIVO" as const,
    ...overrides,
  };
}

describe("User entity", () => {
  it("creates a valid user", () => {
    const user = User.create(buildUserProps());

    expect(user.email).toBe("maria@planaltofutsal.com");
    expect(user.isAdmin()).toBe(true);
    expect(user.isAtleta()).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(() => User.create(buildUserProps({ email: "not-an-email" }))).toThrow(
      ValidationException,
    );
  });

  it("rejects a role outside the allowed set", () => {
    expect(() =>
      User.create(buildUserProps({ role: "SUPERADMIN" as never })),
    ).toThrow(ValidationException);
  });

  it("deactivate() returns a new instance with status INATIVO", () => {
    const user = User.create(buildUserProps());
    const deactivated = user.deactivate();

    expect(deactivated.status).toBe("INATIVO");
    expect(user.status).toBe("ATIVO");
  });
});
