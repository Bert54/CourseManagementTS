import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ClassEntity } from '../entities';

export class AddClassDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;

  format(): void {
    this.name = this.name.trim();
  }

  toClassEntity(): ClassEntity {
    this.format();
    return new ClassEntity(this.name);
  }
}
