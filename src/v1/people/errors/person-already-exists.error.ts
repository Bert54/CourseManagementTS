import { BadRequestError } from '../../common';

export class PersonAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
