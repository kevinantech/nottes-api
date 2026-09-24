import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dotenv.config();

async function connectDatabase(): Promise<void> {
  try {
    /**
     * 23092026: Parche para el error de DNS con MongoDB en Windows.
     */
    if (process.env.NODE_ENV !== 'production') {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    }

    const uri = <string>process.env.MONGODB_URI;
    await mongoose.connect(uri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export { connectDatabase };
