import { BadRequestError } from '../../common/errors';

export class CourseAlreadyExistsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
