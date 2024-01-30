import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  TableInheritance,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import type {
  ClassEntity,
  ClassMembershipEntity,
} from '../../classes/entities';

@Entity('person')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class PersonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany('ClassMembershipEntity', 'person')
  @JoinColumn({ name: 'id', referencedColumnName: 'person_id' })
  @Exclude()
  memberships: Relation<ClassMembershipEntity[]>;

  classes: ClassEntity[];

  protected constructor(name: string, id?: number) {
    this.name = name;
    this.id = id;
  }

  abstract getPermissions(): string[];
}
