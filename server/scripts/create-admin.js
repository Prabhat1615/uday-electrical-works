import 'dotenv/config';
import readline from 'readline/promises';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// First-admin creation for production and development.
// Usage: npm run create-admin
// Prompts interactively for all credentials.
// Refuses to run if any Admin account already exists — there are no
// hardcoded credentials anywhere in this codebase.

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = async (question, required = true) => {
  const answer = (await rl.question(question)).trim();
  if (!answer && required) {
    console.error('✋ This field is required.');
    return ask(question, required);
  }
  return answer;
};

const askHidden = async (question) => {
  const answer = await rl.question(question, { hideEchoBack: true });
  return answer.trim();
};

const run = async () => {
  const envName = process.env.NODE_ENV || 'development';
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'Admin' });
  if (existingAdmin) {
    console.error('✋ An Admin account already exists.');
    console.error('   This command only creates the FIRST admin.');
    console.error('   Existing admin:', existingAdmin.email);
    rl.close();
    process.exit(1);
  }

  console.log('------------------------------------------------------');
  console.log(`Creating first Admin for environment: ${envName}`);
  console.log('------------------------------------------------------');

  const name = await ask('Admin full name: ');
  const email = (await ask('Admin email: ')).toLowerCase();
  const phone = await ask('Admin phone (optional): ', false) || '';
  const address = await ask('Admin address (optional): ', false) || '';

  let password = '';
  let confirmPassword = '';
  while (password.length < 6) {
    password = await askHidden('Admin password (min 6 characters): ');
    if (password.length < 6) {
      console.error('✋ Password must be at least 6 characters.');
    }
  }
  while (true) {
    confirmPassword = await askHidden('Confirm password: ');
    if (confirmPassword === password) break;
    console.error('✋ Passwords do not match.');
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
  console.log('   Store these credentials securely.');
  console.log('------------------------------------------------------');
  rl.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to create admin:', err.message);
  rl.close();
  process.exit(1);
});
