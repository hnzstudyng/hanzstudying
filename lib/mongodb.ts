import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Initialize cache safely
let cached: any = null;
if (typeof global !== 'undefined') {
  cached = (global as any).mongoose;
  if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
  }
} else {
  cached = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Please set it in your environment variables.');
  }

  if (!cached) {
    cached = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((e) => {
        cached.promise = null;
        throw e;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
