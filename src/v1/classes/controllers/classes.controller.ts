import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClassesService } from '../services';
import { ClassEntity } from '../entities';
import { AddClassDto } from '../dto';
import { baseRoute } from '../constants';
import {
  CheckPermission,
  CheckPermissionGuard,
} from '../../common/modules/authorization';
import { CLASS_CREATE, CLASS_DELETE } from '../../../common/constants';

@Controller(baseRoute)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get('/name/:name')
  getClass(@Param('name') className: string): Promise<ClassEntity> {
    return this.classesService.getClass(className);
  }

  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_CREATE)
  addClass(@Body() addClassDto: AddClassDto): Promise<ClassEntity> {
    return this.classesService.addClass(addClassDto);
  }

  @Delete('/name/:name')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_DELETE)
  deleteClassByName(@Param('name') name: string): Promise<ClassEntity> {
    return this.classesService.removeClass(name);
  }
}
