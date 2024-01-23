import { Entity, PrimaryColumn } from 'typeorm';

@Entity('class')
export class ClassEntity {
  @PrimaryColumn()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
