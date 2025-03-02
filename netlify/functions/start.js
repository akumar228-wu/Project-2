import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedDB = null;

export async function connectToDatabase() {
    
    if (cachedDB) {
        console.log("Reusing existing MongoDB connection.");
        return cachedDB;
    }

    try {
        console.log("Establishing new MongoDB connection...");
        cachedDB = await mongoose.connect(`mongodb+srv://${process.env.usernameMongoDB}:${process.env.password}@cluster0.1o96d.mongodb.net/`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log("MongoDB Connected");
        return cachedDB;
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        throw err;
    }
}

connectToDatabase().catch(err => console.error("MongoDB Initial Connection Failed:", err));

require('../../models/Registration');
require('../../models/blog');
