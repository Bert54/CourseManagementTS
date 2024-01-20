import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity('person')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class PersonEntity {
  protected constructor(name: string, id?: number) {
    this.name = name;
    this.id = id;
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  abstract getPermissions(): string[];
}
