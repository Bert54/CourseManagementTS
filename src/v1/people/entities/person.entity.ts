import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity('person')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class PersonEntity {
  protected constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: string;

  abstract getPermissions(): string[];
}
