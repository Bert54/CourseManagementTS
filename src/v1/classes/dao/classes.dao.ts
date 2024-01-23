import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ClassEntity } from '../entities';
import { LoggerService } from '../../../common';

@Injectable()
export class ClassesDao {
  constructor(
    @InjectRepository(ClassEntity)
    private classesRepository: Repository<ClassEntity>,
    private logger: LoggerService,
  ) {}
}
