import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Get auth token for protected routes
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password',
      });

    authToken = loginResponse.body.token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/products (GET)', () => {
    it('should return all products when authenticated', () => {
      return request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('products');
          expect(Array.isArray(res.body.products)).toBe(true);
          expect(res.body.products).toHaveLength(3);
          expect(res.body.products[0]).toHaveProperty('id');
          expect(res.body.products[0]).toHaveProperty('name');
          expect(res.body.products[0]).toHaveProperty('price');
        });
    });

    it('should return filtered products when query is provided', () => {
      return request(app.getHttpServer())
        .get('/api/products?q=One')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.products).toHaveLength(1);
          expect(res.body.products[0].name).toContain('One');
        });
    });

    it('should return multiple products for broader search', () => {
      return request(app.getHttpServer())
        .get('/api/products?q=Product')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.products).toHaveLength(3);
          res.body.products.forEach((product: any) => {
            expect(product.name.toLowerCase()).toContain('product');
          });
        });
    });

    it('should return empty array when no products match query', () => {
      return request(app.getHttpServer())
        .get('/api/products?q=NonExistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.products).toHaveLength(0);
        });
    });

    it('should handle case-insensitive search', () => {
      return request(app.getHttpServer())
        .get('/api/products?q=ANOTHER')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.products).toHaveLength(1);
          expect(res.body.products[0].name).toBe('Another Product');
        });
    });

    it('should return 401 when no auth token is provided', () => {
      return request(app.getHttpServer()).get('/api/products').expect(401);
    });

    it('should return 401 when invalid auth token is provided', () => {
      return request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 when malformed auth header is provided', () => {
      return request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });

    it('should handle empty query parameter', () => {
      return request(app.getHttpServer())
        .get('/api/products?q=')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.products).toHaveLength(3);
        });
    });

    it('should handle multiple query parameters correctly', () => {
      return request(app.getHttpServer())
        .get('/api/products?q=Product&other=param')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.products).toHaveLength(3);
        });
    });
  });
});
