import { BadRequestError } from '../../common/errors';

export class UnknownRoleError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
