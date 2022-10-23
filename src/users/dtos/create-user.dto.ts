import { Expose } from 'class-transformer';
import { IsString, IsDefined, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../constants/users';

export class CreateUserDto {
  @Expose()
  @IsString()
  @IsDefined()
  name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @Expose()
  @IsDefined()
  @IsString()
  password: string;
}
