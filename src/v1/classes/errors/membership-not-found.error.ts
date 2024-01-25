import { NotFoundError } from 'rxjs';

export class MembershipNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
