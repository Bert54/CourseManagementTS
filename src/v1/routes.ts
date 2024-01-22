import { PeopleModule } from './people';
import { CoursesModule } from './courses';

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
];
