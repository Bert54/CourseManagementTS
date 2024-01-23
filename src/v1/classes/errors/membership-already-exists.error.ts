import { BadRequestError } from '../../common';

export class MembershipAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
