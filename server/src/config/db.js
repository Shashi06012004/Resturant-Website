import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/draksha_restaurant';
  
  try {
    mongoose.set('strictQuery', false);
    // Attempt standard connection with 5 sec timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB connected successfully to standard URI: ${uri.split('@').pop() || uri}`);
  } catch (error) {
    console.warn(`[Database] ⚠️ Standard MongoDB connection failed! Initializing MongoMemoryServer fallback (DATA WILL BE TEMPORARY IN MEMORY)...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to MongoDB In-Memory Server at: ${memUri}`);
    } catch (memError) {
      console.error('[Database] Failed to connect to MongoDB In-Memory Server:', memError);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
