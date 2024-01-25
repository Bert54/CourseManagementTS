import { NotFoundError } from '../../common/errors';

export class CourseNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
