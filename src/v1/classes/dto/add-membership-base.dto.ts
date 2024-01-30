import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ClassMembershipEntity } from '../entities';

export abstract class AddMembershipBaseDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  class_name: string;

  format(): void {
    this.class_name = this.class_name.trim();
  }

  abstract toClassMembershipEntity(personId: number): ClassMembershipEntity;
}
