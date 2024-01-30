import { NotFoundError } from '../../common/errors';

export class PersonNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
