import * as massive from 'massive';

export function connect() {
  return massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'twelve',
    user: 'hiddestokvis',
    password: '',
  });
}
