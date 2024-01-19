import { HttpException, HttpStatus } from '@nestjs/common';
import { BadRequestError } from './bad-request-error';
import { BaseError } from './base-error';

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
};
