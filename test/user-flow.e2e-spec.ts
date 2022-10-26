import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { closeConnection } from '../src/db/DatabaseTest';
import * as request from 'supertest';
import { authCredentialsStubs } from './stubs/auth.stubs';
import { decode } from 'jsonwebtoken';
import { UserDto } from '../src/users/dtos/user.dto';

describe('User flow (2e2)', () => {
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
    let token: string;
    let user: UserDto;

    // Register new user
    res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authCredentialsStubs())
      .expect(201);
    token = res.body.access_token;

    expect(token).toBeDefined();
    user = decode(token, { json: true }) as UserDto;
    expect(user.name).toBe(authCredentialsStubs().name);
    expect(user.id).toBeDefined();

    // Login with created user
    res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authCredentialsStubs())
      .expect(201);

    token = res.body.access_token;
    expect(token).toBeDefined();
    user = decode(token, { json: true }) as UserDto;
    expect(user.name).toBe(authCredentialsStubs().name);
    expect(user.id).toBeDefined();

    // Check if there is a created user
    res = await request(app.getHttpServer())
      .get('/users/all')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBe(1);

    // Delete user
    await request(app.getHttpServer())
      .delete('/users/' + user.id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Check if user was deleted
    res = await request(app.getHttpServer())
      .get('/users/all')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBe(0);
  });
});
