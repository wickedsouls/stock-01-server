import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { userStub } from '../../test/stubs/user.stub';
import { ErrorMessages } from '../constants/errorMessages';

describe('UsersService', () => {
  let service: UsersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should create users service', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    it('should create new user', async () => {
      const user = await service.createUser(userStub());
      expect(user).toBeDefined();
      expect(user.name).toBe(userStub().name);
    });
    it('should throw error on duplicate user', async () => {
      await userModel.create(userStub());
      await expect(() => service.createUser(userStub())).rejects.toThrow(
        ErrorMessages.USER_ALREADY_EXISTS,
      );
    });
  });

  describe('find user', () => {
    it('should find all users', async () => {
      await userModel.create(userStub());
      await userModel.create({ ...userStub({ name: 'second' }) });
      const users = await service.findAllUsers();
      expect(users.length).toBe(2);
    });
    it('should find user by id', async () => {
      const savedUser = await userModel.create(userStub());
      const user = await service.findUserById(savedUser._id);
      expect(user).toBeDefined();
      expect(user.name).toBe(userStub().name);
    });
    it('should throw error on invalid id', async () => {
      expect(() => service.findUserById('123')).toThrow(
        ErrorMessages.INVALID_ID,
      );
    });
    it('should throw error if user is not found', async () => {
      const id = new Types.ObjectId();
      await expect(() => service.findUserById(id)).rejects.toThrow(
        ErrorMessages.USER_NOT_FOUND,
      );
    });
  });

  describe('delete user', () => {
    it('should delete user', async () => {
      const user = await userModel.create(userStub());
      await service.deleteUser(user._id);
      const users = await userModel.find({});
      expect(users.length).toBe(0);
    });
    it('should throw error on invalid id', async () => {
      await userModel.create(userStub());
      await expect(() => service.deleteUser('123')).toThrow(
        ErrorMessages.INVALID_ID,
      );
      const users = await userModel.find({});
      expect(users.length).toBe(1);
    });
    it('should throw error if user is not found', async () => {
      const id = new Types.ObjectId();
      await expect(() => service.deleteUser(id)).rejects.toThrow(
        ErrorMessages.USER_NOT_FOUND,
      );
    });
  });
});
