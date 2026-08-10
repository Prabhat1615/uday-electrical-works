import 'dotenv/config';
import readline from 'readline/promises';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// First-admin creation for production and development.
// Usage: npm run create:admin
// Credentials come from env vars (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD,
// ADMIN_PHONE, ADMIN_ADDRESS) or are prompted interactively.
// Refuses to run if any Admin account already exists — there are no
// hardcoded credentials anywhere in this codebase.

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const interactive = !!process.stdin.isTTY;

const ask = async (question, required = true) => {
  if (!interactive) return '';
  const answer = (await rl.question(question)).trim();
  if (!answer && required) {
    console.error('✋ This field is required.');
    return ask(question, required);
  }
  return answer;
};

const run = async () => {
  const envName = process.env.NODE_ENV || 'development';
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'Admin' });
  if (existingAdmin) {
    console.error('✋ An Admin account already exists. This script only creates the FIRST admin.');
    console.error('   Existing admin:', existingAdmin.email);
    process.exit(1);
  }

  console.log('------------------------------------------------------');
  console.log(`Creating first Admin for environment: ${envName}`);
  console.log('------------------------------------------------------');

  const name = process.env.ADMIN_NAME || (await ask('Admin full name: '));
  const email = (process.env.ADMIN_EMAIL || (await ask('Admin email: '))).toLowerCase();
  const phone = process.env.ADMIN_PHONE || (await ask('Admin phone (optional): ', false)) || '';
  const address = process.env.ADMIN_ADDRESS || (await ask('Admin address (optional): ', false)) || '';

  let password = process.env.ADMIN_PASSWORD || '';
  if (password.length < 8) {
    if (!interactive) {
      console.error('✋ ADMIN_PASSWORD (env var) is required and must be at least 8 characters in non-interactive mode.');
      process.exit(1);
    }
    while (password.length < 8) {
      password = await rl.question('Admin password (min 8 characters): ', { hideEchoBack: true });
      if (password.length < 8) {
        console.error('✋ Password must be at least 8 characters.');
      }
    }
  }

  await User.create({
    name,
    email,
    password,
    role: 'Admin',
    phone,
    address
  });

  console.log('------------------------------------------------------');
  console.log(`✅ Admin account created: ${email}`);
  console.log('   Store these credentials securely. Delete ADMIN_PASSWORD from the shell after use.');
  console.log('------------------------------------------------------');
  rl.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to create admin:', err.message);
  rl.close();
  process.exit(1);
});
