import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { closeConnection } from '../src/db/DatabaseTest';
import * as request from 'supertest';
import { UserDto } from '../src/users/dtos/user.dto';
import { createProductStub } from './stubs/product.stubs';
import { ProductDto } from '../src/products/dtos';

describe('Product flow (e2e)', () => {
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

  let res: request.Response;
  let token: string;
  let product: ProductDto;
  let products: ProductDto[];

  it('should create, update and delete product', async () => {
    res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'me', password: 'secret' })
      .expect(201);
    token = res.body.access_token;
    expect(token).toBeDefined();
    res = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(createProductStub())
      .expect(201);
    product = res.body;
    expect(product).toBeDefined();
    expect(product.id).toBeDefined();

    res = await request(app.getHttpServer())
      .get('/products/all')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    products = res.body;
    expect(products.length).toBe(1);

    res = await request(app.getHttpServer())
      .put('/products/' + products[0].id)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 99 })
      .expect(200);
    product = res.body;
    expect(product.amount).toBe(99);
    await request(app.getHttpServer())
      .delete('/products/' + product.id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app.getHttpServer())
      .get('/products/' + product.id)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
