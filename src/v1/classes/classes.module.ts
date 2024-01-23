import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassesController, ClassesMembershipController } from './controllers';
import { ClassesMembershipService, ClassesService } from './services';
import { ClassEntity, ClassMembershipEntity } from './entities';
import { ClassesDao, ClassesMembershipDao } from './dao';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, ClassMembershipEntity])],
  controllers: [ClassesController, ClassesMembershipController],
  providers: [
    ClassesService,
    ClassesDao,
    ClassesMembershipService,
    ClassesMembershipDao,
  ],
})
export class ClassesModule {}
