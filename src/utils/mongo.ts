import {MongoClient, Db, Collection} from "mongodb";
import {MontoInvoice} from "../models/Invoice.js";

let mongoURI = process.env.MONGO_URI || '';
const dbName = process.env.MONGO_DB_NAME;
const dbCollectionName = process.env.MONGO_DB_COLLECTION_NAME || '';

let db: Db;
let invoicesCollection: Collection<MontoInvoice>;

const connectToDatabase = async () => {
    if (!db) {
        const client = new MongoClient(mongoURI);
        await client.connect();
        db = client.db(dbName);
        invoicesCollection = db.collection<MontoInvoice>(dbCollectionName);
        console.log('Connected to MongoDB');
    }
    return {db, invoicesCollection};
};

export {connectToDatabase, invoicesCollection};
