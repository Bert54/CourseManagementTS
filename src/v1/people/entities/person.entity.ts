import {
  Column,
  Entity, JoinColumn, OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { ClassEntity, ClassMembershipEntity } from '../../classes/entities';

@Entity('person')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class PersonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ClassMembershipEntity, (membership) => membership.person)
  @JoinColumn({ name: 'id', referencedColumnName: 'person_id' })
  memberships: ClassMembershipEntity[];

  classes: ClassEntity[];

  protected constructor(name: string, id?: number) {
    this.name = name;
    this.id = id;
  }

  abstract getPermissions(): string[];
}
