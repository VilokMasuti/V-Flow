import dns from "node:dns";
import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DNS_SERVERS =
  process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean) ?? [];
let mongoUriPromise: Promise<string> | null = null;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

if (MONGODB_DNS_SERVERS.length > 0) {
  dns.setServers(MONGODB_DNS_SERVERS);
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const resolveMongoUri = async (): Promise<string> => {
  if (!MONGODB_URI.startsWith("mongodb+srv://") || MONGODB_DNS_SERVERS.length === 0) {
    return MONGODB_URI;
  }

  const parsedUri = new URL(MONGODB_URI);
  const resolver = new dns.promises.Resolver();
  resolver.setServers(MONGODB_DNS_SERVERS);

  const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${parsedUri.hostname}`);
  const hosts = srvRecords.map((record) => `${record.name}:${record.port ?? 27017}`).join(",");
  const params = new URLSearchParams(parsedUri.search);

  try {
    const txtRecords = await resolver.resolveTxt(parsedUri.hostname);

    if (txtRecords[0]) {
      const txtParams = new URLSearchParams(txtRecords[0].join(""));

      txtParams.forEach((value, key) => {
        if (!params.has(key)) {
          params.set(key, value);
        }
      });
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code !== "ENODATA" && code !== "ENOTFOUND") {
      throw error;
    }
  }

  if (!params.has("tls") && !params.has("ssl")) {
    params.set("tls", "true");
  }

  const credentials = parsedUri.username
    ? `${parsedUri.username}${parsedUri.password ? `:${parsedUri.password}` : ""}@`
    : "";
  const path = parsedUri.pathname || "/";

  return `mongodb://${credentials}${hosts}${path}?${params.toString()}`;
};

const getMongoUri = (): Promise<string> => {
  mongoUriPromise ??= resolveMongoUri();

  return mongoUriPromise;
};

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = getMongoUri()
      .then((mongoUri) => mongoose.connect(mongoUri, { dbName: "VFlow" }))
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        cached.promise = null;
        mongoUriPromise = null;
        logger.error("Error connecting to MongoDB", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
