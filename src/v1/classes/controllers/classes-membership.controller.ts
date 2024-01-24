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
import { CheckPermission, CheckPermissionGuard } from '../../common';
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
    return this.classesMembershipService.joinClass(
      Number(personId),
      addMembershipDto,
    );
  }

  @Delete('/name/:name')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_JOIN)
  leaveClass(
    @Headers(headerWithPersonId) personId: string,
    @Param('name') className: string,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipService.leaveClass(
      Number(personId),
      className,
    );
  }
}
