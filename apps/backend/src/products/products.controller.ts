import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(@Query('q') q: string): { products: Product[] } {
    const list: Product[] = this.productsService.findAll(q);
    return { products: list };
  }
}
