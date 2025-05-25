import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Pool } from 'pg';
import { Product } from './product.entity';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(DATABASE_POOL) private pool: Pool,
  ) {}

  async findAll(query?: string): Promise<Product[]> {
    const cacheKey = query
      ? `products:search:${query.toLowerCase()}`
      : 'products:all';

    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    let result: Product[];
    const client = await this.pool.connect();

    try {
      if (query && query.trim()) {
        const searchResult = await client.query(
          'SELECT id, name, price FROM products WHERE LOWER(name) LIKE LOWER($1) ORDER BY name',
          [`%${query.trim()}%`],
        );
        result = searchResult.rows;
      } else {
        const allResult = await client.query(
          'SELECT id, name, price FROM products ORDER BY name',
        );
        result = allResult.rows;
      }
    } finally {
      client.release();
    }

    await this.cacheManager.set(cacheKey, result);

    return result;
  }
}
