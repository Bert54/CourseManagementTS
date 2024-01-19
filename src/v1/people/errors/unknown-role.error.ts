import { BadRequestError } from '../../common';

export class UnknownRoleError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
