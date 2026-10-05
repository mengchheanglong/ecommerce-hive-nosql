import { Module, Global } from "@nestjs/common";
import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DATABASE_NAME = process.env.MONGODB_DB || "ecommerce";

@Global()
@Module({
  providers: [
    {
      provide: "MONGODB_CONNECTION",
      useFactory: async (): Promise<Db> => {
        try {
          const client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 3000,
          });
          await client.connect();
          console.log(`[NestJS DatabaseModule] Connected to MongoDB database: "${DATABASE_NAME}"`);
          return client.db(DATABASE_NAME);
        } catch (err) {
          console.warn(`[NestJS DatabaseModule] MongoDB connection warning: ${err.message}. Using fallback memory mode.`);
          return null as any;
        }
      },
    },
  ],
  exports: ["MONGODB_CONNECTION"],
})
export class DatabaseModule {}
