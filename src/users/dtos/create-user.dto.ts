import { Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsDefined,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../constants/users';

export class CreateUserDto {
  @Expose()
  @IsString()
  @IsDefined()
  @MaxLength(20)
  name: string;

  @Expose()
  @IsEnum(UserRole)
  role: UserRole;

  @IsDefined()
  @IsString()
  password: string;
}
