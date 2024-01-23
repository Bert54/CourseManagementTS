import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';

import { baseRoute } from '../constants';
import { ClassMembershipEntity } from '../entities';
import { ClassesMembershipService } from '../services';
import {
  BaseError,
  CheckPermission,
  CheckPermissionGuard,
  handleError,
} from '../../common';
import { CLASS_JOIN, headerWithPersonId } from '../../../common';
import { AddMembershipDto } from '../dto';

@Controller(baseRoute + '/membership')
export class ClassesMembershipController {
  constructor(private classesMembershipService: ClassesMembershipService) {}

  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_JOIN)
  joinClass(
    @Headers(headerWithPersonId) personId: string,
    @Body() addMembershipDto: AddMembershipDto,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipService
      .joinClass(Number(personId), addMembershipDto)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }
}
