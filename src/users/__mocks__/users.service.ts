import { userStub } from '../../../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue(userStub()),
  findUserById: jest.fn().mockResolvedValue(userStub()),
  deleteUser: jest.fn().mockResolvedValue('123'),
  findAllUsers: jest.fn().mockResolvedValue([userStub()]),
});
