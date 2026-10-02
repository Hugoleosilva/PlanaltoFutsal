import mongoose from "mongoose";

function readMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("A variável de ambiente MONGODB_URI não foi definida.");
  }
  return uri;
}

const MONGODB_URI = readMongoUri();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.__mongooseCache ?? { conn: null, promise: null };
global.__mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME ?? "planalto-futsal",
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Se a conexão falhar (ex: IP bloqueado no Atlas), não deixa essa
    // promise rejeitada presa no cache pra sempre — a próxima chamada
    // tenta conectar de novo, em vez de repetir o mesmo erro antigo.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
