import { BaseError } from '../../../common';

export class AlreadyExistsError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
