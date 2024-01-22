import { NotFoundError } from '../../common';

export class CourseNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
