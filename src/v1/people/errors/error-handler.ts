import { HttpException, HttpStatus } from '@nestjs/common';
import { AlreadyExistsError } from './already-exists.error';
import { BaseError } from '../../../common';
import { UnknownRoleError } from './unknown-role.error';

export const handleError = (error: BaseError): HttpException => {
  if (!error) {
    // no error => log here the inappropriate use of this function
  }

  console.log()

  // AlreadyExistsError, UnknownRoleError => return a 400
  if (
    error instanceof AlreadyExistsError ||
    error instanceof UnknownRoleError
  ) {
    return new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: error,
      },
    );
  }

  // Unknown or unhandled error => just return an error 500
  return new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Something went wrong while processing the request',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
    {
      cause: error,
    },
  );
}