import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as massive from 'massive';
import * as socketio from 'socket.io';
import { config } from './config';
import { log, Severity } from './utils';
import * as pitches from './routes/pitch';
import * as slots from './routes/slots';
import * as times from './routes/time';
import { connect  } from './datasource';
import { initializeListener } from './sockets';

/*
  Setup express app
 */
const app: express.Express = express();
app.use(bodyParser.json());
app.use(cors());

/*
  Setup datasource
 */
export const ds: Promise<massive.Database> = connect();

/*
  Setup routes
 */
pitches.count(app, config);
pitches.store(app, config);
slots.get(app, config);
times.get(app, config);

/*
  Listen to postgres notifications
 */
initializeListener();

/*
  Setup server
 */
export const io = socketio.listen(
  app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
    log(Severity.INFO, 'EXPRESS', `Server started on port ${config.port}`);
  })
);
