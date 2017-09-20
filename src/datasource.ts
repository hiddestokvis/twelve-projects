import * as massive from 'massive';

export function connect() {
  return massive({
    host: process.env.DB_HOST || '127.0.0.1',
    port: 5432,
    database: process.env.DB_NAME || 'twelve',
    user: process.env.DB_USER || 'hiddestokvis',
    password: process.env.DB_PASS || '',
  });
}
