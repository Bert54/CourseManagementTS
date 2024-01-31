import { NotFoundError } from '../../common/errors';

export class ClassNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
