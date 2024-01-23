import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('class')
export class ClassEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
