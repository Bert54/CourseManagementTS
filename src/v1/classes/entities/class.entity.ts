import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClassMembershipEntity } from './class-membership.entity';

@Entity('class')
export class ClassEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => ClassMembershipEntity, (membership) => membership.class_info)
  @JoinColumn({ name: 'name', referencedColumnName: 'class_info' })
  members: ClassMembershipEntity[];

  constructor(name: string) {
    this.name = name;
  }
}
