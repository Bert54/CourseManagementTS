import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { PeopleService } from '../services';
import { AddPersonDto } from '../dto';
import { PersonEntity } from '../entities';
import { PERSON_CREATE } from '../../../common/constants';
import { NumericIdValidator } from '../../../common/validators';
import { PeopleRelationsEnum } from '../enums';
import {
  CheckPermission,
  CheckPermissionGuard,
} from '../../common/modules/authorization/check-permission';

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
    return this.peopleService.getPerson(
      {
        id: id.id,
      },
      [
        PeopleRelationsEnum.Memberships,
        PeopleRelationsEnum.Memberships_ClassInfo,
      ],
    );
  }

  @Get('/name/:name')
  getPersonByName(@Param('name') name: string): Promise<PersonEntity> {
    return this.peopleService.getPerson(
      {
        name: name,
      },
      [
        PeopleRelationsEnum.Memberships,
        PeopleRelationsEnum.Memberships_ClassInfo,
      ],
    );
  }
}
