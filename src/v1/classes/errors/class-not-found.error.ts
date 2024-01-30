import { NotFoundError } from 'rxjs';

export class ClassNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
