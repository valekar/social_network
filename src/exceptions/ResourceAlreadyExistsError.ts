export class ResourceAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ResourceAlreadyExistsError.prototype);
  }
}
