import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as massive from 'massive';
import { config } from './config';
import { log, Severity } from './utils';
import * as pitches from './routes/pitch';
import * as slots from './routes/slots';
import { connect  } from './datasource';

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
/*
  Setup listener
 */
app.listen(config.port, () => {
  log(Severity.INFO, 'EXPRESS', `Server started on port ${config.port}`);
});
