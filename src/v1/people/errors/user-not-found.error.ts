import { NotFoundError } from '../../common';

export class UserNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
