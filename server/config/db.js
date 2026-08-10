import mongoose from 'mongoose';
import dns from 'dns';

// Use reliable public DNS for SRV lookups (fixes local DNS issues with Atlas)
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Never silently buffer queries while disconnected — requests must fail
// fast with a clear error instead of hanging for 10s (buffering timeout).
mongoose.set('bufferCommands', false);

// Database names are derived from the environment so development and
// production data can never mix, even if MONGO_URI points at a dev database.
export const DB_NAME =
  process.env.NODE_ENV === 'production' ? 'uday_electrical_production' : 'uday_electrical_dev';

// Swap the database name inside a MongoDB URI while keeping host/port/auth.
const withDatabaseName = (uri) => {
  try {
    const url = new URL(uri);
    if (url.protocol === 'mongodb:' || url.protocol === 'mongodb+srv:') {
      if (url.protocol === 'mongodb+srv:' && !url.pathname) {
        return `${uri.replace(/\/?$/, '')}/${DB_NAME}`;
      }
      url.pathname = `/${DB_NAME}`;
      return url.toString();
    }
  } catch {
    // Not a parseable URI — fall back to the default.
  }
  return `mongodb://127.0.0.1:27017/${DB_NAME}`;
};

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 5000;

export const connectDB = async (retries = MAX_RETRIES) => {
  const rawUri = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;
  const uri = withDatabaseName(rawUri);

  console.log(`MongoDB connecting... (database: ${DB_NAME})`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name} (${process.env.NODE_ENV || 'development'})`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    if (retries > 0) {
      console.log(`   Retrying in ${RETRY_DELAY_MS / 1000}s (${retries} attempt${retries > 1 ? 's' : ''} remaining)...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }
    console.error('=======================================================');
    console.error('MongoDB is unreachable and all retries were exhausted.');
    console.error('The backend requires the database for normal operation.');
    console.error('Check MONGO_URI (host, credentials, network access) and try again.');
    console.error('=======================================================');
    process.exit(1);
  }
};

export default connectDB;
