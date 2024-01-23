import { BadRequestError } from '../../common';

export class ClassAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
