import { PeopleModule } from './people/people.module';
import { CoursesModule } from './courses/courses.module';
import { ClassesModule } from './classes/classes.module';

const v1Prefix = '/api/v1';

export const RouteMapping = [
  {
    path: v1Prefix,
    module: PeopleModule,
  },
  {
    path: v1Prefix,
    module: CoursesModule,
  },
  {
    path: v1Prefix,
    module: ClassesModule,
  },
];
