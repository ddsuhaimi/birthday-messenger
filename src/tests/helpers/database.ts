import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export async function setupTestDB() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // Close previous connections if any
  await mongoose.disconnect();

  await mongoose.connect(uri);
}

export async function clearTestDB() {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

export async function closeTestDB() {
  await mongoose.disconnect();
  await mongo.stop();
}
