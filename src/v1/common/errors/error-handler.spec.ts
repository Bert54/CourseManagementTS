import { HttpStatus } from '@nestjs/common';

import { BadRequestError, NotFoundError } from './types';
import { genericErrorMessage, handleError } from './error-handler';

describe('handleError', () => {
  it('should handle BadRequestError', () => {
    const error = new BadRequestError('bad request error');

    const gottenError = handleError(error);

    expect(gottenError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    expect(gottenError.getResponse()).toEqual({
      status: HttpStatus.BAD_REQUEST,
      error: error.message,
    });
  });

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('not found error');

    const gottenError = handleError(error);

    expect(gottenError.getStatus()).toEqual(HttpStatus.NOT_FOUND);
    expect(gottenError.getResponse()).toEqual({
      status: HttpStatus.NOT_FOUND,
      error: error.message,
    });
  });

  it('should not handle error and return a generic InternalExceptionError', () => {
    const error = new Error('generic error');

    const gottenError = handleError(error);

    expect(gottenError.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(gottenError.getResponse()).toEqual({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: genericErrorMessage,
    });
  });
});
