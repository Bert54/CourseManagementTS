import { NotFoundError } from '../../common';

export class PersonNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
