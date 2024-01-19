import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { PeopleService } from '../services';
import { AddPersonDto } from '../dto';
import { PersonEntity } from '../entities';
import { BaseError, handleError } from '../../common';

@Controller('/people')
@UseInterceptors(ClassSerializerInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getHello(): string {
    return this.peopleService.getHello();
  }

  @Post()
  addUser(@Body() addPersonDto: AddPersonDto): Promise<PersonEntity> {
    return this.peopleService
      .addPerson(addPersonDto)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }

  @Get('/:id')
  getUserById(@Param('id') id: number): Promise<PersonEntity> {
    return this.peopleService.getPersonById(id).catch((error: BaseError) => {
      throw handleError(error);
    });
  }

  @Get('/name/:name')
  getUserByName(@Param('name') name: string): Promise<PersonEntity> {
    return this.peopleService
      .getPersonByName(name)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }
}
