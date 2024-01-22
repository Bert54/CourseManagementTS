import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity('person')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class PersonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  protected constructor(name: string, id?: number) {
    this.name = name;
    this.id = id;
  }

  abstract getPermissions(): string[];
}
