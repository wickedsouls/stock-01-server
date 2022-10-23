import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create users service', () => {
    expect(service).toBeDefined();
  });
});
