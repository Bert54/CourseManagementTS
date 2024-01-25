import { ForbiddenError } from '../../common/errors';

export class CourseCreationForbiddenError extends ForbiddenError {
  constructor(message: string) {
    super(message);
  }
}
