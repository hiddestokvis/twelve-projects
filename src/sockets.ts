import * as pg from 'pg';
import { ds, io } from './';
import { log, Severity } from './utils';

export function initializeListener() {
  ds
  .then((db: any) => {
    db.instance.connect()
    .then((connection: pg.connection) => {
      connection.query('LISTEN "changefeed"');
      connection.client.on('notification', (data) => {
        log(Severity.INFO, 'DB_UPDATE', JSON.stringify(data.payload));
        io.sockets.emit('update_pitch', null);
      });
    });
  })
  .catch((error) => {
    log(Severity.ERROR, 'DB_UPDATE', JSON.stringify(error));
  });
}
