export type PasswordHasher = (plainPassword: string) => Promise<string>;
