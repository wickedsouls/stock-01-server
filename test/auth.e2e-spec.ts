import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { closeConnection } from '../src/db/DatabaseTest';
import * as request from 'supertest';
import { authCredentialsStubs } from './stubs/auth.stubs';

describe('Auth (2e2)', () => {
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

  it('should register, login and get all user info', async () => {
    let res: request.Response;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(authCredentialsStubs())
      .expect(201);

    res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authCredentialsStubs())
      .expect(201);
    const token = res.body.access_token;
    expect(token).toBeDefined();

    res = await request(app.getHttpServer())
      .get('/users/all')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBe(1);
  });
});
