import { AddClassBaseDto } from './add-class-base.dto';
import { ClassEntity } from '../entities';

export class AddClassDto extends AddClassBaseDto {
  toClassEntity(): ClassEntity {
    this.format();
    return new ClassEntity(this.name);
  }
}
