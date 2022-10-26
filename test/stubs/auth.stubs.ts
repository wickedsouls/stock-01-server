import { UserRole } from '../../src/constants/users';
import { CreateUserDto } from '../../src/users/dtos/create-user.dto';

export const authTokenStubs = () => {
  return { auth_token: '123' };
};

export const authCredentialsStubs = (): CreateUserDto => {
  return {
    name: 'me',
    password: 'secret',
    role: UserRole.CUSTOMER,
  };
};
