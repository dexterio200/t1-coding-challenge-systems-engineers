import mongoose from 'mongoose';

// NOTE: Using host.docker.internal for docker to connect to localhost. Without docker we can use localhost or 127.0.0.1
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://host.docker.internal:27017/trading';

export async function connectToDb(): Promise<void> {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(`Unable to connect to MongoDB`, err)
    }
}