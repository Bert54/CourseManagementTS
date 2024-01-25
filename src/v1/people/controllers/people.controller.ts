import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { PeopleService } from '../services';
import { AddPersonDto } from '../dto';
import { PersonEntity } from '../entities';
import { PERSON_CREATE } from '../../../common/constants';
import {
  CheckPermission,
  CheckPermissionGuard,
} from '../../common/modules/authorization';
import { NumericIdValidator } from '../../../common/validators';

@Controller('/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(PERSON_CREATE)
  addPerson(@Body() addPersonDto: AddPersonDto): Promise<PersonEntity> {
    return this.peopleService.addPerson(addPersonDto);
  }

  @Get('/:id')
  getPersonById(@Param() id: NumericIdValidator): Promise<PersonEntity> {
    return this.peopleService.getPerson({
      id: id.id,
    });
  }

  @Get('/name/:name')
  getPersonByName(@Param('name') name: string): Promise<PersonEntity> {
    return this.peopleService.getPerson({
      name: name,
    });
  }
}
