import { BaseError } from '../../../common';

export class UnknownRoleError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
