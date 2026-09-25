import { User, UserState } from "@/core/domain/user/user.entity";
import { UserRepository } from "@/core/domain/user/user.repository";
import { connectToDatabase } from "../mongoose";
import { UserDocument, UserModel } from "../schemas/user.schema";

function toEntity(doc: UserDocument): User {
  const state: UserState = {
    id: doc.id as string,
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
    status: doc.status,
    atletaId: doc.atletaId ? doc.atletaId.toString() : null,
    termsAcceptedAt: doc.termsAcceptedAt ?? null,
    imageConsentAcceptedAt: doc.imageConsentAcceptedAt ?? null,
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

  async create(user: User): Promise<User> {
    await connectToDatabase();
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      status: user.status,
      atletaId: user.atletaId ?? null,
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
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
        atletaId: user.atletaId ?? null,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error(`Usuário ${user.id} não encontrado para atualização.`);
    }

    return toEntity(updated);
  }
}
