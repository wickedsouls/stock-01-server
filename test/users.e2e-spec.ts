import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { closeConnection } from '../src/db/DatabaseTest';
import { userStub } from './stubs/user.stub';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await closeConnection();
  });

  it('create, read, delete user flow', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(userStub())
      .expect(201);
    const user = res.body;
    expect(user).toBeDefined();
    expect(user.name).toBe(userStub().name);
  });
});
