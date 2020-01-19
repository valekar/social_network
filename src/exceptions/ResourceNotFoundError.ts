export class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }

  resourceNotFoundError() {
    return "Resource Not Found Error : " + this.message;
  }
}
