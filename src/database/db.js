import '../setup.js';
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
} catch (error) {
    console.log(error.message);
}

const dbName = '4Paws';
const db = mongoClient.db(dbName);

export default db;
