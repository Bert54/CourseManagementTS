import { BadRequestError } from '../../common/errors';

export class ClassAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
