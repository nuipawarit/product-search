import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { products } from '../mock-data';

@Injectable()
export class ProductsService {
  findAll(query?: string): Product[] {
    if (query) {
      return products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return products;
  }
}
