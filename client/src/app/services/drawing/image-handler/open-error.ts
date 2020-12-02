export class OpenError implements Error {
  constructor(message: string) {
    this.message = message;
    this.name = 'OpenError';
  }

  message: string;
  name: string;
}
