import { User, UserState } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { connectToDatabase } from "../mongoose";
import { UserDocument, UserModel } from "../schemas/user.schema";

function toEntity(doc: UserDocument): User {
  const state: UserState = {
    id: doc.id as string,
    name: doc.name,
    email: doc.email,
    whatsapp: doc.whatsapp,
    passwordHash: doc.passwordHash,
    role: doc.role,
    status: doc.status,
    atletaId: doc.atletaId ? doc.atletaId.toString() : null,
    emailVerificadoEm: doc.emailVerificadoEm ?? null,
    termsAcceptedAt: doc.termsAcceptedAt ?? null,
    imageConsentAcceptedAt: doc.imageConsentAcceptedAt ?? null,
    socio: doc.socio,
    socioDesde: doc.socioDesde ?? null,
    socioTipoPlano: doc.socioTipoPlano ?? null,
    socioValorPlano: doc.socioValorPlano ?? null,
    socioDiaVencimento: doc.socioDiaVencimento ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return User.create(state);
}

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    await connectToDatabase();
    const doc = await UserModel.findById(id);
    return doc ? toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    await connectToDatabase();
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? toEntity(doc) : null;
  }

  async findByWhatsapp(whatsapp: string): Promise<User | null> {
    await connectToDatabase();
    const digitos = whatsapp.replace(/\D/g, "");
    if (!digitos) return null;

    const padraoDigitos = digitos.split("").join("\\D*");
    const doc = await UserModel.findOne({ whatsapp: new RegExp(padraoDigitos) });
    return doc ? toEntity(doc) : null;
  }

  async findByName(name: string): Promise<User | null> {
    await connectToDatabase();
    const nomeEscapado = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!nomeEscapado) return null;

    const doc = await UserModel.findOne({ name: new RegExp(`^${nomeEscapado}$`, "i") });
    return doc ? toEntity(doc) : null;
  }

  async create(user: User): Promise<User> {
    await connectToDatabase();
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      passwordHash: user.passwordHash,
      role: user.role,
      status: user.status,
      atletaId: user.atletaId ?? null,
      emailVerificadoEm: user.emailVerificadoEm ?? null,
      termsAcceptedAt: user.hasAcceptedTerms ? new Date() : null,
      imageConsentAcceptedAt: user.hasAcceptedImageConsent ? new Date() : null,
    });
    return toEntity(created);
  }

  async update(user: User): Promise<User> {
    await connectToDatabase();
    const updated = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
        atletaId: user.atletaId ?? null,
        emailVerificadoEm: user.emailVerificadoEm ?? null,
        socio: user.isSocio,
        socioDesde: user.socioDesde ?? null,
        socioTipoPlano: user.socioTipoPlano ?? null,
        socioValorPlano: user.socioValorPlano ?? null,
        socioDiaVencimento: user.socioDiaVencimento ?? null,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Usuário ${user.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }

  async countAll(): Promise<number> {
    await connectToDatabase();
    return UserModel.countDocuments();
  }

  async countSocios(): Promise<number> {
    await connectToDatabase();
    return UserModel.countDocuments({ socio: true });
  }

  async findSocios(): Promise<User[]> {
    await connectToDatabase();
    const docs = await UserModel.find({ socio: true }).sort({ name: 1 });
    return docs.map(toEntity);
  }
}
