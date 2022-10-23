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
    let res = await request(app.getHttpServer())
      .post('/users')
      .send(userStub())
      .expect(201);

    let user = res.body;

    expect(user).toBeDefined();
    expect(user.name).toBe(userStub().name);

    res = await request(app.getHttpServer()).get('/users/all').expect(200);
    const users = res.body;
    expect(users.length).toBe(1);

    res = await request(app.getHttpServer())
      .get(`/users/${users[0].id}`)
      .expect(200);
    user = res.body;

    await request(app.getHttpServer()).delete(`/users/${user.id}`).expect(200);
    res = await request(app.getHttpServer()).get('/users/all').expect(200);
    expect(res.body.length).toBe(0);
  });
});
