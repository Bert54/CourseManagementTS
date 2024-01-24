import { ForbiddenError } from '../../common';

export class CourseCreationForbiddenError extends ForbiddenError {
  constructor(message: string) {
    super(message);
  }
}
