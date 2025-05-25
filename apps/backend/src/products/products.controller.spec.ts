import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
  };

  const mockProducts: Product[] = [
    { id: 'p1', name: 'Product One', price: 100 },
    { id: 'p2', name: 'Product Two', price: 150 },
    { id: 'p3', name: 'Another Product', price: 200 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return all products when no query is provided', async () => {
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.getProducts('');

      expect(result).toEqual({ products: mockProducts });
      expect(service.findAll).toHaveBeenCalledWith('');
    });

    it('should return filtered products when query is provided', async () => {
      const filteredProducts = [mockProducts[0]];
      mockProductsService.findAll.mockResolvedValue(filteredProducts);

      const result = await controller.getProducts('One');

      expect(result).toEqual({ products: filteredProducts });
      expect(service.findAll).toHaveBeenCalledWith('One');
    });

    it('should return empty products array when no matches found', async () => {
      mockProductsService.findAll.mockResolvedValue([]);

      const result = await controller.getProducts('NonExistent');

      expect(result).toEqual({ products: [] });
      expect(service.findAll).toHaveBeenCalledWith('NonExistent');
    });

    it('should handle undefined query parameter', async () => {
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.getProducts(undefined as any);

      expect(result).toEqual({ products: mockProducts });
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should pass through the exact query to service', async () => {
      const query = 'Product';
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      await controller.getProducts(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});
