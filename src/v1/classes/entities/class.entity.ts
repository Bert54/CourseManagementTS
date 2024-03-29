import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClassMembershipEntity } from './class-membership.entity';
import { Exclude } from 'class-transformer';
import { PersonEntity } from '../../people/entities';
import { CourseEntity } from '../../courses/entities';

@Entity('class')
export class ClassEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany('ClassMembershipEntity', 'class_info')
  @JoinColumn({ name: 'name', referencedColumnName: 'class_info' })
  @Exclude()
  members_cls: ClassMembershipEntity[];

  members: PersonEntity[];

  @OneToMany('CourseEntity', 'cls')
  @JoinColumn({ name: 'name', referencedColumnName: 'student_class' })
  @Exclude()
  courses: CourseEntity[];

  constructor(name: string) {
    this.name = name;
  }
}
