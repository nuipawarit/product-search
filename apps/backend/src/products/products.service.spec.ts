import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductsService } from './products.service';
import { DATABASE_POOL } from '../database/database.module';

describe('ProductsService', () => {
  let service: ProductsService;
  let cacheManager: any;
  let mockClient: any;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };

    const mockPool = {
      connect: jest.fn().mockResolvedValue(mockClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: DATABASE_POOL,
          useValue: mockPool,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('findAll', () => {
    it('should return all products when no query is provided', async () => {
      const mockProducts = [
        { id: 'p1', name: 'MacBook Pro 16"', price: 2499.00 },
        { id: 'p2', name: 'Wireless Gaming Mouse', price: 79.99 },
      ];

      cacheManager.get.mockResolvedValue(null);
      mockClient.query.mockResolvedValue({ rows: mockProducts });

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(cacheManager.get).toHaveBeenCalledWith('products:all');
      expect(cacheManager.set).toHaveBeenCalledWith('products:all', result);
    });

    it('should return cached products when available', async () => {
      const cachedProducts = [{ id: 'p1', name: 'MacBook Pro 16"', price: 2499.00 }];
      cacheManager.get.mockResolvedValue(cachedProducts);

      const result = await service.findAll();

      expect(result).toEqual(cachedProducts);
      expect(cacheManager.get).toHaveBeenCalledWith('products:all');
      expect(cacheManager.set).not.toHaveBeenCalled();
    });

    it('should filter products by query', async () => {
      const mockProducts = [
        { id: 'p1', name: 'MacBook Pro 16"', price: 2499.00 },
      ];

      cacheManager.get.mockResolvedValue(null);
      mockClient.query.mockResolvedValue({ rows: mockProducts });

      const result = await service.findAll('MacBook');

      expect(result).toEqual(mockProducts);
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:macbook');
    });

    it('should return empty array when no products match query', async () => {
      cacheManager.get.mockResolvedValue(null);
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await service.findAll('NonExistent');

      expect(result).toEqual([]);
      expect(cacheManager.get).toHaveBeenCalledWith('products:search:nonexistent');
    });
  });
}); 