import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { PasswordEncryptionService } from './password-encryption.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { getModelToken } from '@nestjs/mongoose';
import { authCredentialsStubs } from '../../test/stubs/auth.stubs';
import { ErrorMessages } from '../constants/errorMessages';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
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
        AuthService,
        JwtStrategy,
        PasswordEncryptionService,
        UsersService,
        UsersRepository,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '3600s' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register user', () => {
    it('should register new user', async () => {
      const user = await service.register(authCredentialsStubs());
      expect(user).toBeDefined();
      expect(user.name).toBe(authCredentialsStubs().name);
    });
    it('should throw error when registering same user again', async () => {
      await userModel.create(authCredentialsStubs());
      await expect(service.register(authCredentialsStubs())).rejects.toThrow(
        ErrorMessages.USER_ALREADY_EXISTS,
      );
    });
  });

  describe('login user', () => {
    it('should login user', async () => {
      const hash = await bcrypt.hash('secret', 11);
      await userModel.create({
        name: authCredentialsStubs().name,
        password: hash,
      });
      const token = await service.login({
        name: authCredentialsStubs().name,
        password: authCredentialsStubs().password,
      });
      expect(token).toBeDefined();
    });
    it('should fail to login with bad credentials', async () => {
      const hash = await bcrypt.hash('secret', 11);
      await userModel.create({
        name: authCredentialsStubs().name,
        password: hash,
      });
      await expect(
        service.login({ name: authCredentialsStubs().name, password: '123' }),
      ).rejects.toThrow(ErrorMessages.INVALID_CREDENTIALS);
    });
  });
});
