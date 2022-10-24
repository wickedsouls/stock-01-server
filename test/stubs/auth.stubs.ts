import { AuthDto } from '../../src/auth/dtos/auth.dto';

export const authTokenStubs = () => {
  return { auth_token: '123' };
};

export const authCredentialsStubs = (): AuthDto => {
  return {
    name: 'me',
    password: 'secret',
  };
};
