import { NotFoundError } from 'rxjs';

export class PersonNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
