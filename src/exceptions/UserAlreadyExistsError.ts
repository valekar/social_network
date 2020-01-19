export class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}
