import { BadRequestError } from '../../common/errors';

export class MembershipAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
