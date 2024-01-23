import { Controller } from '@nestjs/common';

import { ClassesService } from '../services';

@Controller('/groups')
export class ClassesController {
  constructor(private classesService: ClassesService) {
  }
}
