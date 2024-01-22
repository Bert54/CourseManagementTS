import { HttpException, HttpStatus } from '@nestjs/common';

import { BadRequestError, BaseError, ForbiddenError, NotFoundError, UnauthorizedError } from './types';

export const genericErrorMessage: string =
  'Something went wrong while processing the request';

export const handleError = (error: BaseError): HttpException => {
  if (!error) {
    // no error => log here the inappropriate use of this function
  }

  // BadRequestError => return a 400
  if (error instanceof BadRequestError) {
    return new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: error,
      },
    );
  }

  // NotFoundError => return a 404
  if (error instanceof NotFoundError) {
    return new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      },
      HttpStatus.NOT_FOUND,
      {
        cause: error,
      },
    );
  }

  // UnauthorizedError => return a 401
  if (error instanceof UnauthorizedError) {
    return new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: error.message,
      },
      HttpStatus.UNAUTHORIZED,
      {
        cause: error,
      },
    );
  }

  // ForbiddenError => return a 403
  if (error instanceof ForbiddenError) {
    return new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: error.message,
      },
      HttpStatus.FORBIDDEN,
      {
        cause: error,
      },
    );
  }

  // Unknown or unhandled error => just return an error 500
  return new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: genericErrorMessage,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
    {
      cause: error,
    },
  );
};
