export class BaseError extends Error {
  constructor(message?: string) {
    const newPrototype = new.target.prototype;
    super(message);
    Object.setPrototypeOf(this, newPrototype);
  }
}
