import dotenv from 'dotenv';

dotenv.config();

// Known dev-only fallback values that must never be used in production.
const DEV_SECRETS = [
  'uday_electrical_works_secret_key_2026',
  'uday_electrical_enterprise_super_secret_jwt_key_2026',
  'change_this_to_a_long_random_secret'
];

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const secret = process.env.JWT_SECRET;

if (IS_PRODUCTION && (!secret || DEV_SECRETS.includes(secret))) {
  throw new Error(
    '❌ JWT_SECRET is missing or is a known development placeholder. ' +
      'Set a long random JWT_SECRET environment variable before starting in production.'
  );
}

export const jwtConfig = {
  secret: secret || 'uday_electrical_works_secret_key_2026',
  expiresIn: process.env.JWT_EXPIRE || '30d'
};
