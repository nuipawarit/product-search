import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from './product.entity';
import { products } from '../mock-data';

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findAll(query?: string): Promise<Product[]> {
    const cacheKey = query
      ? `products:search:${query.toLowerCase()}`
      : 'products:all';

    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    let result: Product[];
    if (query) {
      result = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );
    } else {
      result = products;
    }

    await this.cacheManager.set(cacheKey, result);

    return result;
  }
}
