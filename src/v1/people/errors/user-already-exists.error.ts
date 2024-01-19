import { BadRequestError } from '../../common';

export class UserAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
