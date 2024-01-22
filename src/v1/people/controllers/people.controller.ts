import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PeopleService } from '../services';
import { AddPersonDto } from '../dto';
import { PersonEntity } from '../entities';
import { BaseError, handleError } from '../../common';
import { NumericIdValidator } from '../../../common';

@Controller('/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  addPerson(@Body() addPersonDto: AddPersonDto): Promise<PersonEntity> {
    return this.peopleService
      .addPerson(addPersonDto)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }

  @Get('/:id')
  getPersonById(@Param() id: NumericIdValidator): Promise<PersonEntity> {
    return this.peopleService.getPersonById(id.id).catch((error: BaseError) => {
      throw handleError(error);
    });
  }

  @Get('/name/:name')
  getPersonByName(@Param('name') name: string): Promise<PersonEntity> {
    return this.peopleService
      .getPersonByName(name)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }
}
