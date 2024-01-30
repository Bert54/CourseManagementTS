import { BadRequestError } from '../../common/errors';

export class PersonAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
