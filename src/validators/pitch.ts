import { Validator } from 'jsonschema';

const personSchema = {
  id: '/person',
  type: 'object',
  properties: {
    first_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    phone_number: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    postal_code: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
  },
};

const pitchSchema = {
  id: '/pitch',
  type: 'object',
  properties: {
    description: {
      type: 'string',
    },
    link: {
      type: 'string',
    },
    slot_id: {
      type: 'number',
    },
  },
};

export const schema: Object = {
  id: '/schema',
  type: 'object',
  properties: {
    person: {
      $ref: '/person',
    },
    pich: {
      $ref: '/pitch',
    },
  },
};

export function validator(): Validator {
  const v = new Validator();
  v.addSchema(personSchema, '/person');
  v.addSchema(pitchSchema, '/pitch');
  return v;
}
