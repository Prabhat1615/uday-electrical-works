export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'uday_electrical_works_secret_key_2026',
  expiresIn: process.env.JWT_EXPIRE || '30d'
};
