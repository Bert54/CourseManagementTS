import { NotFoundError } from '../../common';

export class ClassNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
