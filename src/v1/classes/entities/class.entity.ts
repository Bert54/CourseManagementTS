import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClassMembershipEntity } from './class-membership.entity';
import { PersonEntity } from '../../people';
import { Exclude } from 'class-transformer';
import { CourseEntity } from '../../courses';

@Entity('class')
export class ClassEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => ClassMembershipEntity, (membership) => membership.class_info)
  @JoinColumn({ name: 'name', referencedColumnName: 'class_info' })
  @Exclude()
  members_cls: ClassMembershipEntity[];

  members: PersonEntity[];

  @OneToMany(() => CourseEntity, (course) => course.cls)
  @JoinColumn({ name: 'name', referencedColumnName: 'student_class' })
  @Exclude()
  courses: CourseEntity[];

  constructor(name: string) {
    this.name = name;
  }
}
