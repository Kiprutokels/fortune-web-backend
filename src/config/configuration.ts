export default () => ({
  port: parseInt(process.env.PORT ?? '5000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
});
