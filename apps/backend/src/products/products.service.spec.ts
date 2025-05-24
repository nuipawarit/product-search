import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return all products when no query is provided', () => {
      const result = service.findAll();

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 'p1', name: 'Product One', price: 100 },
        { id: 'p2', name: 'Product Two', price: 150 },
        { id: 'p3', name: 'Another Product', price: 200 },
      ]);
    });

    it('should return all products when empty query is provided', () => {
      const result = service.findAll('');

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 'p1', name: 'Product One', price: 100 },
        { id: 'p2', name: 'Product Two', price: 150 },
        { id: 'p3', name: 'Another Product', price: 200 },
      ]);
    });

    it('should filter products by name when query is provided', () => {
      const result = service.findAll('Product');

      expect(result).toHaveLength(3);
      expect(
        result.every((p: Product) => p.name.toLowerCase().includes('product')),
      ).toBe(true);
    });

    it('should filter products by case-insensitive search', () => {
      const result = service.findAll('PRODUCT');

      expect(result).toHaveLength(3);
      expect(
        result.every((p: Product) => p.name.toLowerCase().includes('product')),
      ).toBe(true);
    });

    it('should return filtered results for specific product', () => {
      const result = service.findAll('One');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 'p1', name: 'Product One', price: 100 });
    });

    it('should return filtered results for "Another"', () => {
      const result = service.findAll('Another');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'p3',
        name: 'Another Product',
        price: 200,
      });
    });

    it('should return empty array when no products match query', () => {
      const result = service.findAll('NonExistent');

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle partial matches correctly', () => {
      const result = service.findAll('Two');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 'p2', name: 'Product Two', price: 150 });
    });
  });
});
