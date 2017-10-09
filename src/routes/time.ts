import * as express from 'express';
import * as moment from 'moment';
import { log, Severity } from '../utils';

const path: string = 'times';

/*
* get()
* Returns the next count down
*
* @params {Express} app: an express app instance
* @params {Config} config: a configuration object
*/
export function get(app: express.Express, config: Config) {
  app.get(`/${config.base}/${config.version}/${path}`, (req: express.Request, res: express.Response) => {
    const moments: moment.Moment[] = [
      moment('2017-10-09 22:00:00+02:00'),
      moment('2017-10-23 22:00:00+02:00'),
      moment('2017-11-06 22:00:00+02:00'),
      moment('2017-11-20 22:00:00+02:00'),
      moment('2017-12-04 22:00:00+02:00'),
      moment('2017-12-18 22:00:00+02:00'),
      moment('2018-01-01 22:00:00+02:00'),
      moment('2018-01-15 22:00:00+02:00'),
      moment('2018-01-29 22:00:00+02:00'),
      moment('2018-02-12 22:00:00+02:00'),
      moment('2018-02-26 22:00:00+02:00'),
      moment('2018-03-12 22:00:00+02:00'),
    ];
    for (let i = 0; i < moments.length; i += 1) {
      const m: moment.Moment = moments[i];
      if ((i + 1) < moments.length) {
        const nextMoment: moment.Moment = moments[i + 1];
        if (moment().isBefore(m)) {
          return res.status(200).json({
            closing: m.format(),
          });
        } else if (moment().isAfter(m) && moment().isBefore(nextMoment)) {
          return res.status(200).json({
            closing: nextMoment.format(),
          });
        } else {
          return res.status(200).json({
            closing: moment(),
          });
        }
      } else {
        return res.status(200).json({
          closing: m.format(),
        });
      }
    }
  });
}
