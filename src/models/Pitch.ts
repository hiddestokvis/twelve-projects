import * as moment from 'moment';
import { Personalia } from './';
import { ds } from '../';

export class Pitch {
  _id: number;
  _person: Personalia;
  _slot: number;
  _description: string;
  _link: string;
  _timestamp: moment.Moment;

  constructor(
    person: Personalia,
    slot: number,
    description: string,
    link: string,
    timestamp: moment.Moment
  ) {
    this.person = person;
    this.slot = slot;
    this.description = description;
    this.link = link;
    this.timestamp = timestamp;
  }

  get id(): number {
    return this._id;
  }

  get person(): Personalia {
    return this._person;
  }

  get slot(): number {
    return this._slot;
  }

  get description(): string {
    return this._description;
  }

  get link(): string {
    return this._link;
  }

  get timestamp(): moment.Moment {
    return this._timestamp;
  }

  get validity(): boolean {
    return (
      this.person instanceof Personalia &&
      typeof this.slot === 'number' &&
      typeof this.description === 'string' && this.description.length > 0 &&
      this.timestamp instanceof moment
    );
  }

  set id(id: number) {
    this._id = id;
  }

  set person(person: Personalia) {
    this._person = person;
  }

  set slot(slot: number) {
    this._slot = slot;
  }

  set description(description: string) {
    this._description = description;
  }

  set link(link: string) {
    this._link = link;
  }

  set timestamp(timestamp: moment.Moment) {
    this._timestamp = timestamp;
  }

  /*
  * render()
  * Renders a Pitch object to a JSON object
  *
  */
  render() {
    return ({
      person: {
        id: this.person.id,
        first_name: this.person.first_name,
        last_name: this.person.last_name,
        email: this.person.email,
        phone_number: this.person.phone_number,
        address: this.person.address,
        postal_code: this.person.postal_code,
        city: this.person.city,
      },
      pitch: {
        id: this.id,
        slot_id: this.slot,
        description: this.description,
        link: this.link,
      },
    });
  }

  /*
  * save()
  * Stores a pitch object and the associated Personalia
  *
  */
  save() {
    return ds
    // Connect to database
    .then((db: any) =>
      // Check if persons email is already attached to a pitch in the same slot
      db.email_in_slot(this.person.email, this.slot)
      .then((result) => {
        // If already associated return error
        if (result[0].email_in_slot) {
          return Promise.reject('EMAIL_ALREADY_IN_SLOT');
        }
        // Store personalia information
        return db.personalia.save({
          first_name: this.person.first_name,
          last_name: this.person.last_name,
          email: this.person.email,
          phone_number: this.person.phone_number,
          address: this.person.address,
          postal_code: this.person.postal_code,
          city: this.person.city,
        });
      })
      .then((person) => {
        // Attach returned database record id to the object
        this.person.id = person.id;
        // Store pitch information
        return db.pitch.save({
          person: person.id,
          slot: this.slot,
          description: this.description,
          link: this.link,
        });
      })
      .then((pitch) => {
        // Attach returned database record id to the object
        this.id = pitch.id;
        // Return result as a promise
        return Promise.resolve(this);
      })
    );
  }
}
