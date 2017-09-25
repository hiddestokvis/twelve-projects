import * as express from 'express';
import * as moment from 'moment';
import { ds } from '../';
import { Pitch, Personalia, Slot } from '../models';
import { validator, schema } from '../validators/pitch';
import { log, Severity, sendMail } from '../utils';

const path: string = 'pitches';
const v = validator();

/*
* count()
* Returns the number of Pitch objects in total in the database
*
* @params {Express} app: an express app instance
* @params {Config} config: a configuration object
*/
export function count(app: express.Express, config: Config) {
  app.get(`/${config.base}/${config.version}/${path}/count`, (req: express.Request, res: express.Response) => {
    ds
    // Connect to database
    .then((db: any) =>
      // Count records in pitch table
      db.pitch.count()
    )
    .then((total) => {
      log(Severity.INFO, 'PITCH', `Counted ${total} pitch records`);
      res.status(200).json({
        count: Number(total),
      });
    })
    .catch((error) => {
      log(Severity.ERROR, 'PITCH', JSON.stringify(error));
      res.status(500).json({
        status: 500,
        name: error.name,
        error: error.message,
        stack: error.stack,
      });
    });
  });
}

/*
* store()
* Stores a new pitch
*
* @params {Express} app: an express app instance
* @params {Config} config: a configuration object
 */
export function store(app: express.Express, config: Config) {
  app.post(`/${config.base}/${config.version}/${path}`, (req: express.Request, res: express.Response) => {
    // validate input
    const validation = v.validate(req.body, schema);
    if (validation.errors.length > 0) {
      log(Severity.WARNING, 'PITCH', `Validation errors in storing pitch`);
      res.status(422).json(validation.errors);
    } else {
      // Create personalia object
      const person: Personalia = new Personalia(
        req.body.person.first_name,
        req.body.person.last_name,
        req.body.person.email,
        req.body.person.phone_number,
        req.body.person.address,
        req.body.person.postal_code,
        req.body.person.city
      );
      // Create pitch object
      const pitch: Pitch = new Pitch(
        person,
        req.body.pitch.slot_id,
        req.body.pitch.description,
        req.body.pitch.link,
        moment()
      );
      // Check objects for validity
      if (!person.validity || !pitch.validity) {
        log(Severity.WARNING, 'PITCH', `Validation errors in storing pitch`);
        res.status(422).json({
          status: 422,
          name: 'INVALID_INPUT',
          error: 'Please check input',
        });
      } else {
        // Store pitch object (and person object by extension)
        pitch.save()
        .then((p) => {
          log(Severity.INFO, 'PITCH', `Stored pitch with id ${pitch.id}`);
          res.status(201).json(pitch.render());
          sendMail(req.body.person.first_name, req.body.person.email);
        })
        // Handle errors in storing proces
        .catch((error) => {
          log(Severity.ERROR, 'PITCH', JSON.stringify(error));
          res.status(422).json({
            status: 422,
            name: error.name,
            error: error.message,
            stack: error.stack,
          });
        });
      }
    }
  });
}
