import { NotFoundError } from '../../common';

export class MembershipNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
