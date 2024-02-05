import {
  Body,
  Controller,
  Delete,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { baseRoute } from '../constants';
import { ClassMembershipEntity } from '../entities';
import { ClassesMembershipService } from '../services';
import { AddMembershipDto } from '../dto';
import { CLASS_JOIN, HEADER_WITH_PERSON_ID } from '../../../common/constants';
import {
  CheckPermission,
  CheckPermissionGuard,
} from '../../common/modules/authorization/check-permission';

@Controller(baseRoute + '/membership')
export class ClassesMembershipController {
  constructor(private classesMembershipService: ClassesMembershipService) {}

  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_JOIN)
  joinClass(
    @Headers(HEADER_WITH_PERSON_ID) personId: string,
    @Body() addMembershipDto: AddMembershipDto,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipService.joinClass(
      Number(personId),
      addMembershipDto,
    );
  }

  @Delete('/name/:name')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_JOIN)
  leaveClass(
    @Headers(HEADER_WITH_PERSON_ID) personId: string,
    @Param('name') className: string,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipService.leaveClass(
      Number(personId),
      className,
    );
  }
}
