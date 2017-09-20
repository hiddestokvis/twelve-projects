import * as express from 'express';
import { ds } from '../';
import { Slot } from '../models';
import { log, Severity } from '../utils';

const path: string = 'slots';

/*
* get()
* Returns the slots objects
*
* @params {Express} app: an express app instance
* @params {Config} config: a configuration object
*/
export function get(app: express.Express, config: Config) {
  app.get(`/${config.base}/${config.version}/${path}`, (req: express.Request, res: express.Response) => {
    ds
    // connect to the database
    .then((db: any) =>
      db.slot.find({}, {
        order: 'position',
      })
    )
    .then((slots) => {
      const _slots: Slot[] = slots.map(slot => new Slot(
        slot.id,
        slot.position,
        slot.price,
        slot.open,
        slot.no_pitches
      ));
      log(Severity.INFO, 'SLOTS', `Rendered ${_slots.length} slots`);
      res.status(200).json({ results: _slots.map(item => item.render()), count: _slots.length });
    })
    .catch((error) => {
      log(Severity.ERROR, 'SLOTS', JSON.stringify(error));
      res.status(500).json(error);
    });
  });
}
