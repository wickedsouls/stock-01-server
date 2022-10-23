import { Expose, Transform } from 'class-transformer';
import { UserRole } from '../../constants/users';

export class UserDto {
  @Expose()
  name: string;

  @Expose()
  @Transform((user) => user.value)
  id: string;

  @Expose()
  role: UserRole;
}
