import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClassEntity } from '../../classes/entities';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  teacher_id: number;

  @Column()
  student_class: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => ClassEntity, (cls) => cls.courses)
  @JoinColumn({ name: 'student_class', referencedColumnName: 'name' })
  cls: ClassEntity;

  constructor(
    teacher_id: number,
    student_class: string,
    title: string,
    content: string,
  ) {
    this.teacher_id = teacher_id;
    this.student_class = student_class;
    this.title = title;
    this.content = content;
  }
}
