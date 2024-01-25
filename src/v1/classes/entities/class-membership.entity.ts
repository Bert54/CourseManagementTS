import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PersonEntity } from '../../people';
import { ClassEntity } from './class.entity';

@Entity('classmembership')
export class ClassMembershipEntity {
  @PrimaryColumn('person_id')
  person_id: number;

  @PrimaryColumn('class_name')
  class_name: string;

  @OneToOne(() => ClassEntity)
  @JoinColumn({ name: 'class_name', referencedColumnName: 'name' })
  class_info: ClassEntity;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'person_id', referencedColumnName: 'id' })
  person: PersonEntity;

  constructor(person_id: number, class_name: string) {
    this.person_id = person_id;
    this.class_name = class_name;
  }
}