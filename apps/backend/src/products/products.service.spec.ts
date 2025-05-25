import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let cacheManager: any;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('findAll', () => {
    it('should return all products when no query is provided', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll();

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 'p1', name: 'Product One', price: 100 },
        { id: 'p2', name: 'Product Two', price: 150 },
        { id: 'p3', name: 'Another Product', price: 200 },
      ]);
      expect(cacheManager.get).toHaveBeenCalledWith('products:all');
      expect(cacheManager.set).toHaveBeenCalledWith('products:all', result);
    });

    it('should return cached products when available', async () => {
      const cachedProducts = [{ id: 'p1', name: 'Product One', price: 100 }];
      cacheManager.get.mockResolvedValue(cachedProducts);

      const result = await service.findAll();

      expect(result).toEqual(cachedProducts);
      expect(cacheManager.get).toHaveBeenCalledWith('products:all');
      expect(cacheManager.set).not.toHaveBeenCalled();
    });

    it('should return all products when empty query is provided', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('');

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 'p1', name: 'Product One', price: 100 },
        { id: 'p2', name: 'Product Two', price: 150 },
        { id: 'p3', name: 'Another Product', price: 200 },
      ]);
    });

    it('should filter products by name when query is provided', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('Product');

      expect(result).toHaveLength(3);
      expect(
        result.every((p: Product) => p.name.toLowerCase().includes('product')),
      ).toBe(true);
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:product');
    });

    it('should filter products by case-insensitive search', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('PRODUCT');

      expect(result).toHaveLength(3);
      expect(
        result.every((p: Product) => p.name.toLowerCase().includes('product')),
      ).toBe(true);
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:product');
    });

    it('should return filtered results for specific product', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('One');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 'p1', name: 'Product One', price: 100 });
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:one');
    });

    it('should return filtered results for "Another"', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('Another');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'p3',
        name: 'Another Product',
        price: 200,
      });
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:another');
    });

    it('should return empty array when no products match query', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('NonExistent');

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
      expect(cacheManager.get).toHaveBeenCalledWith(
        'products:search:nonexistent',
      );
    });

    it('should handle partial matches correctly', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findAll('Two');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 'p2', name: 'Product Two', price: 150 });
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:two');
    });
  });
});
