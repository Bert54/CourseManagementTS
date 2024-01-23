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
import {
  BaseError,
  CheckPermission,
  CheckPermissionGuard,
  handleError,
} from '../../common';
import { CLASS_CREATE, CLASS_DELETE } from '../../../common';
import { ClassEntity } from '../entities';
import { AddClassDto } from '../dto';
import { baseRoute } from '../constants';

@Controller(baseRoute)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get('/name/:name')
  getClass(@Param('name') className: string): Promise<ClassEntity> {
    return this.classesService.getClass(className).catch((error: BaseError) => {
      throw handleError(error);
    });
  }

  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_CREATE)
  addClass(@Body() addClassDto: AddClassDto): Promise<ClassEntity> {
    return this.classesService
      .addClass(addClassDto)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }

  @Delete('/name/:name')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_DELETE)
  deleteClassByName(@Param('name') name: string): Promise<ClassEntity> {
    return this.classesService.removeClass(name).catch((error: BaseError) => {
      throw handleError(error);
    });
  }
}
