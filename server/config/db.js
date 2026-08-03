import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uday_electrical_erp');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning/Error: ${error.message}`);
    console.log('App running in degraded mode if MongoDB server is offline. Standard memory handling active.');
  }
};

export default connectDB;
