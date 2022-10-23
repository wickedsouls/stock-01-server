import { User } from '../../src/schemas/user.schema';
import { UserRole } from '../../src/constants/users';

interface Options {
  name?: string;
  role?: UserRole;
}
export const userStub = (options: Options = {}): User => {
  const { name, role } = options;
  return {
    name: name || 'user',
    password: 'password',
    role: role || UserRole.ADMIN,
    createdAt: Date.now(),
  };
};
