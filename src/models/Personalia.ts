export class Personalia {
  _id: number;
  _first_name: string;
  _last_name: string;
  _email: string;
  _phone_number: string;
  _address: string;
  _postal_code: string;
  _city: string;

  constructor(
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    address: string,
    postal_code: string,
    city: string
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone_number = phone_number;
    this.address = address;
    this.postal_code = postal_code;
    this.city = city;
  }

  get id(): number {
    return this._id;
  }

  get first_name(): string {
    return this._first_name;
  }

  get last_name(): string {
    return this._last_name;
  }

  get email(): string {
    return this._email;
  }

  get phone_number(): string {
    return this._phone_number;
  }

  get address(): string {
    return this._address;
  }

  get postal_code(): string {
    return this._postal_code;
  }

  get city(): string {
    return this._city;
  }

  get validity(): boolean {
    return (
      typeof this.first_name === 'string' && this.first_name.length > 0 &&
      typeof this.last_name === 'string' && this.last_name.length > 0 &&
      typeof this.email === 'string' && this.email.length > 0 &&
      typeof this.phone_number === 'string' && this.phone_number.length > 0 &&
      typeof this.address === 'string' && this.address.length > 0 &&
      typeof this.postal_code === 'string' && this.postal_code.length > 0 &&
      typeof this.city === 'string' && this.city.length > 0
    );
  }

  set id(id: number) {
    this._id = id;
  }

  set first_name(first_name: string) {
    this._first_name = first_name;
  }

  set last_name(last_name: string) {
    this._last_name = last_name;
  }

  set email(email: string) {
    this._email = email;
  }

  set phone_number(phone_number: string) {
    this._phone_number = phone_number;
  }

  set address(address: string) {
    this._address = address;
  }

  set postal_code(postal_code: string) {
    this._postal_code = postal_code;
  }

  set city(city: string) {
    this._city = city;
  }
}
