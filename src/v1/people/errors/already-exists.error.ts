import { BadRequestError } from '../../common';

export class AlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
