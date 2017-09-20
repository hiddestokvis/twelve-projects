export class Slot {
  _id: number;
  _position: number;
  _price: number;
  _open: boolean;
  _no_pitches: number;

  constructor(
    id: number,
    position: number,
    price: number,
    open: boolean,
    no_pitches: number
  ) {
    this.id = id;
    this.position = position;
    this.price = price;
    this.open = open;
    this.no_pitches = no_pitches;
  }

  get id(): number {
    return this._id;
  }

  get position(): number {
    return this._position;
  }

  get price(): number {
    return this._price;
  }

  get open(): boolean {
    return this._open;
  }

  get no_pitches(): number {
    return this._no_pitches;
  }

  set id(id: number) {
    this._id = id;
  }

  set position(position: number) {
    this._position = position;
  }

  set price(price: number) {
    this._price = price;
  }

  set open(open: boolean) {
    this._open = open;
  }

  set no_pitches(no_pitches: number) {
    this._no_pitches = no_pitches;
  }

  /*
  * render()
  * Renders a Slot object to a JSON object
  *
  */
  render() {
    return ({
      id: this.id,
      position: this.position,
      price: this.price,
      open: this.open,
      no_pitches: this.no_pitches,
    });
  }
}
