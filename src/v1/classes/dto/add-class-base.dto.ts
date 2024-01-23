import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ClassEntity } from '../entities';

export abstract class AddClassBaseDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;

  format(): void {
    this.name = this.name.trim();
  }

  abstract toClassEntity(): ClassEntity;
}
