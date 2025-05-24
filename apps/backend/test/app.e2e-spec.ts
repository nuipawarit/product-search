import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Complete Authentication and Product Search Flow', () => {
    it('should complete full workflow: login and search products', async () => {
      // Step 1: Login with valid credentials
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password',
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('token');
      const token = loginResponse.body.token;

      // Step 2: Use token to access protected products endpoint
      const productsResponse = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(productsResponse.body).toHaveProperty('products');
      expect(productsResponse.body.products).toHaveLength(3);

      // Step 3: Search for specific products
      const searchResponse = await request(app.getHttpServer())
        .get('/api/products?q=One')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(searchResponse.body.products).toHaveLength(1);
      expect(searchResponse.body.products[0].name).toBe('Product One');
    });

    it('should reject product access without authentication', async () => {
      // Try to access products without login
      await request(app.getHttpServer()).get('/api/products').expect(401);
    });

    it('should reject product access with invalid token', async () => {
      // Try to access products with invalid token
      await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should handle various search scenarios with valid auth', async () => {
      // Login first
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password',
        })
        .expect(201);

      const token = loginResponse.body.token;

      // Test various search scenarios
      const testCases = [
        { query: '', expectedCount: 3 },
        { query: 'Product', expectedCount: 3 },
        { query: 'One', expectedCount: 1 },
        { query: 'Another', expectedCount: 1 },
        { query: 'NonExistent', expectedCount: 0 },
        { query: 'PRODUCT', expectedCount: 3 }, // Case insensitive
      ];

      for (const testCase of testCases) {
        const response = await request(app.getHttpServer())
          .get(`/api/products?q=${testCase.query}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response.body.products).toHaveLength(testCase.expectedCount);
      }
    });

    it('should maintain consistent product data structure', async () => {
      // Login
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password',
        })
        .expect(201);

      const token = loginResponse.body.token;

      // Get products and verify structure
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.products).toEqual([
        { id: 'p1', name: 'Product One', price: 100 },
        { id: 'p2', name: 'Product Two', price: 150 },
        { id: 'p3', name: 'Another Product', price: 200 },
      ]);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      // Test malformed login request
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should handle missing headers gracefully', async () => {
      await request(app.getHttpServer()).get('/api/products').expect(401);
    });
  });
});
